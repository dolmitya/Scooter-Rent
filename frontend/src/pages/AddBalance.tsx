import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddBalance: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addBalance } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Пожалуйста, введите корректную положительную сумму');
      return;
    }
    
    setIsProcessing(true);
    
    // Имитация обработки платежа
    setTimeout(() => {
      addBalance(numAmount);
      setIsProcessing(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Пополнение баланса</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <CreditCard size={48} className="text-indigo-600" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Сумма пополнения (₽)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="Введите сумму"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isProcessing ? 'Обработка...' : 'Пополнить баланс'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBalance;