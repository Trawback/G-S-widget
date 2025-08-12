'use client';
import React, { useState } from 'react';
import { Calendar, MapPin, Car, Mail, User, Plus, X, ChevronRight, ChevronLeft } from 'lucide-react';

type Vehiculo = {
  id: number;
  nombre: string;
  capacidad: string;
  descripcion: string;
  precio: string;
  imagen: string;
};

type FormDataState = {
  nombre: string;
  telefono: string;
  email: string;
  tipoServicio: string[];
  fecha: string;
  hora: string;
  puntoRecogida: string;
  stops: string[];
  puntoDestino: string;
  vehiculoSeleccionado: Vehiculo | null;
};

const LuxuryTransportWidget = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>({
    // Datos del cliente
    nombre: '',
    telefono: '',
    email: '',
    // Servicio
    tipoServicio: [],
    // Fecha y hora
    fecha: '',
    hora: '',
    // Ubicaciones
    puntoRecogida: '',
    stops: [],
    puntoDestino: '',
    // Vehículo
    vehiculoSeleccionado: null
  });

  const servicios = [
    'Traslado al Aeropuerto',
    'Servicio Corporativo',
    'Eventos Especiales',
    'Tour de Ciudad',
    'Servicio por Horas',
    'Bodas',
    'Graduaciones'
  ];

  const vehiculos = [
    {
      id: 1,
      nombre: 'Sedan de Lujo',
      capacidad: '1-4 pasajeros',
      descripcion: 'Mercedes-Benz Clase S, BMW Serie 7',
      precio: 'Desde $150/hora',
      imagen: '🚗'
    },
    {
      id: 2,
      nombre: 'SUV Premium',
      capacidad: '1-6 pasajeros',
      descripcion: 'Cadillac Escalade, Lincoln Navigator',
      precio: 'Desde $200/hora',
      imagen: '🚙'
    },
    {
      id: 3,
      nombre: 'Van Ejecutiva',
      capacidad: '1-14 pasajeros',
      descripcion: 'Mercedes-Benz Sprinter, Ford Transit',
      precio: 'Desde $250/hora',
      imagen: '🚐'
    },
    {
      id: 4,
      nombre: 'Limusina',
      capacidad: '1-10 pasajeros',
      descripcion: 'Stretch Limousine, Party Bus',
      precio: 'Desde $350/hora',
      imagen: '🚖'
    }
  ];

  const totalSteps = 6;

  const handleInputChange = <K extends keyof FormDataState>(field: K, value: FormDataState[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServicioToggle = (servicio: string) => {
    setFormData(prev => ({
      ...prev,
      tipoServicio: prev.tipoServicio.includes(servicio)
        ? prev.tipoServicio.filter(s => s !== servicio)
        : [...prev.tipoServicio, servicio]
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
    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('¡Reserva enviada exitosamente! Te contactaremos pronto con tu cotización.');
        // Opcional: resetear form o redirigir
      } else {
        alert('Error al enviar la reserva. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la reserva. Por favor intenta nuevamente.');
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
              <User className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Información Personal</h2>
              <p className="text-gray-600">Comencemos con tus datos de contacto</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="+52 55 1234 5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Car className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tipo de Servicio</h2>
              <p className="text-gray-600">Selecciona uno o más servicios que necesitas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {servicios.map((servicio, index) => (
                <button
                  key={index}
                  onClick={() => handleServicioToggle(servicio)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.tipoServicio.includes(servicio)
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{servicio}</span>
                    {formData.tipoServicio.includes(servicio) && (
                      <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Fecha y Hora</h2>
              <p className="text-gray-600">¿Cuándo necesitas el servicio?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha del servicio *
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  min={getMinDate()}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora del servicio *
                </label>
                <select
                  value={formData.hora}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Selecciona la hora</option>
                  {generateHours().map((hora, index) => (
                    <option key={index} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ubicaciones</h2>
              <p className="text-gray-600">Define tu ruta de viaje</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Punto de recogida *
                </label>
                <input
                  type="text"
                  value={formData.puntoRecogida}
                  onChange={(e) => handleInputChange('puntoRecogida', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Dirección de recogida"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paradas intermedias (opcional)
                </label>
                {formData.stops.map((stop, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={stop}
                      onChange={(e) => updateStop(index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={`Parada ${index + 1}`}
                    />
                    <button
                      onClick={() => removeStop(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addStop}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-amber-300 hover:text-amber-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Agregar parada
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Punto de destino *
                </label>
                <input
                  type="text"
                  value={formData.puntoDestino}
                  onChange={(e) => handleInputChange('puntoDestino', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Dirección de destino"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Car className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona tu Vehículo</h2>
              <p className="text-gray-600">Elige el vehículo perfecto para tu viaje</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehiculos.map((vehiculo) => (
                <button
                  key={vehiculo.id}
                  onClick={() => handleInputChange('vehiculoSeleccionado', vehiculo)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.vehiculoSeleccionado?.id === vehiculo.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{vehiculo.imagen}</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{vehiculo.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">{vehiculo.capacidad}</p>
                    <p className="text-xs text-gray-500 mb-3">{vehiculo.descripcion}</p>
                    <div className="text-amber-600 font-semibold">{vehiculo.precio}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Mail className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumen de tu Reserva</h2>
              <p className="text-gray-600">Revisa los detalles antes de confirmar</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Información Personal</h3>
                <p className="text-sm text-gray-600">
                  <strong>Nombre:</strong> {formData.nombre}<br />
                  <strong>Teléfono:</strong> {formData.telefono}<br />
                  <strong>Email:</strong> {formData.email}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Servicios</h3>
                <p className="text-sm text-gray-600">
                  {formData.tipoServicio.join(', ')}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Fecha y Hora</h3>
                <p className="text-sm text-gray-600">
                  {formData.fecha} a las {formData.hora}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Ruta</h3>
                <p className="text-sm text-gray-600">
                  <strong>Recogida:</strong> {formData.puntoRecogida}<br />
                  {formData.stops.length > 0 && (
                    <>
                      <strong>Paradas:</strong> {formData.stops.join(', ')}<br />
                    </>
                  )}
                  <strong>Destino:</strong> {formData.puntoDestino}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Vehículo</h3>
                <p className="text-sm text-gray-600">
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
        return formData.tipoServicio.length > 0;
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

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Reserva tu Transporte de Lujo</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i + 1 <= currentStep ? 'bg-white text-amber-500' : 'bg-amber-400 text-white'
              }`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`h-1 w-8 md:w-16 mx-2 ${
                  i + 1 < currentStep ? 'bg-white' : 'bg-amber-400'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <span className="text-amber-100">Paso {currentStep} de {totalSteps}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-8 py-6 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={submitReservation}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
              isStepValid()
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Mail className="w-5 h-5" />
            Enviar Reserva
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isStepValid()
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LuxuryTransportWidget;