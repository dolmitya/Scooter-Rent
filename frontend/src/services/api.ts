import { UserResponse } from "../types";

const API_URL = 'http://localhost:8189';

export const api = {
  async login(username: string, password: string): Promise<{ token: string; roles: string[] }> {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Неверный логин или пароль');
    }

    return response.json();
  },

  async register(username: string, password: string): Promise<void> {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при регистрации');
    }
  },

  async getInfo(token: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/secured/getInfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user info');
    return response.json();
  },

  async getBalance(token: string): Promise<number> {
    const response = await fetch(`${API_URL}/secured/getBalance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении баланса');
    }

    return response.json();
  },

  async getName(token: string): Promise<string> {
    const response = await fetch(`${API_URL}/secured/getName`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении имени пользователя');
    }

    return response.json();
  },

  async getRoles(token: string): Promise<string[]> {
    const response = await fetch(`${API_URL}/secured/getRoles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении ролей');
    }

    return response.json();
  },

  async updateUserInfo(token: string, updates: { numberPhone?: string; username?: string}): Promise<void> {
    const response = await fetch(`${API_URL}/secured/updateUserInfo`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных пользователя');
    }
  },

  async addBalance(token: string, amount: number): Promise<void> {
    const response = await fetch(`${API_URL}/secured/topUpBalance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при пополнении баланса');
    }
  },

  async getFreeScooters(token: string) {
    const response = await fetch(`${API_URL}/secured/getFreeScooters`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении списка самокатов');
    }

    return response.json();
  },

  async startTrip(token: string, scooterId: number, startTime: string) {
    const response = await fetch(`${API_URL}/secured/startTrip`, {
     method: 'POST',
      headers: {
       'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
     },
     body: JSON.stringify({ scooterId, startTime }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при начале поездки');
    }

    let data;
    try {
     data = await response.json();
    } catch (err) {
      data = {};
   }

   return data;
  },

  async finishTrip(token: string, tripId: number, endTime: string, endLatitude: number, endLongitude: number) {
    const response = await fetch(`${API_URL}/secured/finishTrip`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tripId,
        endTime,
        endLatitude,
        endLongitude,
     }),
    });

    if (!response.ok) {
     throw new Error('Ошибка при завершении поездки');
    }

    let data;
    try {
     data = await response.json();
    } catch (err) {
     data = {};
    }

   return data;
  },

  async getActiveTrips(token: string) {
    const response = await fetch(`${API_URL}/secured/allActiveTrips`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(new Date().toISOString()),
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении активных поездок');
    }

    return response.json();
  },

  async getTripHistory(token: string) {
    const response = await fetch(`${API_URL}/secured/tripHistory`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(new Date().toISOString()),
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении истории поездок');
    }

    return response.json();
  },

  async addScooter(token: string, data: { model: string; latitude: number; longitude: number; pricePerMinute: number }) {
    const response = await fetch(`${API_URL}/admin/addScooter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении самоката');
    }

    return response.json();
  },

  async getAllModels(token: string) {
    const response = await fetch(`${API_URL}/admin/getAllModels`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении списка моделей');
    }

    return response.json();
  },

  async updatePrice(token: string, model: string, newPrice: number) {
    const response = await fetch(`${API_URL}/admin/updatePrice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, newPrice }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении цены');
    }

    // Попытка распарсить json, но если его нет — вернуть пустой объект
    let data;
    try {
     data = await response.json();
   } catch (err) {
      data = {}; // сервер не прислал JSON — нормально
    }

   return data;
  },
};