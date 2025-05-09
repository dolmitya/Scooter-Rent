import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { Scooter } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Исправление для иконок маркеров в react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RentScooter: React.FC = () => {
  const { scooters, startTrip, loadScooters, loadTrips } = useTrip();
  const { user, token, loadUserData } = useAuth();
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [isRenting, setIsRenting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRent = async () => {
    if (!selectedScooter) {
      setError('Пожалуйста, сначала выберите самокат');
      return;
    }

    if (!user) {
      setError('Вы должны быть авторизованы для аренды самоката');
      return;
    }

    if (user.balance < selectedScooter.pricePerMinute * 10) {
      setError(`Недостаточно средств. Вам нужно минимум ${(selectedScooter.pricePerMinute * 10).toFixed(2)} ₽ для аренды этого самоката.`);
      return;
    }

    setIsRenting(true);
    setError('');


    try {
      await startTrip(selectedScooter.id, {
        latitude: selectedScooter.latitude,
        longitude: selectedScooter.longitude
      });
      navigate('/');
    } catch (err) {
      setError('Ошибка при начале поездки');
    } finally {
      loadTrips();
      loadScooters();
      if (token)
        loadUserData(token);
      setIsRenting(false);
    }
  };

  // Центр карты по умолчанию (Москва)
  const defaultCenter: [number, number] = [55.751244, 37.618423];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Аренда самоката</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <p className="text-gray-600">Нажмите на маркер самоката, чтобы выбрать его для аренды.</p>
        </div>

        <div className="h-96">
          <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {scooters.map(scooter => (
              <Marker 
                key={scooter.id} 
                position={[scooter.latitude, scooter.longitude]}
                eventHandlers={{
                  click: () => {
                    setSelectedScooter(scooter);
                    setError('');
                  },
                }}
              >
                <Popup>
                  <div>
                    <p className="font-medium">Самокат #{scooter.id}, Модель: {scooter.model}</p>
                    <p className="text-sm text-gray-600">Цена: {scooter.pricePerMinute.toFixed(2)} ₽/мин</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="p-4">
          {selectedScooter ? (
            <div className="mb-4 p-3 border rounded bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Выбран самокат #{selectedScooter.id}</h3>
                  <p className="text-sm text-gray-600">Цена: {selectedScooter.pricePerMinute.toFixed(2)} ₽/мин</p>
                </div>
                <MapPin className="text-indigo-600" size={24} />
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 border rounded bg-gray-50 text-gray-500">
              Самокат не выбран. Нажмите на маркер, чтобы выбрать самокат.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 border rounded bg-red-50 text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleRent}
            disabled={!selectedScooter || isRenting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isRenting ? 'Обработка...' : 'Арендовать этот самокат'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentScooter