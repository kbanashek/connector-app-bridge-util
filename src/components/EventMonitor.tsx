import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TestEvent } from "../types/AppBridgeTypes";
// Lazy import types to prevent startup crashes

interface EventMonitorProps {
  sentEvents: TestEvent[];
  onClearAll: () => void;
}

export default function EventMonitor({
  sentEvents,
  onClearAll,
}: EventMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatEvent = (event: TestEvent) => {
    const timestamp = new Date(event.timestamp).toLocaleTimeString();
    return `${event.eventType.toUpperCase()} - ${timestamp}`;
  };

  const getEventIcon = (event: TestEvent) => {
    if (event.eventType.includes("hypo") || event.eventType.includes("hyper")) {
      return "pulse";
    } else if (event.eventType.includes("device")) {
      return "phone-portrait";
    } else if (event.eventType.includes("alert")) {
      return "warning";
    }
    return "help";
  };

  const getEventColor = (event: TestEvent) => {
    if (event.eventType.includes("hypo")) {
      return "#FF5722";
    } else if (event.eventType.includes("hyper")) {
      return "#E91E63";
    } else if (event.eventType.includes("device")) {
      return "#9C27B0";
    } else if (event.eventType.includes("alert")) {
      return "#FF9800";
    }
    return "#607D8B";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Event Monitor</Text>
          <Text style={styles.count}>Total Events: {sentEvents.length}</Text>
        </View>
        <View style={styles.headerRight}>
          {sentEvents.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearAll}
              onPressIn={(e) => e.stopPropagation()}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="white"
            style={styles.expandIcon}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            Sent Events ({sentEvents.length})
          </Text>
          {sentEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="send" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No events sent yet</Text>
              <Text style={styles.emptySubtext}>
                Connect and send events to see them here
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.eventList}
              showsVerticalScrollIndicator={false}
            >
              {sentEvents.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <View style={styles.eventHeader}>
                    <Ionicons
                      name={getEventIcon(event)}
                      size={20}
                      color={getEventColor(event)}
                    />
                    <Text style={styles.eventType}>{formatEvent(event)}</Text>
                  </View>
                  <View style={styles.eventDetails}>
                    {event.eventType.includes("hypo") ||
                    event.eventType.includes("hyper") ? (
                      <Text style={styles.eventDetail}>
                        Glucose: {event.properties.glucose}{" "}
                        {event.properties.glucose_unit}
                      </Text>
                    ) : null}
                    {event.eventType.includes("device") && (
                      <Text style={styles.eventDetail}>
                        Device: {event.properties.deviceName}
                      </Text>
                    )}
                    {event.eventType.includes("alert") && (
                      <Text style={styles.eventDetail}>
                        Alert: {event.properties.message}
                      </Text>
                    )}
                    <Text style={styles.eventId}>ID: {event.eventId}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    backgroundColor: "#2c5aa0", // LX primary blue
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  count: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
    fontWeight: "400",
  },
  clearButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 11,
  },
  expandIcon: {
    marginLeft: 4,
  },
  content: {
    padding: 16,
    maxHeight: 250,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2c5aa0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
  eventList: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: "#fafafa",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#2c5aa0",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  eventType: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  eventDetails: {
    marginLeft: 28,
  },
  eventDetail: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
    fontWeight: "400",
  },
  eventId: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
    fontWeight: "400",
  },
});
