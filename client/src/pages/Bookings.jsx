import React, { useEffect, useState } from 'react'
import '../styles/Bookings.css'
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchBookings();
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:6001/fetch-bookings');
      setBookings(response.data.reverse());
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  const cancelTicket = async (id) => {
    try {
      await axios.put(`http://localhost:6001/cancel-ticket/${id}`);
      alert("Ticket cancelled successfully!");
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel ticket. Please try again.");
      console.error('Error cancelling ticket:', err);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  const userBookings = bookings.filter(booking => booking.user === userId);

  if (loading) {
    return (
      <div className="user-bookingsPage">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-bookingsPage">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p className="bookings-subtitle">Manage your flight reservations</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="user-bookings">
        {userBookings.length === 0 ? (
          <div className="empty-bookings">
            <div className="empty-icon">✈️</div>
            <h3>No Bookings Found</h3>
            <p>You haven't made any flight bookings yet.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.href = '/'}
            >
              Book Your First Flight
            </button>
          </div>
        ) : (
          userBookings.map((booking) => (
            <div className="user-booking" key={booking._id}>
              <div className="booking-header">
                <div className="booking-id">
                  <span className="id-label">ID: {booking._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className={`booking-status ${getStatusColor(booking.bookingStatus)}`}>
                  {booking.bookingStatus}
                </div>
              </div>

              <div className="booking-content">
                <div className="flight-route">
                  <div className="route-cities">
                    <span className="city">{booking.departure}</span>
                    <span className="arrow">→</span>
                    <span className="city">{booking.destination}</span>
                  </div>
                  <div className="flight-details">
                    <span className="flight-name">{booking.flightName}</span>
                    <span className="flight-id">({booking.flightId})</span>
                  </div>
                </div>

                <div className="booking-info">
                  <div className="info-row">
                    <span className="label">Date:</span>
                    <span className="value">{formatDate(booking.journeyDate)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Time:</span>
                    <span className="value">{booking.journeyTime}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Passengers:</span>
                    <span className="value">{booking.passengers.length}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Amount:</span>
                    <span className="value price">₹{booking.totalPrice}</span>
                  </div>
                </div>

                {booking.bookingStatus === 'confirmed' && booking.seats && (
                  <div className="seats-info">
                    <span className="label">Seats:</span>
                    <span className="value">{booking.seats}</span>
                  </div>
                )}

                <div className="booking-dates">
                  <span className="date-label">Booked: {formatDate(booking.bookingDate)}</span>
                </div>
              </div>

              {booking.bookingStatus === 'confirmed' && (
                <div className="booking-actions">
                  <button 
                    className="btn btn-danger cancel-btn" 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this booking?')) {
                        cancelTicket(booking._id);
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Bookings