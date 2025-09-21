import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Lazy import everything to prevent startup crashes

interface EventSenderProps {
  onEventSent: (event: any) => void;
}

export default function EventSender({ onEventSent }: EventSenderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [customGlucose, setCustomGlucose] = useState("55");

  const handleConnect = async () => {
    if (isConnected) return;

    setIsConnecting(true);
    try {
      // Lazy import the service only when needed
      const { appBridgeService } = await import("../services/AppBridgeService");
      await appBridgeService.connect();
      setIsConnected(true);
      console.warn(" ***** UI-1.0 --- Connected to Lumiere app");
    } catch (error) {
      console.warn(" ***** UI-1.1 --- Connection failed:", error);
      Alert.alert(
        "Connection Failed",
        "Could not connect to Lumiere app. Make sure Lumiere is running."
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!isConnected) return;

    try {
      // Lazy import the service only when needed
      const { appBridgeService } = await import("../services/AppBridgeService");
      await appBridgeService.disconnect();
      setIsConnected(false);
      console.warn(" ***** UI-1.2 --- Disconnected from Lumiere app");
    } catch (error) {
      console.warn(" ***** UI-1.3 --- Disconnect error:", error);
    }
  };

  const sendEvent = async (event: any, streamKey: string) => {
    if (!isConnected) {
      Alert.alert("Not Connected", "Please connect to Lumiere app first");
      return;
    }

    try {
      // Lazy import the service only when needed
      const { appBridgeService } = await import("../services/AppBridgeService");
      await appBridgeService.addObjectToSharedStream(streamKey, event);
      onEventSent(event);
      console.warn(
        " ***** UI-1.4 --- Event sent successfully:",
        JSON.stringify(
          {
            streamKey,
            eventType: event.eventType,
            eventId: event.eventId,
            fullEvent: event,
          },
          null,
          2
        )
      );
    } catch (error) {
      console.warn(" ***** UI-1.5 --- Error sending event:", error);
      Alert.alert("Send Failed", "Could not send event to Lumiere app");
    }
  };

  const handleSendHypoEvent = async () => {
    const glucoseValue = parseInt(customGlucose) || 55;
    const { eventGenerator } = await import("../services/EventGenerator");
    const event = eventGenerator.generateHypoEvent(glucoseValue);
    sendEvent(event, "dataEvents");
  };

  const handleSendHyperEvent = async () => {
    const glucoseValue = parseInt(customGlucose) || 300;
    const { eventGenerator } = await import("../services/EventGenerator");
    const event = eventGenerator.generateHyperEvent(glucoseValue);
    sendEvent(event, "dataEvents");
  };

  const handleSendDeviceEvent = async () => {
    const { eventGenerator } = await import("../services/EventGenerator");
    const event = eventGenerator.generateDeviceEvent();
    sendEvent(event, "device");
  };

  const handleSendAlertEvent = async () => {
    const { eventGenerator } = await import("../services/EventGenerator");
    const event = eventGenerator.generateAlertEvent();
    sendEvent(event, "alert");
  };

  const handleSendRandomEvent = async () => {
    const { eventGenerator } = await import("../services/EventGenerator");
    const event = eventGenerator.generateRandomEvent();
    const streamKey =
      event.eventType.includes("hypo") || event.eventType.includes("hyper")
        ? "dataEvents"
        : event.eventType.includes("device")
        ? "device"
        : "alert";
    sendEvent(event, streamKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lumiere Test App</Text>
        <Text style={styles.subtitle}>App Bridge Event Sender</Text>
        <View
          style={[
            styles.statusButton,
            { backgroundColor: isConnected ? "#4CAF50" : "#F44336" },
          ]}
        >
          <Text style={styles.statusText}>
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.connectButton]}
            onPress={handleConnect}
            disabled={isConnected || isConnecting}
          >
            <Text style={styles.buttonText}>
              {isConnecting ? "Connecting..." : "Connect"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.disconnectButton]}
            onPress={handleDisconnect}
            disabled={!isConnected}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Glucose Value</Text>
        <TextInput
          style={styles.input}
          value={customGlucose}
          onChangeText={setCustomGlucose}
          placeholder="Enter glucose value"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Sender</Text>
        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={[styles.eventButton, styles.hypoButton]}
            onPress={handleSendHypoEvent}
            disabled={!isConnected}
          >
            <Ionicons name="trending-down" size={20} color="white" />
            <Text style={styles.eventButtonText}>Send Hypo Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.eventButton, styles.hyperButton]}
            onPress={handleSendHyperEvent}
            disabled={!isConnected}
          >
            <Ionicons name="trending-up" size={20} color="white" />
            <Text style={styles.eventButtonText}>Send Hyper Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.eventButton, styles.deviceButton]}
            onPress={handleSendDeviceEvent}
            disabled={!isConnected}
          >
            <Ionicons name="phone-portrait" size={20} color="white" />
            <Text style={styles.eventButtonText}>Send Device Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.eventButton, styles.alertButton]}
            onPress={handleSendAlertEvent}
            disabled={!isConnected}
          >
            <Ionicons name="warning" size={20} color="white" />
            <Text style={styles.eventButtonText}>Send Alert Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.eventButton, styles.randomButton]}
            onPress={handleSendRandomEvent}
            disabled={!isConnected}
          >
            <Ionicons name="shuffle" size={20} color="white" />
            <Text style={styles.eventButtonText}>Send Random Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2c5aa0", // LX primary blue
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
    fontWeight: "400",
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  statusText: {
    color: "white",
    fontWeight: "500",
    fontSize: 12,
  },
  section: {
    backgroundColor: "white",
    margin: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2c5aa0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  connectButton: {
    backgroundColor: "#4caf50",
  },
  disconnectButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 4,
    gap: 8,
  },
  eventButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    minWidth: "48%",
    justifyContent: "center",
    minHeight: 44,
  },
  hypoButton: {
    backgroundColor: "#2c5aa0", // Clinical Ink blue
  },
  hyperButton: {
    backgroundColor: "#2c5aa0", // Clinical Ink blue
  },
  deviceButton: {
    backgroundColor: "#2c5aa0", // Clinical Ink blue
  },
  alertButton: {
    backgroundColor: "#2c5aa0", // Clinical Ink blue
  },
  randomButton: {
    backgroundColor: "#4caf50", // Green for send event
  },
  eventButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 6,
    fontSize: 13,
  },
});
