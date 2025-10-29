const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function postEvent(event: { username: string; type: 'login'|'logout'; timestamp: string }) {
  const token = localStorage.getItem('token');
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers,
    body: JSON.stringify(event),
  });
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  return res.json();
}

export async function postBooking(data: { from: string; to: string; date: string; passengers: number; cls: string }) {
  const token = localStorage.getItem('token');
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchBookings() {
  const token = localStorage.getItem('token');
  const headers: Record<string,string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/bookings`, { headers });
  return res.json();
}

export async function fetchStations(query = '', page = 1, limit = 50) {
  const q = encodeURIComponent(query || '');
  const res = await fetch(`${API_BASE}/api/stations?query=${q}&page=${page}&limit=${limit}`);
  return res.json();
}

export async function apiRegister(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
