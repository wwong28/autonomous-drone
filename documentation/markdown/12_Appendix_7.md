**Appendix 7 — Design Continuity**

The following design-level requirements are unchanged by the Spring platform pivot. Consistent with the distinction between design and prototype, the design document specifies what the system must do and how to verify it — not which tools or hardware implement it.

The need statement, goal statement, and design objective of a 90% reduction in manual piloting are unchanged. The three personas — Alex (YouTuber), Maya (Musician), and Daniel (Film Producer) — and their filming use cases are unchanged. The command protocol design is unchanged; only the transport layer shifts from BLE to WiFi. The command set (TAKEOFF, LAND, HOVER, ASCEND, DESCEND, ESTOP, RETURNHOME, FOLLOWTOGGLE) remains the same. The six manufacturing tests in Appendix 3 (MECH-01 through FLT-01) still define acceptance criteria and will be re-executed against the LiteWing hardware in Sprint 5\.

The sustainability statement for rechargeable batteries, replaceable components, and smartphones as primary controllers still applies. The block diagrams, wiring diagrams, and state transition diagrams from the Design section remain architecturally valid. Specific pin assignments and WiFi state transitions will be updated in a future revision once Sprint 4 integration is complete.

