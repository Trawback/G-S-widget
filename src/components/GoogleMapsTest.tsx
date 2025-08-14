'use client';
import React, { useEffect, useState } from 'react';

const GoogleMapsTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Checking...');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const checkGoogleMaps = () => {
      const checks = [
        { name: 'window.google', value: !!window.google },
        { name: 'window.google.maps', value: !!(window.google && window.google.maps) },
        { name: 'window.google.maps.places', value: !!(window.google && window.google.maps && window.google.maps.places) },
        { name: 'API Key', value: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }
      ];

      const allPassed = checks.every(check => check.value);
      
      if (allPassed) {
        setStatus('✅ All checks passed - Google Maps is working!');
        setDetails(checks.map(check => `${check.name}: ${check.value ? 'Yes' : 'No'}`).join('\n'));
      } else {
        setStatus('❌ Some checks failed');
        setDetails(checks.map(check => `${check.name}: ${check.value ? 'Yes' : 'No'}`).join('\n'));
      }
    };

    // Check immediately
    checkGoogleMaps();

    // Check again after a delay
    const timer = setTimeout(checkGoogleMaps, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Google Maps Status Check</h3>
      <p className="text-sm mb-2">{status}</p>
      <pre className="text-xs bg-white p-2 rounded border overflow-auto">
        {details}
      </pre>
    </div>
  );
};

export default GoogleMapsTest; 