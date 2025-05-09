import React, { createContext, useState, useContext, useEffect } from 'react';
import { Trip, Scooter, ActiveTrip } from '../types';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface TripContextType {
  trips: Trip[];
  activeTrips: ActiveTrip[];
  scooters: Scooter[];
  startTrip: (scooterId: number, startLocation: { latitude: number, longitude: number }) => Promise<void>;
  endTrip: (tripId: number, endLocation: { latitude: number, longitude: number }) => Promise<void>;
  loadTrips: () => Promise<void>;
  loadScooters: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
  const [scooters, setScooters] = useState<Scooter[]>([]);

  const loadTrips = async () => {
    if (!token) return;
    
    try {
      const [tripHistory, active] = await Promise.all([
        api.getTripHistory(token),
        api.getActiveTrips(token)
      ]);
      
      setTrips(tripHistory);
      setActiveTrips(active);
    } catch (error) {
      console.error('Ошибка при загрузке поездок:', error);
    }
  };

  const loadScooters = async () => {
    if (!token) return;
    
    try {
      const freeScooters = await api.getFreeScooters(token);
      setScooters(freeScooters);
    } catch (error) {
      console.error('Ошибка при загрузке самокатов:', error);
    }
  };

  useEffect(() => {
    if (token) {
      loadTrips();
      loadScooters();
    }
  }, [token]);

  const startTrip = async (scooterId: number, startLocation: { latitude: number, longitude: number }) => {
    if (!token) return;
    

    await api.startTrip(token, scooterId, new Date().toISOString());
    await Promise.all([loadTrips(), loadScooters()]);
  };

  const endTrip = async (tripId: number, endLocation: { latitude: number, longitude: number }) => {
    if (!token) return;
    
    await api.finishTrip(
      token,
      tripId,
      new Date().toISOString(),
      endLocation.latitude,
      endLocation.longitude
    );
    await Promise.all([loadTrips(), loadScooters()]);
  };

  return (
    <TripContext.Provider value={{ 
      trips, 
      activeTrips, 
      scooters, 
      startTrip, 
      endTrip,
      loadTrips,
      loadScooters
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip должен использоваться внутри TripProvider');
  }
  return context;
};