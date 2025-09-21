export interface SerializableMap {
  [key: string]: any;
}

export interface DataEvent extends SerializableMap {
  eventId: string;
  timestamp: string;
  eventType: string;
  properties: {
    id: string;
    hypo_id?: string;
    hyper_id?: string;
    sensor: {
      manufacturer: string;
      serial_number: string;
      model: string;
    };
    glucose_unit: string;
    glucose: number;
    app_install_unique_id: number;
    transmitter_time: number;
    sequence_number: number;
    reading_time: string;
    [key: string]: any;
  };
}

export interface DeviceEvent extends SerializableMap {
  eventId: string;
  timestamp: string;
  eventType: string;
  properties: {
    id: string;
    deviceId: string;
    deviceName: string;
    batteryLevel: number;
    signalStrength: number;
    [key: string]: any;
  };
}

export interface AlertEvent extends SerializableMap {
  eventId: string;
  timestamp: string;
  eventType: string;
  properties: {
    id: string;
    alertType: string;
    message: string;
    priority: string;
    [key: string]: any;
  };
}

export type TestEvent = DataEvent | DeviceEvent | AlertEvent;

export interface RemoteStreamParams {
  limit?: number;
  offset?: number;
}

export interface RemoteStreamResponse {
  items: SerializableMap[];
  hasMore: boolean;
}

export enum RemoteStreamKey {
  DATA = "data",
  DEVICE = "device",
  ALERT = "alert",
}

export interface AppBridgeMock {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  addObjectToSharedStream(
    streamKey: string,
    obj: SerializableMap
  ): Promise<void>;
  getItemsFromRemoteStream(
    streamKey: string,
    params: RemoteStreamParams
  ): Promise<RemoteStreamResponse>;
  listenForChangesToRemoteStream(
    streamKey: string,
    callback: (key: string) => void
  ): { remove: () => void };
}
