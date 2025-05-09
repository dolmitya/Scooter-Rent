import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const TripHistory: React.FC = () => {
  const { trips } = useTrip();

  // Сортировка поездок по времени начала (сначала новые)
  const sortedTrips = [...trips].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">История поездок</h1>
      </div>

      {sortedTrips.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Нет поездок</h2>
          <p className="text-gray-500 mb-4">Вы еще не совершали поездок на наших самокатах.</p>
          <Link 
            to="/rent" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Арендовать самокат
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {sortedTrips.map((trip) => (
              <li key={trip.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {format(new Date(trip.startTime), 'PPP', { locale: ru })}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          trip.endTime
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {trip.endTime ? 'Завершена' : 'Активна'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Начало: {format(new Date(trip.startTime), 'p', { locale: ru })}
                      </p>
                      {trip.endTime && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Конец: {format(new Date(trip.endTime), 'p', { locale: ru })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <p className="text-sm text-gray-500">
                      Цена за минуту: {trip.pricePerMinute.toFixed(2)} ₽
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900 sm:mt-0">
                      Итого: {trip.price.toFixed(2)} ₽
                    </p>
                  </div>
                  {Number(trip.distance) !== 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Расстояние: {trip.distance.toFixed(2)} км
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TripHistory