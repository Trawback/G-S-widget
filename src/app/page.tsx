import LuxuryTransportWidget from '@/components/LuxuryTransportWidget';
import GoogleMapsTest from '@/components/GoogleMapsTest';

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-4 md:p-8">
      <div className="container mx-auto">
        <GoogleMapsTest />
        <LuxuryTransportWidget />
      </div>
    </main>
  );
}