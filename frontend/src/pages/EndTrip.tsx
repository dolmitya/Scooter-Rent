import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle, MapPin } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';

// Исправление для иконок маркеров в react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Компонент для выбора местоположения на карте
const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (location: { latitude: number, longitude: number }) => void }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const EndTrip: React.FC = () => {
  const { activeTrips, loadTrips, loadScooters, endTrip } = useTrip();
  const { loadUserData, token } = useAuth();
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [endLocation, setEndLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const navigate = useNavigate();

  const selectedTrip = selectedTripId ? activeTrips.find(trip => trip.tripId === selectedTripId) : null;
  const defaultCenter: [number, number] = selectedTrip
    ? [selectedTrip.startLatitude, selectedTrip.startLongitude]
    : [55.751244, 37.618423]; // Москва по умолчанию

  const handleEndTrip = async () => {
    if (!selectedTripId || !endLocation) return;
    
    setIsProcessing(true);
    
    try {
      await endTrip(selectedTripId, endLocation);
      navigate('/');
    } catch (error) {
      setLocationError('Ошибка при завершении поездки. Попробуйте еще раз.');
    } finally {
      loadTrips();
      loadScooters();
      if (token)
        loadUserData(token);
      setIsProcessing(false);
      setIsConfirming(false);
    }
  };

  const handleProceedToConfirm = () => {
    if (!endLocation) {
      setLocationError('Пожалуйста, выберите место завершения поездки на карте');
      return;
    }
    
    setLocationError('');
    setIsConfirming(true);
  };

  if (activeTrips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Завершение поездки</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-8 text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Нет активных поездок</h2>
          <p className="text-gray-500 mb-4">У вас нет активных поездок для завершения.</p>
          <Link 
            to="/rent" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Арендовать самокат
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Завершение поездки</h1>
      </div>

      {isConfirming ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle size={48} className="text-yellow-500" />
          </div>
          
          <h2 className="text-xl font-medium text-center mb-4">Подтвердите завершение поездки</h2>
          
          <p className="text-gray-600 mb-6 text-center">
            Вы уверены, что хотите завершить эту поездку? Это действие нельзя отменить.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsConfirming(false)}
              disabled={isProcessing}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Отмена
            </button>
            <button
              onClick={handleEndTrip}
              disabled={isProcessing}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isProcessing ? 'Обработка...' : 'Завершить поездку'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <ul className="divide-y divide-gray-200">
              {activeTrips.map((trip) => (
                <li 
                  key={trip.tripId}
                  className={`cursor-pointer hover:bg-gray-50 ${selectedTripId === trip.tripId ? 'bg-indigo-50' : ''}`}
                  onClick={() => setSelectedTripId(trip.tripId)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full mr-2 bg-green-500"></div>
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Самокат #{trip.scooterId}, Модель: {trip.scooterModel}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Активна
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Начало: {format(new Date(trip.startTime), 'PPp', { locale: ru })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <p className="text-sm text-gray-500">
                        Цена за минуту: {trip.pricePerMinute.toFixed(2)} ₽
                      </p>
                      <p className="mt-2 text-sm font-medium text-gray-900 sm:mt-0">
                        Текущая стоимость: {trip.price.toFixed(2)} ₽
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {selectedTripId && (
            <>
              <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите место завершения поездки</h3>
                <p className="text-gray-600 mb-4">Нажмите на карту, чтобы указать, где вы оставили самокат</p>
                
                <div className="h-96 mb-4">
                  <MapContainer 
                    center={defaultCenter} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {selectedTrip && (
                      <Marker 
                        position={[selectedTrip.startLatitude, selectedTrip.startLongitude]} 
                      />
                    )}
                    <LocationPicker onLocationSelect={setEndLocation} />
                  </MapContainer>
                </div>
                
                {endLocation && (
                  <div className="mb-4 p-3 border rounded bg-green-50 flex items-center">
                    <MapPin className="text-green-600 mr-2" size={20} />
                    <span className="text-green-700">Место завершения поездки выбрано</span>
                  </div>
                )}
                
                {locationError && (
                  <div className="mb-4 p-3 border rounded bg-red-50 text-red-700">
                    {locationError}
                  </div>
                )}
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <button
                  onClick={handleProceedToConfirm}
                  disabled={!selectedTripId}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  Завершить выбранную поездку
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EndTrip