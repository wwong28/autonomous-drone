**Appendix 5 — Spring Quarter Update**

This appendix documents the team's revised approach for Spring Quarter. After completing the Fall prototype — a custom PCB flight controller with BLE, four brushless motors, and a React Native mobile app — the team re-evaluated the implementation path. The core design goals, need statement, goal statement, and design objective remain unchanged. What has changed is the prototype platform selected to implement those goals within the Spring Quarter timeline.

**1\. Platform Decision**

At the start of Spring Quarter, the team evaluated whether to continue developing the custom PCB or to adopt an open-source drone kit as the new hardware base. The primary constraints were the two-month timeline and the need to reach stable autonomous flight by Week 7\. The team decided to adopt an open-source kit.

**Decision**

The team selected the LiteWing ESP32-S3 open-source drone kit as the Spring prototype platform. The LiteWing uses an ESP32-S3 microcontroller — the same ESP32 family as the Fall custom PCB — so existing firmware knowledge, BLE command logic, and motor control functions transfer directly. Its firmware is Crazyflie-compatible ESP-Drone, providing a validated flight stack and a Python SDK (cflib) that enables scripted autonomous missions without requiring the team to implement PID control or sensor fusion from scratch.

The following table compares the two options considered.

| Criterion | Custom PCB (Fall) | Open-Source Kit (Spring) |
| ----- | ----- | ----- |
| Time to stable flight | Not yet achieved | Days — pre-validated flight stack |
| Autonomous SDK | Must build from scratch | Python cflib scripted missions |
| Camera/vision | Custom SPI/UART integration | Offboard OpenCV over WiFi |
| Primary communication | BLE (implemented) | WiFi 2.4 GHz |
| Cost | Custom PCB fabrication cost | $50 assembled kit |
| Open-source firmware | Custom C on ESP32-C3 | ESP-Drone (Crazyflie-compatible) |
| Team ESP32 familiarity | High | High — same MCU family |
| Decision | Fall prototype only | Selected for Spring Quarter |

**2\. Target Platform Specifications**

The LiteWing is a compact, WiFi-controlled open-source drone built around the ESP32-S3 microcontroller. Its PCB serves as both the circuit board and the airframe, keeping the design lightweight and easy to understand. The firmware is based on Espressif's ESP-Drone project, which is Crazyflie-compatible, meaning the drone can be programmed and monitored using the Crazyflie Python library (cflib) and the cfclient ground station. GPIO breakout pins allow optional sensors — such as a Time-of-Flight module for height hold and position hold — to be added without modifying the PCB.

| Component | Specification |
| ----- | ----- |
| MCU | ESP32-S3, dual-core Xtensa LX7 @ 240 MHz, 512 KB SRAM |
| Connectivity | 2.4 GHz 802.11 b/g/n WiFi; Bluetooth 5 LE |
| IMU | MPU-6050 — 3-axis gyroscope, 3-axis accelerometer |
| Motors | 4× coreless DC motors, PWM H-bridge control |
| Frame | PCB-as-frame, 100 mm × 100 mm, 45 g without battery |
| Power | 3.7 V 1S LiPo (not included); 5–7 min flight time |
| Firmware | Crazyflie-compatible ESP-Drone; supports cfclient and cflib |
| Control interface | Smartphone app (WiFi), Python cflib, or Arduino/ESP-IDF |
| Expandability | GPIO breakout pins; optional ToF sensor for height hold |
| Camera | No onboard camera — offboard vision via smartphone or module |
| Cost | $50 kit (PCB, motors, propellers, legs) |
| Open source | Firmware, schematics, and Gerber files are publicly available |

**3\. Communication Method — Spring Update**

The communication model shifts from BLE-primary to WiFi-primary for the Spring Quarter. WiFi provides the bandwidth required for video streaming and the low-latency control commands needed to support the autonomous modes targeted in Sprint 6\. BLE remains available on the ESP32-S3, but is not the primary link for flight control.

| Link | Protocol | Purpose | Status |
| ----- | ----- | ----- | ----- |
| Control (primary) | WiFi UDP | Flight commands and telemetry | Spring — new |
| Video stream | WiFi TCP/UDP | Live feed to mobile app | Sprint 6 target |
| BLE fallback | Bluetooth 5 LE | Basic pairing and legacy support | Available, not primary |
| Python SDK / autonomous | WiFi (cflib) | Scripted autonomous missions | Sprint 6 target |

**4\. Autonomous Features**

The core design goal remains unchanged: reduce manual piloting by 90% through autonomous flight behaviours. Three primary autonomous modes are targeted for Sprint 6 and must be demonstrable by Sprint 7\.

Because the LiteWing does not include an onboard camera, the team will use an offboard vision architecture. The smartphone camera — already integrated in the mobile application — captures live video. Computer vision processing runs on the phone or a companion laptop. Tracking results are translated into velocity commands and sent to the drone over WiFi using cflib. This approach avoids payload and weight constraints on the small airframe while enabling the full autonomous feature set within the sprint timeline.

The vision pipeline operates as follows. The phone or laptop captures live video. OpenCV detects and tracks the subject. The tracking error in x, y, and z is converted to velocity commands. Commands are sent to the drone over WiFi via cflib. The drone executes commands through the Crazyflie-compatible flight stack.

The following three autonomous modes are defined by their trigger, behaviour, and exit condition.

| Mode | Trigger | Behaviour | Exit condition |
| ----- | ----- | ----- | ----- |
| Follow Me | User taps Follow in the app | Drone tracks the subject's bounding box from the camera feed. Adjusts x, y, z velocity to keep the subject centred at a fixed distance of approximately 1–2 m. | User taps Stop, or link lost — hover then land |
| Come to Me | User taps Come to Me in the app | Drone navigates toward the detected subject until within approximately 0.5 m, then hovers in place. | Proximity threshold reached, or user taps Stop |
| Live Video Feed | User opens the Video screen | Drone streams camera feed over WiFi to mobile app in real time. The drone may hover or remain in manual mode — no autonomous flight behaviour is required for this mode. | User closes the Video screen or disconnects |

