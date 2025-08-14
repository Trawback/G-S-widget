import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, placeDetails?: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter an address",
  label,
  required = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google) return;

    const options = {
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types']
    } as google.maps.places.AutocompleteOptions;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current?.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place) return;
      const displayAddress = place.formatted_address || place.name || '';
      if (displayAddress) {
        onChange(displayAddress, place);
      }
    });
  }, [onChange]);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleMapsLoaded(true);
        initializeAutocomplete();
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();
  }, [initializeAutocomplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ebc651] focus:border-transparent text-black"
          placeholder={isGoogleMapsLoaded ? placeholder : "Loading Google Maps..."}
          disabled={!isGoogleMapsLoaded}
        />
      </div>
      {!isGoogleMapsLoaded && (
        <p className="text-xs text-gray-500 mt-1">
          Loading address autocomplete...
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;