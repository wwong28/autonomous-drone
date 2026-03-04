import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useComms } from "../../src/context/CommsContext";
import { spacing, fontSizes, radii } from "../../src/theme/layout";

export default function TabLayout() {
    const comms = useComms();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
        <Tabs
            screenOptions={{
                tabBarStyle: { backgroundColor: "#0b1020", borderTopColor: "rgba(255,255,255,0.08)" },
                tabBarActiveTintColor: "#00f2ff",
                tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size ?? 24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="connect"
                options={{
                    title: "Connect",
                    tabBarIcon: ({ color, size }) => <Ionicons name="bluetooth" size={size ?? 24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="control"
                options={{
                    title: "Control",
                    tabBarIcon: ({ color, size }) => <Ionicons name="game-controller" size={size ?? 24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="video"
                options={{
                    title: "Video",
                    tabBarIcon: ({ color, size }) => <Ionicons name="videocam" size={size ?? 24} color={color} />,
                }}
            />
        </Tabs>
        <Pressable
            style={[styles.estopButton, { top: insets.top + spacing.sm }]}
            onPress={() => comms.send({ type: "ESTOP" })}
        >
            <Text style={styles.estopText}>E-STOP</Text>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    estopButton: {
        position: "absolute",
        right: spacing.lg,
        zIndex: 1000,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radii.sm,
        backgroundColor: "rgba(255,61,61,0.2)",
        borderWidth: 1,
        borderColor: "rgba(255,61,61,0.6)",
    },
    estopText: {
        fontSize: fontSizes.xs,
        fontWeight: "800",
        color: "#ff3d3d",
        letterSpacing: 1,
    },
});
