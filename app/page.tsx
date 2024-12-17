import SpeedTracker from '@/components/speed-tracker';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <SpeedTracker />
      </div>
    </main>
  );
}