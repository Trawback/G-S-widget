import LuxuryTransportWidget from '@/components/LuxuryTransportWidget';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 relative">
              <Image
                src="/Logo_icon.png"
                alt="Godandi & Sons Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold text-white">
              Godandi & Sons - Client Portal
            </h1>
          </div>
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Login</span>
          </Link>
        </div>
      </header>

      {/* Widget Container */}
      <div className="container mx-auto p-4 md:p-8">
        <LuxuryTransportWidget />
      </div>
    </main>
  );
} 