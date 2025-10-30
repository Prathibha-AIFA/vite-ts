import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { fetchEvents, postEvent } from './api';
import Login from "./pages/Login";
import UserDetails from "./pages/UserDetails";

import "./App.css";
import BookTicketSimple from "./pages/BookTicketSimple";

interface UserEvent {
  username: string;
  type: "login" | "logout";
  timestamp: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const navigate = useNavigate();


  const handleLogin = (username: string) => {
    const timestamp = new Date().toLocaleString();
    setUser(username);
    setEvents((prev) => [
      ...prev,
      { username, type: "login", timestamp },
    ]);
    // notify backend (uses token from localStorage when available)
    postEvent({ username, type: 'login', timestamp }).catch(() => {});
  };

  const handleLogout = () => {
    if (user) {
      const timestamp = new Date().toLocaleString();
      setEvents((prev) => [
        ...prev,
        { username: user, type: "logout", timestamp },
      ]);
      postEvent({ username: user, type: 'logout', timestamp }).catch(() => {});
      localStorage.removeItem('token');
      navigate("/");
    }
    setUser(null);
    
   
  };

  useEffect(() => {
    // fetch events from backend
    let mounted = true;
    (async () => {
      try {
        const ev = await fetchEvents();
        if (mounted) setEvents(Array.isArray(ev) ? ev : []);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-top">
            <h1 className="nav-logo">🚉 Train Portal</h1>
          </div>

          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} end>
              Home
            </NavLink>
            <NavLink to="/user-details" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
              User Details
            </NavLink>
            <NavLink to="/book-ticket" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
              Book Ticket
            </NavLink>
          </nav>

          <div className="sidebar-bottom">
            {user && (
              <button className="logout-btn" onClick={handleLogout}>
                Logout ({user})
              </button>
            )}
          </div>
        </aside>

        <main className="content-area">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <div className="welcome">
                    <h2>Welcome, {user}!</h2>
                    <p>Select an option from the navigation bar to continue.</p>
                  </div>
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route path="/user-details" element={<UserDetails events={events} user={user} />} />
            <Route
              path="/book-ticket"
              element={user ? <BookTicketSimple /> : <Login onLogin={handleLogin} />}
            />
          </Routes>
        </main>
      </div>
    
  );
};

export default App;
