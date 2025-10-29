import React, { useState } from "react";
import "./BookTicketAlt.css";
import { postBooking } from '../api';
import StationSelect from '../components/StationSelect';

const BookTicketAlt: React.FC = () => {
  const [fromStation, setFromStation] = useState<{ name: string; code: string } | null>(null);
  const [toStation, setToStation] = useState<{ name: string; code: string } | null>(null);
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState<number>(1);
  const [cls, setCls] = useState<string>("Economy");
  const [submitted, setSubmitted] = useState(false);

  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const payload = {
        from: fromStation?.code || fromStation?.name || '',
        to: toStation?.code || toStation?.name || '',
        date,
        passengers,
        cls,
      };
      const res = await postBooking(payload as any);
      if (res && res.id) setBookingId(String(res.id));
    } catch (err) {
      // ignore for now
    }
  };

  return (
    <div className="book-alt-container">
      <div className="book-alt-card">
        <div className="form-side">
          <h2 className="book-alt-title">🚆 Book Train Ticket</h2>

          <form className="booking-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>From</span>
                <StationSelect
                  selected={fromStation}
                  onSelect={(s) => setFromStation(s)}
                  placeholder="Search origin station by name or code"
                />
              </label>

              <label className="field">
                <span>To</span>
                <StationSelect
                  selected={toStation}
                  onSelect={(s) => setToStation(s)}
                  placeholder="Search destination station by name or code"
                />
              </label>

            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <div className="row">
              <label className="field small">
                <span>Passengers</span>
                <input
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                />
              </label>

              <label className="field small">
                <span>Class</span>
                <select value={cls} onChange={(e) => setCls(e.target.value)}>
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </label>
            </div>

            <div className="actions">
              <button type="submit" className="primary">
                Search Trains
              </button>
            </div>
          </form>
        </div>

        <div className="summary-side">
          <div className="summary-card">
            <h3>Trip Summary</h3>
            {!submitted ? (
              <p className="muted">Fill the form and click "Search Trains" to see available journeys.</p>
            ) : (
              <div className="summary-list">
                <div className="row-item"><strong>From:</strong> {fromStation ? `${fromStation.name} (${fromStation.code})` : ''}</div>
                <div className="row-item"><strong>To:</strong> {toStation ? `${toStation.name} (${toStation.code})` : ''}</div>
                <div className="row-item"><strong>Date:</strong> {date}</div>
                <div className="row-item"><strong>Passengers:</strong> {passengers}</div>
                <div className="row-item"><strong>Class:</strong> {cls}</div>
                {bookingId ? (
                  <div className="muted">Booking confirmed — id: {bookingId}</div>
                ) : (
                  <div className="cta">
                    <button className="secondary">Choose Train</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicketAlt;
