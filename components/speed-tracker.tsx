"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gauge, AlertCircle, MapPin, Settings2 } from "lucide-react";
import SpeedGraph from "@/components/speed-graph";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useState } from "react";

export default function SpeedTracker() {
  const [useMetric, setUseMetric] = useState(true);
  const {
    isTracking,
    error,
    speed,
    distance,
    speedHistory,
    startTracking,
    stopTracking
  } = useGeolocation(useMetric);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-2">
            <Gauge className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Speed Tracker</h1>
          </div>
          
          {error && (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-2">
                <p>{error}</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Make sure location services are enabled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Settings2 className="h-4 w-4" />
                  <span>Check browser permissions</span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <div className="text-6xl font-bold mb-2">
              {speed.toFixed(1)}
            </div>
            <div className="text-xl text-muted-foreground">
              {useMetric ? 'km/h' : 'mph'}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              onClick={isTracking ? stopTracking : startTracking}
              variant={isTracking ? "destructive" : "default"}
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Button>

            <div className="flex items-center space-x-2">
              <Switch
                id="unit-toggle"
                checked={useMetric}
                onCheckedChange={setUseMetric}
              />
              <Label htmlFor="unit-toggle">
                {useMetric ? 'Metric (km/h)' : 'Imperial (mph)'}
              </Label>
            </div>
          </div>

          {isTracking && (
            <div className="text-center">
              <p className="text-muted-foreground">
                Distance: {distance.toFixed(2)} {useMetric ? 'km' : 'mi'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {speedHistory.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Speed History</h2>
          <SpeedGraph data={speedHistory} useMetric={useMetric} />
        </Card>
      )}
    </div>
  );
}