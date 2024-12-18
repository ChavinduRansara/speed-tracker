import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { calculateDistance } from '@/lib/utils/geo-utils';

interface UseGeolocationReturn {
  isTracking: boolean;
  error: string | null;
  speed: number;
  distance: number;
  speedHistory: number[];
  startTracking: () => void;
  stopTracking: () => void;
}

const SPEED_THRESHOLD = 0.5; // Speed threshold in m/s (about 1.8 km/h)
const SPEED_BUFFER_SIZE = 3; // Number of readings to average

export const useGeolocation = (useMetric: boolean): UseGeolocationReturn => {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speed, setSpeed] = useState(0);
  const [speedBuffer, setSpeedBuffer] = useState<number[]>([]);
  const [distance, setDistance] = useState(0);
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);
  const { toast } = useToast();

  const calculateSmoothedSpeed = (rawSpeed: number): number => {
    const newBuffer = [...speedBuffer, rawSpeed].slice(-SPEED_BUFFER_SIZE);
    setSpeedBuffer(newBuffer);
    
    // Calculate average speed from buffer
    const avgSpeed = newBuffer.reduce((a, b) => a + b, 0) / newBuffer.length;
    
    // Apply threshold
    return avgSpeed < SPEED_THRESHOLD ? 0 : avgSpeed;
  };

  const handlePositionUpdate = (position: GeolocationPosition) => {
    setError(null);
    
    // Get raw speed in m/s
    const rawSpeed = position.coords.speed || 0;
    
    // Apply smoothing and threshold
    const smoothedSpeed = calculateSmoothedSpeed(rawSpeed);
    
    // Convert to km/h or mph
    const currentSpeed = smoothedSpeed * (useMetric ? 3.6 : 2.237);
    
    setSpeed(currentSpeed);
    setSpeedHistory(prev => [...prev, currentSpeed]);
    
    if (lastPosition && smoothedSpeed > 0) {
      const newDistance = calculateDistance(
        lastPosition.coords.latitude,
        lastPosition.coords.longitude,
        position.coords.latitude,
        position.coords.longitude,
        useMetric
      );
      // Only add distance if speed is above threshold
      if (smoothedSpeed > SPEED_THRESHOLD) {
        setDistance(prev => prev + newDistance);
      }
    }
    
    setLastPosition(position);
  };

  const handleError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("Location access denied. Please enable location services in your browser settings and refresh the page.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Unable to determine your location. Please ensure your device's GPS is enabled and you have a clear view of the sky.");
        break;
      case error.TIMEOUT:
        setError("Location request timed out. Please check your internet connection and try again.");
        break;
      default:
        setError("An unexpected error occurred while accessing your location.");
        break;
    }
    stopTracking();
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        () => {
          const id = navigator.geolocation.watchPosition(
            handlePositionUpdate,
            handleError,
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
          setWatchId(id);
          setIsTracking(true);
          setSpeedHistory([]);
          setDistance(0);
          setLastPosition(null);
          setSpeedBuffer([]);
          setError(null);
          
          toast({
            title: "Tracking Started",
            description: "Your speed is now being monitored.",
          });
        },
        handleError
      );
    } catch (err) {
      setError("Failed to start tracking. Please try again.");
    }
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      setSpeedBuffer([]);
      
      toast({
        title: "Tracking Stopped",
        description: `Total distance: ${distance.toFixed(2)} ${useMetric ? 'km' : 'mi'}`,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    isTracking,
    error,
    speed,
    distance,
    speedHistory,
    startTracking,
    stopTracking
  };
};