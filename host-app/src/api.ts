
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';


function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Add auth token if we have one
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}


 //Types used across multiple functions

type EventType = 'login' | 'logout';

interface EventData {
  username: string;
  type: EventType;
  timestamp: string;
}

interface BookingData {
  from: string;     
  to: string;        
  date: string;      
  passengers: number;
  cls: string;       
}


 //Records a user event (login/logout) in the system

export async function postEvent(event: EventData) {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(event),
  });
  return res.json();
}


 // Fetches all user events from the system

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  return res.json();
}


 //Books a new train ticket
 
export async function postBooking(data: BookingData) {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}


 //Fetches all bookings for the current user

export async function fetchBookings() {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    headers: getHeaders()
  });
  return res.json();
}


 //Searches for railway stations based on a query string

export async function fetchStations(query = '', page = 1, limit = 50) {
  // Build query parameters in a safe way
  const params = new URLSearchParams({
    query: query || '',
    page: String(page),
    limit: String(limit)
  });

  const res = await fetch(`${API_BASE}/api/stations?${params}`);
  return res.json();
}


 //Creates a new user account

export async function apiRegister(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}


 //Logs in an existing user
 
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
