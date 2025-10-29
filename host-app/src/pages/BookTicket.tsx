import React, { Suspense } from "react";
import "./BookTicket.css";

const RemoteBooking = React.lazy(() => import("remote_app/RemoteButton"));

const BookTicket: React.FC = () => {
  return (
    <div className="book-container">
      <div className="book-card">
        <h2 className="book-title">🚆 Book Train Ticket</h2>

        <Suspense fallback={<div className="loading">Loading Booking Interface...</div>}>
          <div className="remote-wrapper">
            <RemoteBooking />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default BookTicket;
