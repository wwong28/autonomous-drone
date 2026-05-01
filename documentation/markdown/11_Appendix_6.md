**Appendix 6 — Spring Quarter Planning**

**Sprint Plan**

The following sprint goals were established at the start of Spring Quarter based on the two-month timeline. Work is tracked and assigned through Jira across six sprints. The Jira backlog is at [https://autonomous-drone.atlassian.net/jira/software/projects/AD/boards/1/backlog](https://autonomous-drone.atlassian.net/jira/software/projects/AD/boards/1/backlog) and the project repository is at [https://github.com/wwong28/autonomous-drone](https://github.com/wwong28/autonomous-drone).

| Sprint | Goals | Key deliverables |
| ----- | ----- | ----- |
| 3 | Acquire the LiteWing open-source drone kit. Connect the kit to the phone app over WiFi. Download and understand the ESP-Drone SDK and firmware. Establish how to reflash and reprogram the board. | Kit received. Phone app connects over WiFi. Firmware build environment set up. |
| 4 | Decide whether to extend the existing mobile app or rewrite for cflib. Evaluate remote control options. Map existing BLE commands to WiFi equivalents. | Architecture decision documented. WiFi branch of existing app created. Basic takeoff and land via cflib working. |
| 5 | Execute test plan against new hardware. Validate motor mapping, power-on behaviour, communications link, and basic flight using the six manufacturing tests from Appendix 3\. | All six tests run on LiteWing. Results logged. Bugs filed in Jira. |
| 6 | Flying milestone: liftoff and land, rotation, forward and back in manual mode, GPS positioning if applicable, and live video feed in the app. Autonomous Follow Me, Come to Me, and live video stream. Firmware update demo. | Stable manual flight. Follow Me working indoors. Video feed visible in app. OTA firmware update demonstrated. |
| 7 | Have everything working. Full integration of manual control, all three autonomous modes, video feed, and stable flight. Resolve remaining bugs. | Demo-ready build on GitHub. All Jira stories closed or formally deferred. Design document updated. |
| 8 | Final demo and SOSC presentation. Two-drone coordination will be demonstrated if time permits. | Live demo. SOSC presentation. Final design document submitted. |

