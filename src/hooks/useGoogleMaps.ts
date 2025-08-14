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
    if (window.google && window.google.maps && window.google.maps.places) {
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
      console.log('Google Maps callback fired');
      // Wait a bit for the libraries to fully load
      setTimeout(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          console.log('Google Maps and Places library loaded successfully');
          setIsLoaded(true);
          setIsError(false);
        } else {
          console.warn('Google Maps callback fired but places library not available.');
          console.log('Google object:', !!window.google);
          console.log('Maps object:', !!(window.google && window.google.maps));
          console.log('Places library:', !!(window.google && window.google.maps && window.google.maps.places));
          setIsError(true);
        }
      }, 500); // Increased timeout to 500ms
    };

    // Prevent injecting multiple scripts
    const existingScript = document.getElementById('google-maps-js') as HTMLScriptElement | null;
    if (existingScript) {
      // If script exists but not loaded, wait for it
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.log('Script exists but libraries not loaded, waiting...');
        const checkLoaded = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            console.log('Libraries became available after waiting');
            setIsLoaded(true);
            setIsError(false);
          } else {
            setTimeout(checkLoaded, 200);
          }
        };
        checkLoaded();
      } else {
        setIsLoaded(true);
      }
      return;
    }

    console.log('Loading Google Maps script...');
    
    // Create the script to load Google Maps
    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Google Maps script loaded, waiting for callback...');
    };
    
    script.onerror = (e) => {
      setIsError(true);
      console.error('Error loading Google Maps script. Check API key, billing, enabled APIs, and referrer restrictions.', e);
    };

    document.head.appendChild(script);

    // Fallback timeout in case callback doesn't fire
    const timeout = setTimeout(() => {
      if (!isLoaded && !isError) {
        console.warn('Google Maps loading timeout. Checking if libraries are available...');
        if (window.google && window.google.maps && window.google.maps.places) {
          console.log('Libraries available after timeout');
          setIsLoaded(true);
          setIsError(false);
        } else {
          console.error('Libraries still not available after timeout');
          setIsError(true);
        }
      }
    }, 15000); // Increased timeout to 15 seconds

    return () => {
      clearTimeout(timeout);
      // Cleanup if the component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isLoaded, isError]);

  return { isLoaded, isError };
};