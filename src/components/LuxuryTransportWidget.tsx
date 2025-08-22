'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, ChevronRight, ChevronLeft, X, Plus } from 'lucide-react'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import AddressAutocomplete from './AddressAutocomplete';
import RouteMap from './RouteMap';
import VehicleDetailsModal, { VehicleDetails } from './VehicleDetailsModal';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

type Vehiculo = {
  id: number;
  nombre: string;
  capacidad: string;
  descripcion: string;
  precio: string;
  imagen: string;
  categoria: 'Sedan' | 'SUV' | 'Sprinter' | 'Van' | 'Bus' | 'Electric';
  features: string[];
  make?: string;
  model?: string;
  year?: number;
  engine?: string;
  fuelEfficiency?: string;
  gallery?: string[];
  variants?: {
    id: string;
    name: string;
    imagen: string;
    make?: string;
    model?: string;
    year?: number;
    engine?: string;
    fuelEfficiency?: string;
    features?: string[];
    gallery?: string[];
  }[];
};

type FormDataState = {
  nombre: string;
  telefono: string;
  email: string;
  tipoServicio: string | null;
  hourlyHours: number;
  fecha: string;
  hora: string;
  puntoRecogida: string;
  stops: string[];
  puntoDestino: string;
  vehiculoSeleccionado: Vehiculo | null;
  phoneCountryCode: string;
  phoneLocal: string;
};

