// src/comms/BLE/ble.real.ts

import type {
  BleDeviceSummary,
  BleScanOptions,
  BleTelemetryCallback,
  DroneBleClient,
} from "./types.ts";

// Must match drone_ble/main/gatt_svr.c (NimBLE BLE_UUID128_INIT byte order).
const SERVICE_UUID = "59462f12-9543-9999-12c8-58b459a2712d";
const CHARACTERISTIC_UUID = "33333333-2222-2222-1111-111100000000";

// NOTE: We import the native lib only inside this file.
// This file must NOT be imported in Expo Go.
import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";

export class RealDroneBleClient implements DroneBleClient {
  private manager = new BleManager();
  private connected: Device | null = null;
  private telemetryUnsub: (() => void) | null = null;

  async scan(options?: BleScanOptions): Promise<BleDeviceSummary[]> {
    const timeoutMs = options?.timeoutMs ?? 5000;
    const minRssi = options?.minRssi ?? -90;
    const showUnnamed = options?.showUnnamed ?? false;
    const found = new Map<string, BleDeviceSummary>();

    return new Promise((resolve, reject) => {
      const stop = () => {
        try {
          this.manager.stopDeviceScan();
        } catch {}
      };

      const timer = setTimeout(() => {
        stop();
        const results = Array.from(found.values())
          .sort((a, b) => (b.rssi ?? -Infinity) - (a.rssi ?? -Infinity));
        resolve(results);
      }, timeoutMs);

      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          clearTimeout(timer);
          stop();
          reject(error);
          return;
        }
        if (!device) return;

        const name = device.name ?? device.localName ?? null;
        if (!showUnnamed && (!name || name === "Unknown")) return;

        const rssi = device.rssi ?? undefined;
        if (rssi != null && rssi < minRssi) return;

        found.set(device.id, { id: device.id, name: name ?? "Unknown", rssi });
      });
    });
  }

  async connect(deviceId: string): Promise<void> {
    // Clean up any previous connection
    await this.disconnect();

    const device = await this.manager.connectToDevice(deviceId, { autoConnect: true });
    this.connected = device;

    await device.discoverAllServicesAndCharacteristics();
  }

  async disconnect(): Promise<void> {
    if (this.telemetryUnsub) {
      this.telemetryUnsub();
      this.telemetryUnsub = null;
    }

    if (this.connected) {
      try {
        await this.connected.cancelConnection();
      } catch {}
      this.connected = null;
    }
  }

  getConnectedDeviceId(): string | null {
    return this.connected?.id ?? null;
  }

  async sendCommand(message: Uint8Array | string): Promise<void> {
    if (!this.connected) throw new Error("BLE: not connected");

    const bytes = typeof message === "string"
      ? Buffer.from(message, "utf8")
      : Buffer.from(message);
    const base64 = bytes.toString("base64");
    await this.connected.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      base64
    );
  }

  subscribeTelemetry(cb: BleTelemetryCallback): () => void {
    if (!this.connected) throw new Error("BLE: not connected");

    const sub = this.connected.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) return;
        if (!characteristic?.value) return;

        const decoded = Buffer.from(characteristic.value, "base64").toString("utf8");
        cb(decoded);
      }
    );

    const unsub = () => sub.remove();
    this.telemetryUnsub = unsub;
    return unsub;
  }
}