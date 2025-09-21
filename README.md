# Connector App Bridge Utility

A React Native utility app built with Expo that serves as a **test event generator and publisher** for the Lumiere mobile app. This app is designed to simulate real-world medical device events and publish them to the Lumiere app via App Bridge communication for testing and development purposes.

## 🎯 Purpose & Capabilities

This app is a **companion testing utility** that:

- **Generates realistic medical device events** (glucose readings, device status, alerts)
- **Publishes events to the Lumiere app** via secure App Bridge communication
- **Provides real-time event monitoring** and logging
- **Enables custom event testing** with configurable parameters
- **Supports multiple event types** for comprehensive testing scenarios

## 🚀 Key Features

### Event Generation

- **Hypoglycemia Events**: Low glucose alerts with customizable values (default: 55 mg/dL)
- **Hyperglycemia Events**: High glucose alerts with customizable values (default: 300 mg/dL)
- **Device Status Events**: Battery level, signal strength, device information
- **Alert Events**: Various alert types (low battery, connection lost, calibration needed, sensor errors)
- **Random Events**: Automated random event generation for stress testing

### App Bridge Integration

- **Secure Communication**: Uses `react-native-lx-app-bridge` for inter-app communication
- **Real-time Publishing**: Events are published to Lumiere app via shared streams
- **Connection Management**: Robust connect/disconnect handling with status monitoring
- **Error Handling**: Comprehensive error handling and user feedback

### User Interface

- **Intuitive Controls**: Simple tap-to-send event generation
- **Custom Parameters**: Configurable glucose values for hypo/hyper events
- **Real-time Monitoring**: Live event log with detailed event information
- **Status Indicators**: Visual connection status and event counters
- **Responsive Design**: Optimized for both iOS and Android devices

## 🏗️ Architecture

### Core Components

```
App.tsx
├── EventSender.tsx          # Event generation and publishing UI
├── EventMonitor.tsx         # Real-time event logging and display
└── Services/
    ├── AppBridgeService.ts  # Real App Bridge implementation
    ├── EventGenerator.ts    # Event creation and formatting
    └── AppBridgeTypes.ts    # TypeScript interfaces
```

### Event Flow

1. **User Interaction** → Event type selection (hypo/hyper/device/alert/random)
2. **Event Generation** → EventGenerator creates structured event data
3. **App Bridge Publishing** → AppBridgeService publishes to Lumiere app
4. **Real-time Monitoring** → EventMonitor displays sent events
5. **Lumiere Processing** → Lumiere app receives and processes events

## 📱 Supported Event Types

### Data Events (Glucose)

```typescript
{
  eventType: "cgm_hypo_low" | "cgm_hyper_high",
  properties: {
    glucose: number,           // Customizable glucose value
    glucose_unit: "mg/dL",
    sensor: {
      manufacturer: "Dexcom",
      serial_number: "E06819507836",
      model: "Dexcom-G7-Emulator"
    },
    // ... additional sensor data
  }
}
```

### Device Events

```typescript
{
  eventType: "device_status",
  properties: {
    deviceId: string,
    deviceName: "Test Glucose Monitor",
    batteryLevel: number,      // Random 0-100%
    signalStrength: number     // Random 1-5 bars
  }
}
```

### Alert Events

```typescript
{
  eventType: "device_alert",
  properties: {
    alertType: "low_battery" | "connection_lost" | "calibration_needed" | "sensor_error",
    message: string,
    priority: "high"
  }
}
```

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** or **npm** package manager
- **Expo CLI** (installed globally or via npx)
- **iOS Simulator** or **Android Emulator** (for testing)
- **Lumiere app** installed on device/simulator

### Installation Steps

1. **Clone and Install**:

   ```bash
   git clone <repository-url>
   cd connector-app-bridge-util
   yarn install
   ```

2. **Verify Setup**:

   ```bash
   npx expo-doctor
   # Should show: "No issues detected!"
   ```

3. **Launch App**:
   ```bash
   npx expo run:android    # Android
   npx expo run:ios        # iOS
   # OR
   npx expo start --clear  # Development server
   ```

## 🎮 Usage Guide

### 1. Launch & Connect

- Start the Connector App Bridge Utility
- Ensure Lumiere app is running on the same device/simulator
- Tap **"Connect"** button
- Wait for green "Connected" status

### 2. Generate Events

#### Custom Glucose Values

- Enter desired glucose value in the input field
- Default values: 55 mg/dL (hypo), 300 mg/dL (hyper)

#### Send Event Types

- **Send Hypo Event**: Low glucose alert with custom value
- **Send Hyper Event**: High glucose alert with custom value
- **Send Device Event**: Device status with random battery/signal
- **Send Alert Event**: Various alert types (battery, connection, etc.)
- **Send Random Event**: Random event type for comprehensive testing

### 3. Monitor Events

- View all sent events in the "Event Monitor" section
- See event details: timestamp, glucose values, device info, event IDs
- Use "Clear All" to reset event history

## 🔗 App Bridge Configuration

The app connects to Lumiere with these settings:

