# LiteWing (ESP32-S3) pairing and transport assumptions

This note records how a **LiteWing-class** drone (ESP32-S3, firmware derived from **ESP-Drone** / Crazyflie-style stacks) is expected to pair with a phone app. It is meant to align future app work (Wi‑Fi join, CRTP over UDP) before code lands. **Confirm all network endpoints and checksum rules on your exact firmware build** the first time you have hardware.

## Wi‑Fi pairing (user-facing)

- **SSID pattern:** `LiteWing_` followed by a hex identifier (often related to device/MAC), e.g. `LiteWing_aabbccddeeff`.
- **Default PSK (community / vendor guides):** `12345678` unless you or the board vendor changed it in firmware.
- **Join order:** Connect the phone to the drone’s soft AP first, then use the app’s link/connect action (same idea as the CircuitDigest LiteWing app flow).

### Android

- Some devices **fail to stay associated** or **route traffic incorrectly** when **mobile data** or **VPN** is active. If the link is flaky: turn off cellular data and VPN, or use **airplane mode** and re-enable **Wi‑Fi only**, then connect to `LiteWing_*`.
- **Disabling automatic switch to “better” networks** can help when the drone has no internet.

### iOS

- The system **does not expose a full Wi‑Fi scan API** like Android. Users typically **join `LiteWing_*` in Settings → Wi‑Fi**, then return to the app. The app should not assume it can discover the SSID by scan alone on iOS.

## Application transport (not BLE for stock LiteWing control)

- **Protocol:** **CRTP** (Crazyflie radio transport protocol), same family as ESP-Drone.
- **Carrier:** **UDP** datagrams between phone (station) and drone (access point).
- **Authoritative reference:** [ESP-Drone — Communication protocols](https://espressif-docs.readthedocs-hosted.com/projects/espressif-esp-drone/en/latest/communication.html) (stack diagram, CRTP, and UDP port table).

### IP and UDP ports (defaults to verify on device)

Espressif’s ESP-Drone documentation tabulates **UDP** usage, including **drone port 2390** and an app-side port **2399** for bidirectional exchange. The doc also uses a **example drone IPv4** (e.g. `192.168.43.42`) in that table.

**Do not hardcode in app code without confirming** on your build:

- Actual **drone/gateway address** on the AP network (may match ESP-Drone examples or your `sdkconfig`/logs).
- **Ports** if you customized them in firmware.
- **CRTP checksum** and packet layout: must match the C implementation in your firmware; mismatches produce “checksum” or dropped packets (see ESP-Drone issue discussions for Python clients).

## Relationship to this repo’s BLE path

- The **`drone_ble`** / **DroneBLE** path in this project is a **separate** GATT-based protocol (see `drone_ble/BLE_PROTOCOL_MOBILE.md`).
- **LiteWing stock control** is **Wi‑Fi + CRTP/UDP**, not that BLE service. Optional future use of BLE (e.g. provisioning) would be additional scope.

## First hardware bring-up checklist

1. Flash / use the intended firmware; note **AP SSID** and **password** from docs or `sdkconfig`.
2. From `idf.py monitor` or docs, confirm **UDP IP:ports** and **CRTP checksum** behavior.
3. Join with the phone; **ping or send a minimal CRTP link/ping** (if supported) before arming motors.
4. Record any **OEM-specific** values here or in build notes so the app defaults stay accurate.

## External references

- [CircuitDigest — Start Flying With LiteWing](https://circuitdigest.com/articles/start-flying-with-litewing) (Wi‑Fi join, app link, Android tips).
- [CircuitDigest — LiteWing wiki](https://circuitdigest.com/wiki/litewing/) (hardware overview, CRTP over Wi‑Fi).
- [ESP-Drone — Communication](https://espressif-docs.readthedocs-hosted.com/projects/espressif-esp-drone/en/latest/communication.html) (CRTP, UDP ports).
- [Bitcraze — CRTP](https://www.bitcraze.io/documentation/repository/crazyflie-firmware/master/functional-areas/crtp/) (port/channel semantics).
