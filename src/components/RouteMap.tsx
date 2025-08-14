'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface RouteMapProps {
  origin: string;
  destination: string;
  waypoints?: string[];
  className?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({
  origin,
  destination,
  waypoints = [],
  className = "w-full h-64 rounded-lg"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();
  }, []);

  const calculateRoute = useCallback(() => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    const waypointsFormatted = waypoints
      .filter(point => point.trim() !== '')
      .map(point => ({
        location: point,
        stopover: true,
      }));

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      waypoints: waypointsFormatted,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC, // Cambiar a métrico por defecto
    };

    directionsServiceRef.current.route(request, (result, status) => {
      if (status === 'OK' && result) {
        directionsRendererRef.current?.setDirections(result);
        
        // Extraer información de la ruta
        const route = result.routes[0];
        if (route && route.legs) {
          let totalDistance = 0;
          let totalDuration = 0;

          route.legs.forEach(leg => {
            if (leg.distance && leg.duration) {
              totalDistance += leg.distance.value;
              totalDuration += leg.duration.value;
            }
          });

          // Detectar si el origen está en USA para mostrar millas, sino kilómetros
          const isUSA = result.routes[0].legs[0].start_address.includes('USA') || 
                       result.routes[0].legs[0].start_address.includes('United States');

          const distanceText = isUSA 
            ? (totalDistance * 0.000621371).toFixed(1) + ' miles'
            : (totalDistance / 1000).toFixed(1) + ' km';

          setRouteInfo({
            distance: distanceText,
            duration: Math.round(totalDuration / 60) + ' min'
          });
        }
      } else {
        console.error('Error calculating route:', status);
      }
    });
  }, [origin, destination, waypoints]);

  useEffect(() => {
    if (origin && destination && window.google) {
      calculateRoute();
    }
  }, [origin, destination, waypoints, calculateRoute]);


  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Intentar obtener la ubicación del usuario, sino usar un centro mundial
    const defaultCenter = { lat: 20, lng: 0 }; // Centro del mundo
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current as HTMLDivElement, {
      zoom: 2 as number,
      center: defaultCenter,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ weight: 2 }]
        },
        {
          featureType: 'all',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#9c9c9c' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text',
          stylers: [{ visibility: 'on' }]
        }
      ] as google.maps.MapTypeStyle[]
    } as google.maps.MapOptions);

    // Intentar centrar en la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          mapInstanceRef.current?.setCenter(userLocation);
          mapInstanceRef.current?.setZoom(10);
        },
        () => {
          console.log('Could not get user location');
        }
      );
    }

    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      draggable: false,
      panel: undefined,
      polylineOptions: {
        strokeColor: '#ebc651',
        strokeWeight: 4,
        strokeOpacity: 0.8
      },
      markerOptions: {
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#ebc651',
          fillOpacity: 1,
          strokeColor: '#000000',
          strokeWeight: 2,
          scale: 8
        }
      }
    });

    directionsRendererRef.current?.setMap(mapInstanceRef.current);
  };

  return (
    <div className="space-y-4">
      <div ref={mapRef} className={className} />
      {routeInfo && (
        <div className="bg-[#ebc651]/20 p-4 rounded-lg border border-[#ebc651]">
          <h4 className="font-semibold text-black mb-2">Route Information:</h4>
          <div className="flex gap-4 text-sm text-black">
            <span><strong>Distance:</strong> {routeInfo.distance}</span>
            <span><strong>Estimated time:</strong> {routeInfo.duration}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;