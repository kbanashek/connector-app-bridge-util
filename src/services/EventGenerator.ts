import {
  TestEvent,
  DataEvent,
  DeviceEvent,
  AlertEvent,
  RemoteStreamKey,
} from "../types/AppBridgeTypes";

export class EventGenerator {
  private eventCounter = 0;

  generateHypoEvent(glucoseValue: number = 55): DataEvent {
    this.eventCounter++;
    const timestamp = new Date().toISOString();
    const eventId = `hypo-event-${this.eventCounter}`;

    return {
      eventId,
      timestamp,
      eventType: "cgm_hypo_low",
      properties: {
        id: `event-${this.eventCounter}`,
        hypo_id: `hypo-${this.eventCounter + 456}`,
        sensor: {
          manufacturer: "Dexcom",
          serial_number: "E06819507836",
          model: "Dexcom-G7-Emulator",
        },
        glucose_unit: "mg/dL",
        glucose: glucoseValue,
        app_install_unique_id: 12345,
        transmitter_time: Math.floor(Date.now() / 1000),
        sequence_number: this.eventCounter,
        reading_time: timestamp,
      },
    };
  }

  generateHyperEvent(glucoseValue: number = 300): DataEvent {
    this.eventCounter++;
    const timestamp = new Date().toISOString();
    const eventId = `hyper-event-${this.eventCounter}`;

    return {
      eventId,
      timestamp,
      eventType: "cgm_hyper_high",
      properties: {
        id: `event-${this.eventCounter}`,
        hyper_id: `hyper-${this.eventCounter + 789}`,
        sensor: {
          manufacturer: "Dexcom",
          serial_number: "E06819507836",
          model: "Dexcom-G7-Emulator",
        },
        glucose_unit: "mg/dL",
        glucose: glucoseValue,
        app_install_unique_id: 12345,
        transmitter_time: Math.floor(Date.now() / 1000),
        sequence_number: this.eventCounter,
        reading_time: timestamp,
      },
    };
  }

  generateDeviceEvent(deviceId: string = "test-device-123"): DeviceEvent {
    this.eventCounter++;
    const timestamp = new Date().toISOString();
    const eventId = `device-event-${this.eventCounter}`;

    return {
      eventId,
      timestamp,
      eventType: "device_status",
      properties: {
        id: `event-${this.eventCounter}`,
        deviceId,
        deviceName: "Test Glucose Monitor",
        batteryLevel: Math.floor(Math.random() * 100),
        signalStrength: Math.floor(Math.random() * 5) + 1,
      },
    };
  }

  generateAlertEvent(alertType: string = "low_battery"): AlertEvent {
    this.eventCounter++;
    const timestamp = new Date().toISOString();
    const eventId = `alert-event-${this.eventCounter}`;

    return {
      eventId,
      timestamp,
      eventType: "device_alert",
      properties: {
        id: `event-${this.eventCounter}`,
        alertType,
        message: `Test alert: ${alertType}`,
        priority: "high",
      },
    };
  }

  generateRandomEvent(): TestEvent {
    const eventTypes = ["hypo", "hyper", "device", "alert"];
    const randomType =
      eventTypes[Math.floor(Math.random() * eventTypes.length)];

    switch (randomType) {
      case "hypo":
        return this.generateHypoEvent(Math.floor(Math.random() * 40) + 30);
      case "hyper":
        return this.generateHyperEvent(Math.floor(Math.random() * 200) + 250);
      case "device":
        return this.generateDeviceEvent(
          `device-${Math.floor(Math.random() * 1000)}`
        );
      case "alert":
        const alertTypes = [
          "low_battery",
          "connection_lost",
          "calibration_needed",
          "sensor_error",
        ];
        return this.generateAlertEvent(
          alertTypes[Math.floor(Math.random() * alertTypes.length)]
        );
      default:
        return this.generateHypoEvent();
    }
  }

  getEventCount(): number {
    return this.eventCounter;
  }

  resetCounter(): void {
    this.eventCounter = 0;
  }
}

export const eventGenerator = new EventGenerator();
