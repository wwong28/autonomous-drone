import React from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useComms } from "../../../src/context/CommsContext";
import { spacing, fontSizes, radii, getPanelDimensions } from "../../../src/theme/layout";

export default function Control() {
    const comms = useComms();
    const { width: screenWidth } = useWindowDimensions();
    const { contentPadding } = getPanelDimensions(screenWidth, 0);

    return (
        <View style={styles.root}>
            <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Manual Control</Text>
                    <Text style={styles.subtitle}>Direct drone control interface</Text>
                </View>

                {/* Control Area */}
                <View style={styles.controlArea}>
                    <Text style={styles.label}>Control Pad</Text>
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Joystick Controls</Text>
                        <Text style={styles.placeholderSubtext}>Coming soon</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Text style={styles.label}>Quick Actions</Text>
                    <View style={styles.actionRow}>
                        <Pressable style={[styles.btn, styles.btnSmall]} onPress={() => comms.send({ type: "TAKEOFF" })}>
                            <Text style={styles.btnLabel}>Takeoff</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, styles.btnSmall]} onPress={() => comms.send({ type: "LAND" })}>
                            <Text style={styles.btnLabel}>Land</Text>
                        </Pressable>
                    </View>
                    <View style={styles.actionRow}>
                        <Pressable style={[styles.btn, styles.btnSmall]} onPress={() => comms.send({ type: "HOVER" })}>
                            <Text style={styles.btnLabel}>Hover</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, styles.btnSmall]} onPress={() => comms.send({ type: "RETURN_HOME" })}>
                            <Text style={styles.btnLabel}>Return Home</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#05070a" },
    content: {
        flex: 1,
        paddingTop: spacing.xxxl + 20,
    },
    header: {
        marginBottom: spacing.xxxl,
    },
    title: {
        fontSize: fontSizes.xxl,
        fontWeight: "800",
        color: "white",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: fontSizes.sm,
        color: "rgba(255,255,255,0.4)",
        letterSpacing: 1,
        marginTop: spacing.xs,
    },
    label: { fontSize: fontSizes.xs, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: spacing.lg },
    controlArea: {
        marginBottom: spacing.xxxl,
    },
    placeholder: {
        height: 280,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.03)",
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        fontSize: fontSizes.lg,
        fontWeight: "600",
        color: "rgba(255,255,255,0.5)",
        letterSpacing: 1,
    },
    placeholderSubtext: {
        fontSize: fontSizes.sm,
        color: "rgba(255,255,255,0.3)",
        marginTop: spacing.sm,
    },
    quickActions: {
        marginBottom: spacing.xxxl,
    },
    actionRow: {
        flexDirection: "row",
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    btn: {
        minHeight: 72,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.03)",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    btnSmall: {
        height: 70,
    },
    btnLabel: { fontSize: fontSizes.sm, fontWeight: "800", letterSpacing: 2, color: "rgba(255,255,255,0.7)" },
});

