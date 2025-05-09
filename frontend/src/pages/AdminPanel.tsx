import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Исправление для иконок маркеров в react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface ModelPrice {
  model: string;
  price: number;
}

// Компонент для выбора местоположения на карте
const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (location: { lat: number, lng: number }) => void }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [model, setModel] = useState('');
  const [pricePerMinute, setPricePerMinute] = useState('');
  const [models, setModels] = useState<ModelPrice[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Центр карты по умолчанию (Москва)
  const defaultCenter: [number, number] = [55.751244, 37.618423];

  useEffect(() => {
    if (token) {
      loadModels();
    }
  }, [token]);

  const loadModels = async () => {
    try {
      const modelsList = await api.getAllModels(token!);
      setModels(modelsList);
    } catch (err) {
      setError('Ошибка при загрузке моделей');
    }
  };

  const handleAddScooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!location) {
      setError('Пожалуйста, выберите местоположение самоката на карте');
      return;
    }

    try {
      await api.addScooter(token!, {
        model,
        latitude: location.lat,
        longitude: location.lng,
        pricePerMinute: parseFloat(pricePerMinute),
      });
      setMessage('Самокат успешно добавлен');
      setModel('');
      setPricePerMinute('');
      setLocation(null);
    } catch (err) {
      setError('Ошибка при добавлении самоката');
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.updatePrice(token!, selectedModel, parseFloat(newPrice));
      setMessage('Цена успешно обновлена');
      setSelectedModel('');
      setNewPrice('');
      if (token) {
      loadModels();
    }
    } catch (err) {
      setError('Ошибка обновлении цены');
    } finally{
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
      </div>

      {(message || error) && (
        <div className={`mb-4 p-4 rounded-md ${message ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message || error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Добавить новый самокат</h2>
          
          <form onSubmit={handleAddScooter} className="space-y-4">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Модель самоката
              </label>
              <input
                type="text"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="pricePerMinute" className="block text-sm font-medium text-gray-700">
                Цена за минуту (₽)
              </label>
              <input
                type="number"
                id="pricePerMinute"
                step="0.01"
                value={pricePerMinute}
                onChange={(e) => setPricePerMinute(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите местоположение самоката на карте
              </label>
              <div className="h-96 border rounded-lg overflow-hidden">
                <MapContainer 
                  center={defaultCenter} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  attributionControl={false}
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onLocationSelect={setLocation} />
                </MapContainer>
              </div>
              {location && (
                <p className="mt-2 text-sm text-green-600">
                  Местоположение выбрано: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Добавить самокат
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Обновить цену модели</h2>
          
          <form onSubmit={handleUpdatePrice} className="space-y-4">
            <div>
              <label htmlFor="selectedModel" className="block text-sm font-medium text-gray-700">
                Выберите модель
              </label>
              <select
                id="selectedModel"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Выберите модель</option>
                {models.map((m) => (
                  <option key={m.model} value={m.model}>
                    {m.model} (Текущая цена: {m.price} ₽/мин)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700">
                Новая цена за минуту (₽)
              </label>
              <input
                type="number"
                id="newPrice"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Обновить цену
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Список моделей и цен</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Модель
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена за минуту
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {models.map((model) => (
                  <tr key={model.model}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {model.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {model.price} ₽/мин
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;