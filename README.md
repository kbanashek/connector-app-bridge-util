# Lumiere Test App

A React Native test application built with Expo that generates and sends test events to the Lumiere mobile app via App Bridge communication.

## Overview

This test app is designed to simulate various medical device events (glucose readings, device status, alerts) and send them to the Lumiere app for testing purposes. It serves as a companion app for testing the Lumiere app's event handling capabilities.

## Features

- **Event Generation**: Generate various types of test events:
  - Hypoglycemia events (low glucose)
  - Hyperglycemia events (high glucose) 
  - Device status events
  - Alert events
  - Random mixed events
- **Custom Glucose Values**: Set custom glucose values for hypo/hyper events
- **Real-time Monitoring**: View all sent events in real-time
- **App Bridge Integration**: Connect to Lumiere app via react-native-lx-app-bridge

## Prerequisites

- Node.js (v16 or higher)
- Package manager: Yarn **OR** npm
- Expo CLI (installed globally or via npx)
- iOS Simulator or Android Emulator (for testing)
- Lumiere app installed on device/simulator

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd lumiere-test-app
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Verify installation**:
   ```bash
   npx expo-doctor
   ```
   Should show "17/17 checks passed. No issues detected!"

## Launch Instructions

### Method 1: Expo Development Server (Recommended)

1. **Start the development server**:
   ```bash
   npx expo start --clear
   ```
   
2. **If port 8081 is busy** (common when Lumiere app is running):
   ```bash
   npx expo start --clear --port 8082
   ```

3. **Launch on device/simulator**:
   - **iOS**: Press `i` in terminal or scan QR code with Camera app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in terminal

### Method 2: Direct Platform Launch

- **iOS Simulator**:
  ```bash
  npx expo run:ios
  ```

- **Android Emulator**:
  ```bash
  npx expo run:android
  ```

## Usage

### 1. Launch the App
- Start the app using one of the methods above
- The app will display the "Lumiere Test App" interface

### 2. Connect to Lumiere App
- Ensure the Lumiere app is running on your device/simulator
- Tap the **"Connect"** button in the test app
- Wait for the connection status to show "Connected" (green)

### 3. Send Test Events

#### Custom Glucose Values
- Enter a custom glucose value in the input field
- Default values: 55 mg/dL (hypo), 300 mg/dL (hyper)

#### Event Types
- **Send Hypo Event**: Generates hypoglycemia alert with custom glucose value
- **Send Hyper Event**: Generates hyperglycemia alert with custom glucose value  
- **Send Device Event**: Generates device status event (battery, signal, etc.)
- **Send Alert Event**: Generates general alert event
- **Send Random Event**: Generates a random event type for testing

### 4. Monitor Events
- All sent events appear in the "Event Monitor" section
- View event details including timestamp, glucose values, device info
- Use "Clear All" to reset the event history

## App Bridge Configuration

The app is configured to connect to the Lumiere app with these settings:

```typescript
const APP_CONFIG = {
  remoteAppId: 'com.clinicalink.orion', // Target Lumiere app
  remoteAppUrlScheme: 'lxhost',
  iosAppGroupId: 'group.com.clinicalink.Connector',
  linkingApi: Linking,
};
```

## Troubleshooting

### App Crashes on Launch
- **Solution**: Run `npx expo-doctor` to check for issues
- **Common fixes**:
  - Install missing dependencies: `npx expo install expo-font`
  - Clear cache: `npx expo start --clear`
  - Remove conflicting lock files (keep only yarn.lock)

### Connection Issues
- **Lumiere app not running**: Start the Lumiere app first
- **Port conflicts**: Use `--port 8082` if 8081 is busy
- **Network issues**: Ensure both apps are on same network

### Build Issues
- **TypeScript errors**: Run `npx tsc --noEmit` to check
- **Missing dependencies**: Run `yarn install` and `npx expo install --fix`

### Development Server Issues
- **Cache problems**: Use `--clear` flag
- **Port already in use**: Kill existing processes or use different port
- **Metro bundler issues**: Reset Metro cache: `npx expo start --clear --reset-cache`

## Project Structure

```
lumiere-test-app/
├── App.tsx                 # Main app component
├── index.ts               # App entry point
├── src/
│   ├── components/
│   │   ├── EventSender.tsx    # Event generation UI
│   │   └── EventMonitor.tsx   # Event display UI
│   ├── services/
│   │   ├── AppBridgeService.ts # Real app bridge implementation
│   │   └── EventGenerator.ts   # Event generation logic
│   └── types/
│       └── AppBridgeTypes.ts   # TypeScript interfaces
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Dependencies

### Core Dependencies
- **expo**: ~54.0.9 - Expo SDK
- **react**: 19.1.0 - React framework
- **react-native**: 0.81.4 - React Native framework
- **react-native-lx-app-bridge**: ^0.4.2 - App bridge communication

### UI Dependencies
- **@expo/vector-icons**: ^15.0.2 - Icon library
- **expo-status-bar**: ~3.0.8 - Status bar management
- **expo-font**: ~14.0.8 - Font loading

### Development Dependencies
- **typescript**: ~5.9.2 - TypeScript support
- **@types/react**: ~19.1.0 - React type definitions

## Development

### Adding New Event Types
1. Update `AppBridgeTypes.ts` with new event interfaces
2. Add generation logic in `EventGenerator.ts`
3. Add UI controls in `EventSender.tsx`
4. Update display logic in `EventMonitor.tsx`

### Debugging
- Use console.warn statements for logging (format: `***** X.Y --- Message`)
- Check Metro bundler logs for build issues
- Use React Native Debugger for advanced debugging

## Contributing

1. Follow TypeScript best practices (no `any` types)
2. Use consistent logging format: `console.warn(' ***** X.Y --- Message')`
3. Maintain proper error handling with try-catch blocks
4. Update this README when adding new features

## Support

For issues or questions:
1. Check this README for common solutions
2. Run `npx expo-doctor` for configuration issues
3. Check Metro bundler logs for build errors
4. Verify Lumiere app is running and accessible

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatible with**: Lumiere App v1.0+
