import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [numberPhone, setPhone] = useState(user?.phone || '');
  const [username] = useState(user?.login || '');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ numberPhone, username });
    setSuccessMessage('Профиль успешно обновлен!');
    
    // Очистка сообщения об успехе через 3 секунды
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Настройки аккаунта</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700">
              Логин
            </label>
            <input
              type="text"
              id="login"
              value={user?.login}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">Логин нельзя изменить</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Номер телефона
            </label>
            <input
              type="tel"
              id="phone"
              value={numberPhone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;