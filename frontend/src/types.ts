export interface User {
  login: string;
  phone?: string;
  balance: number;
  roles: string[];
}

export interface Trip {
  id: number;
  startTime: string;
  endTime: string;
  distance: number;
  pricePerMinute: number;
  scooterModel: string;
  scooterId: number;
  price: number;
}

export interface Scooter {
  id: number;
  model: string;
  latitude: number;
  longitude: number;
  pricePerMinute: number;
}

export interface ActiveTrip {
  tripId: number;
  scooterId: number;
  scooterModel: string;
  startTime: string;
  startLatitude: number;
  startLongitude: number;
  pricePerMinute: number;
  price: number;
}

export interface UserResponse {
  username: string;
  balance: number;
  roles: string[];
}