import AppBridge from "react-native-lx-app-bridge";
import * as Linking from "expo-linking";
import {
  AppBridgeMock,
  SerializableMap,
  RemoteStreamParams,
  RemoteStreamResponse,
  RemoteStreamKey,
} from "../types/AppBridgeTypes";

/**
 * REAL App Bridge service for publishing events to Lumiere app
 * This app ONLY publishes events - Lumiere app listens and processes them
 */
export class AppBridgeService implements AppBridgeMock {
  private appBridge: any;
  private connected = false;
  private eventCounter = 0;

  constructor() {
    console.warn(" ***** REAL-BRIDGE-1.0 --- App Bridge Publisher initialized");
    // Don't initialize AppBridge immediately - wait until connect() is called
    this.appBridge = null;
  }

  private initializeAppBridge() {
    if (!this.appBridge) {
      // Configure the app bridge to connect to Lumiere app
      const APP_CONFIG = {
        remoteAppId: "com.clinicalink.orion", // Target Lumiere app
        remoteAppUrlScheme: "lxhost",
        iosAppGroupId: "group.com.clinicalink.Connector",
        linkingApi: Linking,
      };

      this.appBridge = AppBridge.getInstance(APP_CONFIG);
      console.warn(
        " ***** REAL-BRIDGE-1.1 --- App bridge instance created for publishing to Lumiere"
      );
    }
  }

  async connect(): Promise<void> {
    console.warn(
      " ***** REAL-BRIDGE-1.2 --- Connecting to Lumiere app for publishing..."
    );
    try {
      this.initializeAppBridge();
      await this.appBridge.connect();
      this.connected = true;
      console.warn(
        " ***** REAL-BRIDGE-1.3 --- Connected to Lumiere app - ready to publish events"
      );
    } catch (error) {
      console.warn(" ***** REAL-BRIDGE-1.4 --- Connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.warn(
      " ***** REAL-BRIDGE-1.5 --- Disconnecting from Lumiere app..."
    );
    try {
      if (this.appBridge) {
        await this.appBridge.disconnect();
      }
      this.connected = false;
      console.warn(" ***** REAL-BRIDGE-1.6 --- Disconnected from Lumiere app");
    } catch (error) {
      console.warn(" ***** REAL-BRIDGE-1.7 --- Disconnect error:", error);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async addObjectToSharedStream(
    streamKey: string,
    obj: SerializableMap
  ): Promise<void> {
    console.warn(
      " ***** REAL-BRIDGE-1.8 --- Publishing event to Lumiere app stream:",
      streamKey
    );
    console.warn(
      " ***** REAL-BRIDGE-1.9 --- Event data:",
      JSON.stringify(obj, null, 2)
    );

    if (!this.connected || !this.appBridge) {
      throw new Error("Not connected to Lumiere app");
    }

    try {
      await this.appBridge.addObjectToSharedStream(streamKey, obj);
      this.eventCounter++;
      console.warn(
        " ***** REAL-BRIDGE-1.10 --- Successfully published event to Lumiere app"
      );
    } catch (error) {
      console.warn(
        " ***** REAL-BRIDGE-1.11 --- Error publishing to Lumiere app:",
        error
      );
      throw error;
    }
  }

  // This app only publishes events - no need for listening methods
  async getItemsFromRemoteStream(
    streamKey: string,
    params: RemoteStreamParams
  ): Promise<RemoteStreamResponse> {
    throw new Error(
      "This app only generates events - use Lumiere app to get items"
    );
  }

  listenForChangesToRemoteStream(
    streamKey: string,
    callback: (key: string) => void
  ): { remove: () => void } {
    throw new Error(
      "This app only generates events - use Lumiere app to listen"
    );
  }

  // Helper method to get total event count
  getEventCount(): number {
    return this.eventCounter;
  }
}

// Singleton instance
export const appBridgeService = new AppBridgeService();
