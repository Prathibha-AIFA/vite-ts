import React, { useState } from 'react';
import { postBooking } from '../api';
import StationSelectSimple from '../components/StationSelectSimple';
import './BookTicketSimple.css';


interface Station {
  name: string;
  code: string;
}


const BookTicketSimple: React.FC = () => {

  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [travelDate, setTravelDate] = useState('');
  const [numPassengers, setNumPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');

 
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingSubmitted(true);

    try {
     
      const bookingDetails = {
        from: fromStation?.code || '',  
        to: toStation?.code || '',
        date: travelDate,
        passengers: numPassengers,
        cls: travelClass
      };

      // Send to server
      const result = await postBooking(bookingDetails);

      // If successful, save the booking ID
      if (result?.id) {
        setBookingId(String(result.id));
      }
    } catch (error) {
      
      console.error('Booking failed:', error);
    }
  };

  return (
    <div className="book-alt-container">
      <div className="book-alt-card">
       
        <div className="form-side">
          <h2 className="book-alt-title">🚆 Book Train Ticket</h2>

          <form className="booking-form" onSubmit={handleSubmit}>
            {/* From Station */}
            <label className="field">
              <span>From Station</span>
              <StationSelectSimple
                selected={fromStation}
                onSelect={station => setFromStation(station)}
                placeholder="Search for departure station"
              />
            </label>

            {/* To Station */}
            <label className="field">
              <span>To Station</span>
              <StationSelectSimple
                selected={toStation}
                onSelect={station => setToStation(station)}
                placeholder="Search for arrival station"
              />
            </label>

            {/* Travel Date */}
            <label className="field">
              <span>Date of Travel</span>
              <input
                type="date"
                value={travelDate}
                onChange={e => setTravelDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]} // we can't pick past dates
              />
            </label>

            {/* Passenger Count and Class Selection */}
            <div className="row">
              <label className="field small">
                <span>Number of Passengers</span>
                <input
                  type="number"
                  min={1}
                  max={6} //  limit for passengers
                  value={numPassengers}
                  onChange={e => setNumPassengers(Number(e.target.value))}
                />
              </label>

              <label className="field small">
                <span>Travel Class</span>
                <select 
                  value={travelClass}
                  onChange={e => setTravelClass(e.target.value)}
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </label>
            </div>

           
            <div className="actions">
              <button type="submit" className="primary">
                Search Available Trains
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Booking Summary */}
        <div className="summary-side">
          <div className="summary-card">
            <h3>Your Journey Details</h3>

            {!isBookingSubmitted ? (
            
              <p className="muted">
                Fill in your journey details and click "Search Available Trains"
                to see available options.
              </p>
            ) : (
              // Show journey summary after form submission
              <div className="summary-list">
                {/* From Station */}
                <div className="row-item">
                  <strong>From:</strong>{' '}
                  {fromStation ? `${fromStation.name} (${fromStation.code})` : ''}
                </div>

                {/* To Station */}
                <div className="row-item">
                  <strong>To:</strong>{' '}
                  {toStation ? `${toStation.name} (${toStation.code})` : ''}
                </div>

                {/* Travel Date */}
                <div className="row-item">
                  <strong>Date:</strong>{' '}
                  {new Date(travelDate).toLocaleDateString()}
                </div>

                {/* Passengers and Class */}
                <div className="row-item">
                  <strong>Passengers:</strong> {numPassengers}
                </div>
                <div className="row-item">
                  <strong>Class:</strong> {travelClass}
                </div>

                {/* Show booking confirmation or train selection */}
                {bookingId ? (
                  <div className="muted">
                    Booking confirmed! Reference: {bookingId}
                  </div>
                ) : (
                  <div className="cta">
                    <button className="secondary">Select Your Train</button>
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

export default BookTicketSimple;