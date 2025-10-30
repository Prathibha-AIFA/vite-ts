// The base URL for our API - uses environment variable or fallback to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Helper function to get common headers for API requests
 * Includes Content-Type and Authorization token if available
 */
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

/**
 * Types used across multiple functions
 */
type EventType = 'login' | 'logout';

interface EventData {
  username: string;
  type: EventType;
  timestamp: string;
}

interface BookingData {
  from: string;      // Station code
  to: string;        // Station code
  date: string;      // YYYY-MM-DD format
  passengers: number;
  cls: string;       // Class type (Economy, Business, First)
}

/**
 * Records a user event (login/logout) in the system
 * @param event The event details to record
 * @returns Promise with the server response
 */
export async function postEvent(event: EventData) {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(event),
  });
  return res.json();
}

/**
 * Fetches all user events from the system
 * @returns Promise with array of events
 */
export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  return res.json();
}

/**
 * Books a new train ticket
 * @param data The booking details (from/to stations, date, etc)
 * @returns Promise with booking confirmation
 */
export async function postBooking(data: BookingData) {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Fetches all bookings for the current user
 * @returns Promise with array of bookings
 */
export async function fetchBookings() {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    headers: getHeaders()
  });
  return res.json();
}

/**
 * Searches for railway stations based on a query string
 * @param query Search text (station name or code)
 * @param page Page number for pagination (starts at 1)
 * @param limit Number of results per page
 * @returns Promise with paginated station results
 */
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

/**
 * Creates a new user account
 * @param username Username for the new account
 * @param email Email address for the new account
 * @param password Password for the new account
 * @returns Promise with registration result
 */
export async function apiRegister(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

/**
 * Logs in an existing user
 * @param email User's email address
 * @param password User's password
 * @returns Promise with login result (including auth token)
 */
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
