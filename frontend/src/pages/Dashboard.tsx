import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, List, MapPin, StopCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { activeTrips} = useTrip();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.roles.includes('ROLE_ADMIN')) {
      navigate('/admin-panel');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать, {user?.login}!</h1>
        <p className="text-gray-600">Что бы вы хотели сделать сегодня?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/add-balance" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Wallet className="text-indigo-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Пополнить баланс</h2>
          </div>
          <p className="text-gray-600">Добавьте средства на счет для аренды самокатов.</p>
          <p className="mt-2 text-indigo-600 font-medium">Текущий баланс: {user?.balance.toFixed(2)} ₽</p>
        </Link>

        <Link to="/trips" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <List className="text-indigo-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold">История поездок</h2>
          </div>
          <p className="text-gray-600">Просмотр ваших прошлых и текущих поездок.</p>
        </Link>

        <Link to="/rent" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <MapPin className="text-indigo-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Арендовать самокат</h2>
          </div>
          <p className="text-gray-600">Найдите и арендуйте доступные самокаты рядом с вами.</p>
        </Link>

        {activeTrips.length > 0 && (
          <Link to="/end-trip" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-red-500">
            <div className="flex items-center mb-4">
              <StopCircle className="text-red-600 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Завершить поездку</h2>
            </div>
            <p className="text-gray-600">У вас {activeTrips.length} {activeTrips.length === 1 ? 'активная поездка' : 
              activeTrips.length < 5 ? 'активные поездки' : 'активных поездок'}.</p>
            <p className="mt-2 text-red-600 font-medium">Нажмите, чтобы завершить поездку</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;