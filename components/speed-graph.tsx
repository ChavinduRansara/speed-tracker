"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SpeedGraphProps {
  data: number[];
  useMetric: boolean;
}

export default function SpeedGraph({ data, useMetric }: SpeedGraphProps) {
  const formattedData = data.map((speed, index) => ({
    time: index,
    speed: speed,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={formattedData}
          margin={{ top: 10, right: 30, left: 60, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--foreground))"
            label={{ 
              value: 'Time (seconds)', 
              position: 'bottom',
              offset: 20,
              style: {
                fill: 'hsl(var(--foreground))',
                fontSize: 12,
              }
            }}
            tick={{
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 12
            }}
          />
          <YAxis 
            stroke="hsl(var(--foreground))"
            label={{ 
              value: useMetric ? 'Speed (km/h)' : 'Speed (mph)', 
              angle: -90, 
              position: 'left',
              offset: 40,
              style: {
                fill: 'hsl(var(--foreground))',
                fontSize: 12,
              }
            }}
            tick={{
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 12
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
            }}
            formatter={(value: number) => [
              `${value.toFixed(1)} ${useMetric ? 'km/h' : 'mph'}`,
              'Speed'
            ]}
            labelFormatter={(label) => `${label}s ago`}
          />
          <Line 
            type="monotone" 
            dataKey="speed" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--background))',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}