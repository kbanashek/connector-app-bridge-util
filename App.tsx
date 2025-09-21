import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import EventSender from "./src/components/EventSender";
import EventMonitor from "./src/components/EventMonitor";
// Lazy import types to prevent startup crashes

export default function App() {
  const [sentEvents, setSentEvents] = useState<any[]>([]);

  const handleEventSent = (event: any) => {
    setSentEvents((prev) => [...prev, event]);
  };

  const handleClearAll = () => {
    setSentEvents([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <EventSender onEventSent={handleEventSent} />
        <EventMonitor sentEvents={sentEvents} onClearAll={handleClearAll} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
});
