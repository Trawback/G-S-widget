import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // If already loaded, do nothing
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setIsError(true);
      console.error('Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local');
      return;
    }

    // Global function that Google Maps will call when ready
    window.initMap = () => {
      setIsLoaded(true);
    };

    // Prevent injecting multiple scripts
    const existingScript = document.getElementById('google-maps-js') as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true), { once: true } as unknown as AddEventListenerOptions);
      return;
    }

    // Create the script to load Google Maps
    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
      }
    };
    
    script.onerror = () => {
      setIsError(true);
      console.error('Error loading Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if the component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return { isLoaded, isError };
};