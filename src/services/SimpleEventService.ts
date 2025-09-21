import { eventGenerator } from "./EventGenerator";

/**
 * Simple event service that generates events without using App Bridge
 * This prevents conflicts with Lumiere's existing App Bridge setup
 */
export class SimpleEventService {
  private eventCounter = 0;

  async connect(): Promise<void> {
    console.warn(" ***** SIMPLE-1.0 --- Simple Event Service connected");
    // No actual connection needed - just simulate it
  }

  async disconnect(): Promise<void> {
    console.warn(" ***** SIMPLE-1.1 --- Simple Event Service disconnected");
    // No actual disconnection needed
  }

  isConnected(): boolean {
    return true; // Always connected for simple service
  }

  async addObjectToSharedStream(streamKey: string, obj: any): Promise<void> {
    console.warn(" ***** SIMPLE-1.2 --- Event generated:", streamKey);
    console.warn(
      " ***** SIMPLE-1.3 --- Event data:",
      JSON.stringify(obj, null, 2)
    );

    // For now, just log the event
    // In a real implementation, this would store the event in a shared location
    // that Lumiere can read from (like SharedPreferences, Keychain, or a file)

    this.eventCounter++;
    console.warn(
      " ***** SIMPLE-1.4 --- Event logged successfully (count:",
      this.eventCounter,
      ")"
    );
  }

  getEventCount(): number {
    return this.eventCounter;
  }
}

// Singleton instance
export const simpleEventService = new SimpleEventService();
