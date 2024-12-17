export interface TrackingSession {
  startTime: number;
  endTime: number;
  averageSpeed: number;
  maxSpeed: number;
  distance: number;
}

export interface Position {
  latitude: number;
  longitude: number;
}