```typescript
const APP_CONFIG = {
  remoteAppId: "com.clinicalink.orion", // Target Lumiere app
  remoteAppUrlScheme: "lxhost", // URL scheme for communication
  iosAppGroupId: "group.com.clinicalink.Connector", // iOS app group
  linkingApi: Linking, // Expo linking API
};
```

### Stream Keys

- **`dataEvents`**: Glucose-related events (hypo/hyper)
- **`device`**: Device status and information
- **`alert`**: Alert and notification events

## 🛠️ Development

### Adding New Event Types

1. **Update Types** (`AppBridgeTypes.ts`):

   ```typescript
   export interface NewEventType extends SerializableMap {
     eventId: string;
     timestamp: string;
     eventType: string;
     properties: {
       // New event properties
     };
   }
   ```

2. **Add Generator Logic** (`EventGenerator.ts`):

   ```typescript
   generateNewEvent(): NewEventType {
     // Event generation logic
   }
   ```

3. **Update UI** (`EventSender.tsx`):
   ```typescript
   const handleSendNewEvent = async () => {
     const event = eventGenerator.generateNewEvent();
     sendEvent(event, "newStreamKey");
   };
   ```

### Debugging

- **Console Logging**: Uses structured format: `***** X.Y --- Message`
- **Event Tracking**: All events are logged with full details
- **Connection Status**: Real-time connection monitoring
- **Error Handling**: Comprehensive error catching and user feedback

## 📊 Event Monitoring

The app provides detailed event monitoring with:

- **Real-time Event Log**: All sent events with timestamps
- **Event Details**: Full event data including glucose values, device info
- **Event Counter**: Total events sent counter
- **Event Types**: Visual indicators for different event types
- **Clear Functionality**: Reset event history

## 🔍 Troubleshooting

### Common Issues

**App Won't Connect to Lumiere**:

- Ensure Lumiere app is running first
- Check both apps are on the same device/simulator
- Verify network connectivity

**Build Errors**:

- Run `npx expo install --fix` to resolve dependency issues
- Clear cache: `npx expo start --clear`
- Check TypeScript: `npx tsc --noEmit`

**Port Conflicts**:

- Use alternative port: `npx expo start --port 8083`
- Kill existing processes: `pkill -f expo`

### Debug Commands

```bash
# Check configuration
npx expo-doctor

# Clear all caches
npx expo start --clear --reset-cache

# TypeScript check
npx tsc --noEmit

# Clean install
rm -rf node_modules && yarn install
```

## 📦 Dependencies

### Core Dependencies

- **expo**: ~54.0.9 - Expo SDK framework
- **react**: 19.1.0 - React framework
- **react-native**: 0.81.4 - React Native framework
- **react-native-lx-app-bridge**: ^0.4.2 - Inter-app communication

### UI Dependencies

- **@expo/vector-icons**: ^15.0.2 - Icon library
- **expo-status-bar**: ~3.0.8 - Status bar management
- **expo-font**: ~14.0.8 - Font loading

### Development Dependencies

- **typescript**: ~5.9.2 - TypeScript support
- **@types/react**: ~19.1.0 - React type definitions

## 🎯 Use Cases

### Testing Scenarios

- **Glucose Alert Testing**: Verify Lumiere handles hypo/hyper events correctly
- **Device Status Monitoring**: Test device connectivity and battery alerts
- **Alert Processing**: Validate alert handling and user notifications
- **Stress Testing**: Use random events to test system resilience
- **Custom Value Testing**: Test edge cases with specific glucose values

### Development Support

- **Event Validation**: Verify event structure and data integrity
- **Integration Testing**: Test App Bridge communication reliability
- **Performance Testing**: Monitor event processing performance
- **Debugging**: Isolate issues with specific event types or values

## 📝 Project Structure

```
connector-app-bridge-util/
├── App.tsx                     # Main app component
├── index.ts                    # App entry point
├── src/
│   ├── components/
│   │   ├── EventSender.tsx     # Event generation UI
│   │   └── EventMonitor.tsx    # Event display UI
│   ├── services/
│   │   ├── AppBridgeService.ts # Real app bridge implementation
│   │   ├── EventGenerator.ts   # Event generation logic
│   │   └── SimpleEventService.ts # Mock service (unused)
│   └── types/
│       └── AppBridgeTypes.ts   # TypeScript interfaces
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
├── metro.config.js             # Metro bundler configuration
└── tsconfig.json               # TypeScript configuration
```

## 🤝 Contributing

### Code Standards

- **TypeScript**: No `any` types, strict typing required
- **Logging**: Use consistent format: `console.warn(' ***** X.Y --- Message')`
- **Error Handling**: Implement try-catch blocks for all async operations
- **Documentation**: Update README when adding new features

### Development Workflow

1. Follow existing code patterns and architecture
2. Add comprehensive error handling
3. Update TypeScript interfaces for new features
4. Test on both iOS and Android platforms
5. Update this README with new capabilities

## 📞 App Support - (thats you!)

For issues or questions:

1. **Check this README** for common solutions
2. **Run diagnostics**: `npx expo-doctor`
3. **Check logs**: Metro bundler and console output
4. **Verify setup**: Ensure Lumiere app is running and accessible

---