const LuxuryTransportWidget = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { isLoaded: isMapsLoaded, isError: mapsError } = useGoogleMaps();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(''); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  
  const [formData, setFormData] = useState<FormDataState>({
    // Datos del cliente
    nombre: '',
    telefono: '',
    email: '',
    // Servicio
    tipoServicio: null,
    hourlyHours: 3,
    // Fecha y hora
    fecha: '',
    hora: '',
    // Ubicaciones
    puntoRecogida: '',
    stops: [],
    puntoDestino: '',
    // Vehículo
    vehiculoSeleccionado: null,
    phoneCountryCode: '+1',
    phoneLocal: ''
  });

  const countryCodes: { code: string; label: string }[] = [ // eslint-disable-line @typescript-eslint/no-unused-vars
    { code: '+1', label: 'United States/Canada' },
    { code: '+44', label: 'United Kingdom' },
    { code: '+34', label: 'Spain' },
    { code: '+33', label: 'France' },
    { code: '+49', label: 'Germany' },
    { code: '+39', label: 'Italy' },
    { code: '+61', label: 'Australia' },
    { code: '+81', label: 'Japan' },
    { code: '+86', label: 'China' },
    { code: '+971', label: 'UAE' },
  ];

  const categorias: { key: Vehiculo['categoria']; label: string; icon: string }[] = [
    { key: 'Sedan', label: 'Sedan', icon: '' },
    { key: 'SUV', label: 'SUV', icon: '' },
    { key: 'Sprinter', label: 'Sprinter', icon: '' },
    { key: 'Van', label: 'Van', icon: '' },
    { key: 'Bus', label: 'Bus', icon: '' },
    { key: 'Electric', label: 'Electric', icon: '' }
  ];
  const [selectedCategory, setSelectedCategory] = useState<Vehiculo['categoria']>('Sedan');
  const [infoVehicle, setInfoVehicle] = useState<Vehiculo | null>(null);
  const [selectedVariantByVehicleId, setSelectedVariantByVehicleId] = useState<Record<number, string>>({});

  const servicios = [
    'Airport Arrival',
    'Airport Departure',
    'Point to Point',
    'Hourly',
    'VIP Airport assistance',
    'VIP Greeter',
  ];

  const vehiculos: Vehiculo[] = [
    {
      id: 1,
      nombre: 'Premium Sedan',
      capacidad: '1-2 passengers',
      descripcion: 'Lexus LS',
      precio: 'From $150/hour',
      imagen: '/g&s_lexus.jpg',
      categoria: 'Sedan',
      features: ['Air Conditioning', 'Leather Seats', 'GPS Navigation'],
      make: 'Lexus LS',
      model: 'LS',
      year: 2024,
      engine: '3.0L Inline-6 Turbo + EQ Boost',
      fuelEfficiency: '22/29 MPG (city/hwy)',
      gallery: ['/g&s_lexus.jpg']
    },
    {
        id: 2,
        nombre: 'Luxury Sedan',
        capacidad: '1-2 passengers',
        descripcion: 'Mercedes-Benz S-Class',
        precio: 'From $150/hour',
        imagen: '/g&s_S450.jpg',
        categoria: 'Sedan',
        features: ['Air Conditioning', 'Leather Seats', 'GPS Navigation'],
        make: 'Mercedes-Benz',
        model: 'S-Class',
        year: 2024,
        engine: '3.0L Inline-6 Turbo + EQ Boost',
        fuelEfficiency: '22/29 MPG (city/hwy)',
        gallery: ['/g&s_S450.jpg']
      },
      {
        id: 3,
        nombre: 'Premium SUV',
        capacidad: '1-5 passengers',
        descripcion: 'Ford Expedition',
        precio: 'From $200/hour',
        imagen: '/g&s_explorer.jpg',
        categoria: 'SUV',
        features: ['Air Suspension', 'Captain Chairs', 'Premium Audio', 'Armored (MB3+)'],
        make: 'Ford',
        model: 'Explorer',
        year: 2024,
        engine: '6.2L V8',
        fuelEfficiency: '14/19 MPG (city/hwy)',
        gallery: ['/g&s_explorer.jpg']
      },
    {
      id: 4,
      nombre: 'Luxury SUV',
      capacidad: '1-5 passengers',
      descripcion: '',
      precio: 'From $200/hour',
      imagen: '/g&s_denall.jpg',
      categoria: 'SUV',
      features: ['Air Suspension', 'Captain Chairs', 'Premium Audio'],
      make: 'Chevrolet/GMC',
      model: 'Suburban/Yukon Denali',
      year: 2024,
      engine: '6.2L V8',
      fuelEfficiency: '14/19 MPG (city/hwy)',
      gallery: ['/g&s_suburban.jpg', '/g&s_denall.jpg'],
      variants: [
        {
          id: 'suburban',
          name: '',
          imagen: '/g&s_suburban.jpg',
          make: 'Chevrolet',
          model: 'Suburban',
          year: 2024,
          engine: '5.3L V8',
          fuelEfficiency: '15/20 MPG',
          features: ['Captain Chairs', 'Premium Audio'],
          gallery: ['/g&s_suburban.jpg']
        },
        {
          id: 'yukon-denali',
          name: '',
          imagen: '/g&s_denall.jpg',
          make: 'GMC',
          model: 'Yukon Denali',
          year: 2024,
          engine: '6.2L V8',
          fuelEfficiency: '14/19 MPG',
          features: ['Air Suspension', 'Premium Audio'],
          gallery: ['/g&s_denall.jpg']
        }
      ]
    },
    {
        id: 5,
        nombre: 'Armored SUV',
        capacidad: '1-5 passengers',
        descripcion: 'Chevrolet suburban armored',
        precio: 'From $200/hour',
        imagen: '/g&s_suburban.jpg',
        categoria: 'SUV',
        features: ['Air Suspension', 'Captain Chairs', 'Premium Audio', 'Armored (MB3+)'],
        make: 'Chevrolet',
        model: 'Suburban',
        year: 2024,
        engine: '6.2L V8',
        fuelEfficiency: '14/19 MPG (city/hwy)',
        gallery: ['/g&s_suburban.jpg']
      },
    {
      id: 6,
      nombre: 'Exclusive SUV',
      capacidad: '1-5 passengers',
      descripcion: '',
      precio: 'From $220/hour',
      imagen: '/g&s_escalade.jpg',
      categoria: 'SUV',
      features: ['Panoramic Roof', 'Massage Seats', 'Wireless Charging'],
      make: 'Cadillac',
      model: 'Escalade',
      year: 2024,
      engine: '5.3L V8',
      fuelEfficiency: '15/20 MPG (city/hwy)',
      gallery: ['/g&s_suburban.jpg', '/g&s_denall.jpg'],
      variants: [
        {
          id: 'escalade',
          name: '',
          imagen: '/g&s_escalade.jpg',
          make: 'Cadillac',
          model: 'Escalade',
          year: 2024,
          engine: '5.3L V8',
          fuelEfficiency: '15/20 MPG',
          features: ['Captain Chairs', 'Premium Audio'],
          gallery: ['/g&s_escalade.jpg']
        },
        {
          id: 'Mercedes GLS',
          name: '',
          imagen: '/g&s_450SUV.jpg',
          make: 'Mercedes-Benz',
          model: 'GLS',
          year: 2024,
          engine: '6.2L V8',
          fuelEfficiency: '14/19 MPG',
          features: ['Air Suspension', 'Premium Audio'],
          gallery: ['/g&s_450SUV.jpg']
        }
      ]
    },
    {
      id: 8,
      nombre: 'Premium Sprinter',
      capacidad: '1-16 passengers',
      descripcion: 'Mercedes-Benz Sprinter',
      precio: 'From $250/hour',
      imagen: '/g&s_sprinter copy.jpg',
      categoria: 'Sprinter',
      features: ['High Roof', 'Luggage Space', 'USB Power'],
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2024,
      engine: '2.0L Turbo Diesel',
      fuelEfficiency: '22 MPG combined',
      gallery: ['/g&s_sprinter copy.jpg']
    },
    {
        id: 9,
        nombre: 'Luxury Sprinter',
        capacidad: '1-12 passengers',
        descripcion: 'Mercedes-Benz Sprinter',
        precio: 'From $250/hour',
        imagen: '/g&s_sprinter_sm.jpg',
        categoria: 'Sprinter',
        features: ['High Roof', 'Luggage Space', 'USB Power'],
        make: 'Mercedes-Benz',
        model: 'Sprinter',
        year: 2024,
        engine: '2.0L Turbo Diesel',
        fuelEfficiency: '22 MPG combined',
        gallery: ['/g&s_sprinter_sm.jpg']
      },
    {
      id: 10,
      nombre: 'Mini Bus',
      capacidad: '1-24 passengers',
      descripcion: 'Luxury Mini Coach',
      precio: 'From $350/hour',
      imagen: '/g&s_irizar.jpg',
      categoria: 'Bus',
      features: ['Reclining Seats', 'On-board WiFi', 'Large Cargo'],
      make: 'Irizar',
      model: 'i6',
      year: 2023,
      engine: '12.0L Diesel',
      fuelEfficiency: 'N/A',
      gallery: ['/g&s_irizar.jpg', '/g&s_hyace.jpg']
    },
    {
      id: 11,
      nombre: 'Electric Sedan',
      capacidad: '1-4 passengers',
      descripcion: 'Tesla Model S, Mercedes EQS',
      precio: 'From $180/hour',
      imagen: '/g&s_lyriq.jpg',
      categoria: 'Electric',
      features: ['Zero Emissions', 'Autopilot', 'Premium Sound'],
      make: 'Cadillac',
      model: 'Lyriq',
      year: 2024,
      engine: 'Dual-Motor EV',
      fuelEfficiency: '95 MPGe combined',
      gallery: ['/g&s_lyriq.jpg', '/g&s_xc40.jpg']
    },
    {
        id: 12,
        nombre: 'Economy Van',
        capacidad: '1-12 passengers',
        descripcion: 'Toyota Hiace',
        precio: 'From $250/hour',
        imagen: '/g&s_hyace.jpg',
        categoria: 'Van',
        features: ['High Roof', 'Luggage Space', 'USB Power'],
        make: 'Toyota',
        model: 'Hiace',
        year: 2024,
        engine: '2.0L Turbo Diesel',
        fuelEfficiency: '22 MPG combined',
        gallery: ['/g&s_hyace.jpg']
      },
      {
        id: 13,
        nombre: 'premium minivan',
        capacidad: '1-6 passengers',
        descripcion: 'Honda Odyssey',
        precio: 'From $250/hour',
        imagen: '/g&s_odyssey.jpg',
        categoria: 'Van',
        features: ['High Roof', 'Luggage Space', 'USB Power'],
        make: 'Honda',
        model: 'Odyssey',
        year: 2024,
        engine: '2.0L Turbo Diesel',
        fuelEfficiency: '22 MPG combined',
        gallery: ['/g&s_odyssey.jpg']
      },
      {
        id: 14,
        nombre: 'Electric SUV',
        capacidad: '1-4 passengers',
        descripcion: 'Volvo XC40',
        precio: 'From $250/hour',
        imagen: '/g&s_xc40.jpg',
        categoria: 'Electric',
        features: ['High Roof', 'Luggage Space', 'USB Power'],
        make: 'Volvo',
        model: 'XC40',
        year: 2024,
        engine: '2.0L Turbo Diesel',
        fuelEfficiency: '22 MPG combined',
        gallery: ['/g&s_xc40.jpg']
      },
  ];

  const totalSteps = 6;

  // Generar resumen para el email
  const generateReservationSummary = () => {
    const variant = getActiveVariant(formData.vehiculoSeleccionado as Vehiculo);
    const vehicleDisplay = variant 
      ? `${formData.vehiculoSeleccionado?.nombre} - ${variant.name}`
      : formData.vehiculoSeleccionado?.nombre;

    return `
=== LUXURY CHAUFFEUR SERVICE RESERVATION ===

PERSONAL INFORMATION:
• Name: ${formData.nombre}
• Phone: ${formData.telefono}
• Email: ${formData.email}

SERVICE DETAILS:
• Service Type: ${formData.tipoServicio}${formData.tipoServicio === 'Hourly' ? ` (${formData.hourlyHours} hours)` : ''}
• Date: ${formData.fecha}
• Time: ${formData.hora}

ROUTE INFORMATION:
• Pickup: ${formData.puntoRecogida}${formData.stops.length > 0 ? `\n• Stops: ${formData.stops.join(', ')}` : ''}
• Drop-off: ${formData.puntoDestino}

VEHICLE SELECTED:
• Vehicle: ${vehicleDisplay}
• Capacity: ${formData.vehiculoSeleccionado?.capacidad}
• Features: ${formData.vehiculoSeleccionado?.features.join(', ')}
// • Price: ${formData.vehiculoSeleccionado?.precio} 

---
Request submitted on: ${new Date().toLocaleString()}
Submitted by: Godandi & Sons Luxury Transport Widget
    `.trim();
  };

  const handleInputChange = <K extends keyof FormDataState>(field: K, value: FormDataState[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServicioToggle = (servicio: string) => {
    setFormData(prev => ({
      ...prev,
      tipoServicio: prev.tipoServicio === servicio ? null : servicio
    }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, '']
    }));
  };

  const removeStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const updateStop = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => i === index ? value : stop)
    }));
  };

  const incrementHourlyHours = () => {
    setFormData(prev => ({
      ...prev,
      hourlyHours: Math.min(prev.hourlyHours + 1, 12)
    }));
  };

  const decrementHourlyHours = () => {
    setFormData(prev => ({
      ...prev,
      hourlyHours: Math.max(prev.hourlyHours - 1, 3)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitReservation = async () => {
    console.log('submitReservation called');
    console.log('Current form data:', formData);
    console.log('Current step:', currentStep);
    console.log('Is step valid:', isStepValid());
    
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Generar el resumen
      const summary = generateReservationSummary();
      console.log('Generated summary:', summary);

      // Enviar por email usando la API
      console.log('Sending email to API...');
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formData,
          userEmail: formData.email,
          subject: `New Luxury Transport Reservation - ${formData.nombre}`,
          clientName: formData.nombre
        }),
      });

      console.log('Email response status:', emailResponse.status);
      const emailResult = await emailResponse.json();
      console.log('Email result:', emailResult);

      if (emailResponse.ok) {
        setSubmitMessage('✅ Your reservation has been sent successfully! We will contact you soon with your quote.');
        
        // Opcional: También guardar en base de datos si tienes API de reservas
        try {
          await fetch('/api/reservas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
        } catch {
          console.log('Database save failed, but email sent successfully');
        }

        // Reset form después de 3 segundos
        setTimeout(() => {
          setFormData({
            nombre: '',
            telefono: '',
            email: '',
            tipoServicio: null,
            hourlyHours: 3,
            fecha: '',
            hora: '',
            puntoRecogida: '',
            stops: [],
            puntoDestino: '',
            vehiculoSeleccionado: null,
            phoneCountryCode: '+1',
            phoneLocal: ''
          });
          setCurrentStep(1);
          setSubmitMessage('');
        }, 3000);

      } else {
        setSubmitMessage('❌ Error sending reservation: ' + emailResult.message);
      }

    } catch (error) {
      console.error('Error in submitReservation:', error);
      setSubmitMessage('❌ Error sending reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateHours = () => {
    const hours: string[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      const hour30 = i.toString().padStart(2, '0') + ':30';
      hours.push(hour, hour30);
    }
    return hours;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Your Luxury Chauffeur Service</h2>
              <p className="text-gray-600">Discreet. Punctual. Tailored by Godandi & Sons.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name*
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  placeholder="Full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile number*
                </label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={formData.telefono}
                  onChange={(value: string | undefined) => setFormData((prev) => ({ ...prev, telefono: value || '' }))}
                  className="w-full h-12 text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address*
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  placeholder="your@email.com"
                />
                {(() => {
                  const value = formData.email;
                  const show = value.includes('@') && !value.split('@')[1]?.includes('.');
                  const prefix = value.split('@')[0] || '';
                  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
                  return show ? (
                    <div className="mt-2 inline-flex flex-wrap gap-2">
                      {domains.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleInputChange('email', `${prefix}@${d}`)}
                          className="px-2 py-1 text-xs rounded-full border border-gray-300 text-black hover:border-amber-300 hover:bg-amber-50"
                        >
                          @{d}
                        </button>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Service type*</h2>
              <p className="text-gray-600">Select the service type</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {servicios.map((servicio, index) => (
                <button
                  key={index}
                  onClick={() => handleServicioToggle(servicio)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.tipoServicio === servicio
                      ? 'border-[#ebc651] bg-[#ebc651]/20 text-black'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{servicio}</span>
                    {formData.tipoServicio === servicio && (
                      <div className="w-5 h-5 bg-[#ebc651] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {formData.tipoServicio === 'Hourly' && (
              <div className="mt-4 p-4 border border-[#ebc651] rounded-lg bg-[#ebc651]/20">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select hours (min. 3)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decrementHourlyHours}
                    disabled={formData.hourlyHours <= 3}
                    className={`px-3 py-2 rounded-lg border ${formData.hourlyHours <= 3 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'}`}
                  >
                    −
                  </button>
                  <span className="text-gray-800 font-semibold min-w-[5ch] text-center">
                    {formData.hourlyHours} hrs
                  </span>
                  <button
                    type="button"
                    onClick={incrementHourlyHours}
                    className="px-3 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:border-amber-300"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule</h2>
              <p className="text-gray-600">Pick a date and time that works best for you</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service date
                  </label>
                  <input
                    type="date"
                    value={formData.fecha}
                    min={getMinDate()}
                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ebc651] focus:border-transparent text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service time
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleInputChange('hora', t)}
                        className={`px-3 py-2 rounded-lg border text-sm ${formData.hora === t ? 'border-[#ebc651] bg-[#ebc651]/20 text-black' : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <select
                    value={formData.hora}
                    onChange={(e) => handleInputChange('hora', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ebc651] focus:border-transparent text-black"
                  >
                    <option value="">Select a time</option>
                    {generateHours().map((h, index) => (
                      <option key={index} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="h-full rounded-xl border border-amber-200 bg-[#ebc651]/10 p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Your selection</h3>
                  <p className="text-sm text-gray-700">
                    {formData.fecha ? (
                      <>
                        <span className="block"><strong>Date:</strong> {formData.fecha}</span>
                      </>
                    ) : 'No date selected'}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {formData.hora ? (
                      <>
                        <span className="block"><strong>Time:</strong> {formData.hora}</span>
                      </>
                    ) : 'No time selected'}
                  </p>
                  <div className="mt-4 text-xs text-gray-600">
                    Tip: You can adjust your selection any time before confirming the reservation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Set your route</h2>
              <p className="text-gray-600">Add your pickup and drop-off addresses</p>
            </div>
            
            {!isMapsLoaded && !mapsError && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-600 text-sm">
                  Loading Google Maps... Please wait.
                </p>
              </div>
            )}

            {mapsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm mb-2">
                  Error loading Google Maps. Please check:
                </p>
                <ul className="text-red-600 text-sm list-disc list-inside space-y-1">
                  <li>Google Maps API key is configured</li>
                  <li>Places API is enabled in Google Cloud Console</li>
                  <li>Billing is set up for your Google Cloud project</li>
                  <li>No referrer restrictions blocking this domain</li>
                </ul>
                <div className="mt-3 p-3 bg-gray-100 rounded text-xs text-gray-700">
                  <p><strong>Debug Info:</strong></p>
                  <p>Google Maps loaded: {window.google ? 'Yes' : 'No'}</p>
                  <p>Maps object: {window.google?.maps ? 'Yes' : 'No'}</p>
                  <p>Places library: {window.google?.maps?.places ? 'Yes' : 'No'}</p>
                  <p>API Key: {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Configured' : 'Missing'}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Retry
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              <AddressAutocomplete
                value={formData.puntoRecogida}
                onChange={(address) => handleInputChange('puntoRecogida', address)}
                label="Pickup address"
                placeholder="Search pickup address"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stops (optional)
                </label>
                {formData.stops.map((stop, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                    <div className="flex-1">
                      <AddressAutocomplete
                        value={stop}
                        onChange={(address) => updateStop(index, address)}
                        placeholder={`Stop ${index + 1}`}
                      />
                    </div>
                    <button
                      onClick={() => removeStop(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg self-end sm:self-auto"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addStop}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-black hover:border-[#ebc651] hover:text-black hover:bg-[#ebc651]/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  add stop
                </button>
              </div>
              
              <AddressAutocomplete
                value={formData.puntoDestino}
                onChange={(address) => handleInputChange('puntoDestino', address)}
                label="Drop-off address"
                placeholder="Search drop-off address"
                required
              />

              {/* Mostrar mapa si hay origen y destino */}
              {formData.puntoRecogida && formData.puntoDestino && isMapsLoaded && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Route Preview</h3>
                  <RouteMap
                    origin={formData.puntoRecogida}
                    destination={formData.puntoDestino}
                    waypoints={formData.stops.filter(stop => stop.trim() !== '')}
                    className="w-full h-60 sm:h-72 md:h-80 rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 ${currentStep === 5 ? 'text-white' : 'text-gray-800'}">Select your vehicle</h2>
              <p className={`${currentStep === 5 ? 'text-gray-300' : 'text-gray-600'}`}>Choose the best option for your trip</p>
            </div>
            
            <div className={`px-2 ${currentStep === 5 ? 'text-white' : ''}`}>
              <div className="relative select-none">
                <div className="flex flex-wrap justify-between gap-2">
                  {categorias.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCategory(key);
                        setFormData(prev => ({ ...prev, vehiculoSeleccionado: null }));
                      }}
                      className={`group flex flex-col items-center flex-1 py-1 transition-colors ${
                        selectedCategory === key ? 'text-[#ecb651] uppercase' : 'text-white uppercase hover:text-black'
                      }`}
                      aria-current={selectedCategory === key}
                      aria-label={`Select ${label}`}
                    >
                      <span className="text-xl md:text-2xl">{icon}</span>
                      <span className="mt-1 text-[11px] md:text-xs font-medium tracking-wide">{label}</span>
                    </button>
                  ))}
                </div>
                {(() => {
                  const total = categorias.length;
                  const idx = Math.max(0, categorias.findIndex(c => c.key === selectedCategory));
                  const seg = total > 0 ? 100 / total : 100;
                  const left = idx * seg;
                  const width = seg;
                  const knobTranslate = `calc(${left}% + ${width / 2}% - 0.5rem)`;
                  return (
                    <div className="mt-3 relative h-1 rounded-full bg-[#ecb651]">
                      <div
                        className="absolute top-0 h-full bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out"
                        style={{ left: `${left}%`, width: `${width}%` }}
                      />
                      <div
                        className="absolute -top-1 w-4 h-4 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(${knobTranslate})` }}
                        aria-hidden
                      />
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {vehiculos
                .filter((v) => v.categoria === selectedCategory)
                .map((vehiculo) => (
                <button
                  key={vehiculo.id}
                  onClick={() => handleInputChange('vehiculoSeleccionado', vehiculo)}
                  className={`group relative overflow-hidden rounded-none border-2 transition-all ${
                    formData.vehiculoSeleccionado?.id === vehiculo.id
                      ? 'border-[#ebc651] shadow-[0_10px_30px_rgba(235,198,81,0.4)]'
                      : 'border-gray-200 hover:border-[#ebc651] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  {(() => { const variant = getActiveVariant(vehiculo); const displayImage = variant?.imagen || vehiculo.imagen; const displayName = variant ? `${vehiculo.nombre} — ${variant.name}` : vehiculo.nombre; return (
                  <div className="relative w-full">
                    <Image
                      src={displayImage}
                      alt={displayName}
                      width={1600}
                      height={900}
                      priority={true}
                      className="object-contain bg-transparent object-center w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-0 left-0 right-0 p-2">
                      <span className="inline-block px-3 py-1 rounded-b bg-transparent text-black uppercase text-xs md:text-sm font-semibold">
                        {vehiculo.nombre}
                      </span>
                    </div>
                    {vehiculo.variants && vehiculo.variants.length > 1 && (() => {
                      const variants = vehiculo.variants!;
                      const currentId = selectedVariantByVehicleId[vehiculo.id] ?? variants[0].id;
                      const idx = Math.max(0, variants.findIndex(v => v.id === currentId));
                      const prevId = variants[(idx - 1 + variants.length) % variants.length].id;
                      const nextId = variants[(idx + 1) % variants.length].id;
                      return (
                        <>
                          <div className="absolute inset-y-0 left-2 flex items-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSelectedVariantByVehicleId(prev => ({ ...prev, [vehiculo.id]: prevId })); }}
                              className="p-2 rounded-full bg-white/80 text-black hover:bg-white shadow"
                              aria-label="Previous vehicle option"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute inset-y-0 right-2 flex items-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSelectedVariantByVehicleId(prev => ({ ...prev, [vehiculo.id]: nextId })); }}
                              className="p-2 rounded-full bg-white/80 text-black hover:bg-white shadow"
                              aria-label="Next vehicle option"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      );
                    })()}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); const va = getActiveVariant(vehiculo); const details = va ? ({ ...vehiculo, imagen: va.imagen, make: va.make ?? vehiculo.make, model: va.model ?? vehiculo.model, year: va.year ?? vehiculo.year, engine: va.engine ?? vehiculo.engine, fuelEfficiency: va.fuelEfficiency ?? vehiculo.fuelEfficiency, features: va.features ?? vehiculo.features, gallery: va.gallery ?? vehiculo.gallery, nombre: `${vehiculo.nombre} — ${va.name}` }) : vehiculo; setInfoVehicle(details); }}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-white/50 text-black font-bold hover:bg-white shadow-md"
                      >
                        Show more
                      </button>
                    </div>
                  </div>
                  ); })()}
                </button>
              ))}
            </div>

            {infoVehicle && (
              <VehicleDetailsModal
                vehicle={infoVehicle as VehicleDetails}
                variants={(() => {
                  const original = vehiculos.find(v => v.id === (formData.vehiculoSeleccionado?.id ?? infoVehicle.id));
                  if (!original || !original.variants) return null;
                  return original.variants.map(va => ({
                    ...(infoVehicle as VehicleDetails),
                    nombre: `${original.nombre} — ${va.name || ''}`.trim(),
                    imagen: va.imagen,
                    make: va.make ?? original.make,
                    model: va.model ?? original.model,
                    year: va.year ?? original.year,
                    engine: va.engine ?? original.engine,
                    fuelEfficiency: va.fuelEfficiency ?? original.fuelEfficiency,
                    features: va.features ?? original.features,
                    gallery: va.gallery ?? original.gallery,
                  }));
                })()}
                variantIdx={(() => {
                  const original = vehiculos.find(v => v.id === (formData.vehiculoSeleccionado?.id ?? infoVehicle.id));
                  if (!original || !original.variants) return 0;
                  const currentId = selectedVariantByVehicleId[original.id] ?? original.variants[0].id;
                  return Math.max(0, original.variants.findIndex(va => va.id === currentId));
                })()}
                onChangeVariant={(idx) => {
                  const original = vehiculos.find(v => v.id === (formData.vehiculoSeleccionado?.id ?? infoVehicle.id));
                  if (!original || !original.variants) return;
                  const va = original.variants[idx];
                  setSelectedVariantByVehicleId(prev => ({ ...prev, [original.id]: va.id }));
                  const details = ({
                    ...(infoVehicle as VehicleDetails),
                    nombre: `${original.nombre} — ${va.name || ''}`.trim(),
                    imagen: va.imagen,
                    make: va.make ?? original.make,
                    model: va.model ?? original.model,
                    year: va.year ?? original.year,
                    engine: va.engine ?? original.engine,
                    fuelEfficiency: va.fuelEfficiency ?? original.fuelEfficiency,
                    features: va.features ?? original.features,
                    gallery: va.gallery ?? original.gallery,
                  });
                  setInfoVehicle(details as VehicleDetails); // eslint-disable-line @typescript-eslint/no-explicit-any
                }}
                onClose={() => setInfoVehicle(null)}
                onSelect={(v) => { handleInputChange('vehiculoSeleccionado', v as any); setInfoVehicle(null); }} // eslint-disable-line @typescript-eslint/no-explicit-any
              />
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reservation Summary</h2>
              <p className="text-gray-600">Please review the information before confirming</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
                <p className="text-sm text-black">
                  <strong>Name:</strong> {formData.nombre}<br />
                  <strong>Phone:</strong> {formData.telefono}<br />
                  <strong>Email:</strong> {formData.email}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Service type</h3>
                <p className="text-sm text-gray-600">
                  {formData.tipoServicio ?? ''}
                  {formData.tipoServicio === 'Hourly' && ` (${formData.hourlyHours} hours)`}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Schedule</h3>
                <p className="text-sm text-black">
                  {formData.fecha} at {formData.hora}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Routing</h3>
                <p className="text-sm text-black">
                  <strong>Pickup:</strong> {formData.puntoRecogida}<br />
                  {formData.stops.length > 0 && (
                    <>
                      <strong>Stops:</strong> {formData.stops.join(', ')}<br />
                    </>
                  )}
                  <strong>Drop-off:</strong> {formData.puntoDestino}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Vehicle Type</h3>
                <p className="text-sm text-black">
                  {formData.vehiculoSeleccionado?.nombre} - {formData.vehiculoSeleccionado?.capacidad}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.nombre && formData.telefono && formData.email;
      case 2:
        return !!formData.tipoServicio;
      case 3:
        return formData.fecha && formData.hora;
      case 4:
        return formData.puntoRecogida && formData.puntoDestino;
      case 5:
        return formData.vehiculoSeleccionado;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const getActiveVariant = (v: Vehiculo) => {
    if (!v.variants || v.variants.length === 0) return null;
    const sel = selectedVariantByVehicleId[v.id] ?? v.variants[0].id;
    return v.variants.find(va => va.id === sel) || v.variants[0];
  };

  const generateEmailHTML = () => {
    const variant = getActiveVariant(formData.vehiculoSeleccionado as Vehiculo);
    const vehicleDisplay = variant 
      ? `${formData.vehiculoSeleccionado?.nombre} - ${variant.name}`
      : formData.vehiculoSeleccionado?.nombre;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Luxury Chauffeur Service Reservation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .logo {
      max-width: 150px;
      height: auto;
    }
    .content {
      padding: 20px 0;
    }
    .section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px dashed #eee;
    }
    .section:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .section-title {
      color: #555;
      font-size: 1.1em;
      margin-bottom: 10px;
    }
    .info-item {
      margin-bottom: 5px;
    }
    .info-item strong {
      font-weight: bold;
    }
    .vehicle-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
    }
    .vehicle-name {
      font-size: 1.2em;
      font-weight: bold;
      color: #333;
    }
    .vehicle-capacity {
      font-size: 0.9em;
      color: #666;
    }
    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .features-list li {
      margin-bottom: 5px;
      color: #555;
    }
    .features-list li strong {
      font-weight: bold;
    }
    /* .price {     //removed price from email
      font-size: 1.2em;
      font-weight: bold;
      color: #ebc651;
      margin-top: 10px;
    } */
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 0.9em;
      color: #888;
    }
    .footer a {
      color: #ebc651;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://godandiandsons.com/logodorado.png" alt="Godandi & Sons Logo" class="logo">
    </div>
    <div class="content">
      <div class="section">
        <h2 class="section-title">Reservation Details</h2>
        <div class="info-item">
          <strong>Name:</strong> ${formData.nombre}
        </div>
        <div class="info-item">
          <strong>Phone:</strong> ${formData.telefono}
        </div>
        <div class="info-item">
          <strong>Email:</strong> ${formData.email}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Service Details</h2>
        <div class="info-item">
          <strong>Service Type:</strong> ${formData.tipoServicio}${formData.tipoServicio === 'Hourly' ? ` (${formData.hourlyHours} hours)` : ''}
        </div>
        <div class="info-item">
          <strong>Date:</strong> ${formData.fecha}
        </div>
        <div class="info-item">
          <strong>Time:</strong> ${formData.hora}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Route Information</h2>
        <div class="info-item">
          <strong>Pickup:</strong> ${formData.puntoRecogida}
        </div>
        ${formData.stops.length > 0 ? `
        <div class="info-item">
          <strong>Stights:</strong> ${formData.stops.join(', ')}
        </div>
        ` : ''}
        <div class="info-item">
          <strong>Drop-off:</strong> ${formData.puntoDestino}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Vehicle Selected</h2>
        <div class="vehicle-details">
          <div class="vehicle-name">${vehicleDisplay}</div>
          <div class="vehicle-capacity">${formData.vehiculoSeleccionado?.capacidad}</div>
          <div class="features-list">
            ${formData.vehiculoSeleccionado?.features?.map(feature => `<li><strong>${feature}:</strong> Yes</li>`).join('') || ''}
          </div>
          <!-- <div class="">${formData.vehiculoSeleccionado?.precio}</div> -->    
        </div>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent from Godandi & Sons Luxury Transport Widget.</p>
      <p>If you did not make this reservation, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  };

  return (
    <div className="max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-black text-white p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => window.open('https://godandiandsons.com/contact', '_blank')}
            className="p-2 rounded-full bg-white text-black hover:bg-[#ebc651]/80 transition-colors"
            aria-label="Back to G&D and Sons"
          >
            ←
          </button>
          <div className="flex-1 flex justify-center">
            <Image
              src="/logodorado (1).png"
              alt="Logo"
              width={120}
              height={120}
              priority
              className="h-12 sm:h-16 w-auto max-w-full"
            />
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                i + 1 <= currentStep ? 'bg-white text-black' : 'bg-[#ebc651] text-black'
              }`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`h-1 w-4 sm:w-8 md:w-16 mx-1 sm:mx-2 ${
                  i + 1 < currentStep ? 'bg-white' : 'bg-[#ebc651]'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <span className="text-[#ebc651]">Step {currentStep} of {totalSteps}</span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 sm:p-6 md:p-8 transition-colors duration-700 ${currentStep === 5 ? 'bg-black' : 'bg-white'}`}>
        {currentStep === 5 ? (
          <div className="animate-[fadeIn_600ms_ease-out]">
            {renderStep()}
          </div>
        ) : (
          renderStep()
        )}

        {submitMessage && submitMessage.startsWith('✅') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#ebc651]/30 flex items-center justify-center">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reservation sent</h3>
              <p className="text-sm text-gray-600 mb-6">We will contact you soon with your quote.</p>
              <button
                onClick={() => { setSubmitMessage(''); setCurrentStep(1); }}
                className="px-5 py-2 rounded-lg bg-black text-white hover:bg-black/90"
              >
                Back to start
              </button>
            </div>
          </div>
        )}

        {/* Email Preview Modal */}
        {showEmailPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-black text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Email Preview</h3>
                <button
                  onClick={() => setShowEmailPreview(false)}
                  className="text-white hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Email Details:</h4>
                  <p className="text-sm text-gray-600"><strong>To:</strong> {formData.email}</p>
                  <p className="text-sm text-gray-600"><strong>Subject:</strong> ✅ Reservation Confirmed - Godandi & Sons Luxury Chauffeur</p>
                </div>
                <div 
                  className="border rounded-lg p-4"
                  dangerouslySetInnerHTML={{ 
                    __html: generateEmailHTML() 
                  }}
                />
              </div>
              <div className="bg-gray-50 p-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailPreview(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEmailPreview(false);
                    submitReservation();
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#ebc651] text-black rounded-lg hover:bg-[#ebc651]/80 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reservation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navigation */}
      <div className="bg-black px-4 sm:px-8 py-4 sm:py-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-[#ebc651] border-2 border-[#ebc651]'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={() => {
              console.log('Get a quote button clicked!');
              console.log('Button should be enabled:', isStepValid());
              setShowEmailPreview(true);
            }}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center ${
              isStepValid()
                ? 'bg-[#ebc651]/70 text-black hover:bg-[#ebc651]'
                : 'bg-black text-[#ebc651] cursor-not-allowed'
            }`}
          >
            <Mail className="w-5 h-5" />
            Preview & Send
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center ${
              isStepValid()
                ? 'bg-[#ebc651]/70 text-black hover:bg-[#ebc651]'
                : 'bg-black text-[#ebc651] cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LuxuryTransportWidget;