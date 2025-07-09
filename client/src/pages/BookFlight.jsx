import React, { useContext, useEffect, useState } from 'react'
import '../styles/BookFlight.css'
import { GeneralContext } from '../context/GeneralContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookFlight = () => {
    const {id} = useParams();

    const [flightName, setFlightName] = useState('');
    const [flightId, setFlightId] = useState('');
    const [basePrice, setBasePrice] = useState(0);
    const [StartCity, setStartCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [startTime, setStartTime] = useState();
  
    // Form validation states
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [coachType, setCoachType] = useState('');
    const [numberOfPassengers, setNumberOfPassengers] = useState(0);
    const [journeyDate, setJourneyDate] = useState('');
    const [passengerDetails, setPassengerDetails] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    
    // Validation error states
    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [coachTypeError, setCoachTypeError] = useState('');
    const [passengersError, setPassengersError] = useState('');
    const [dateError, setDateError] = useState('');
    const [passengerDetailsErrors, setPassengerDetailsErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const {ticketBookingDate} = useContext(GeneralContext);
    const price = {'economy': 1, 'premium-economy': 2, 'business': 3, 'first-class': 4}
  
    useEffect(()=>{
      fetchFlightData();
      setJourneyDate(ticketBookingDate);
    }, [ticketBookingDate])
  
    const fetchFlightData = async () =>{
      try {
        const response = await axios.get(`http://localhost:6001/fetch-flight/${id}`);
        setFlightName(response.data.flightName);
        setFlightId(response.data.flightId);
        setBasePrice(response.data.basePrice);
        setStartCity(response.data.origin);
        setDestinationCity(response.data.destination);
        setStartTime(response.data.departureTime);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    }

    // Validation functions
    const validateEmail = (email) => {
      if (!email) return 'Email is required';
      if (!email.includes('@') || !email.includes('.')) {
        return 'Please enter a valid email address';
      }
      return '';
    };

    const validateMobile = (mobile) => {
      if (!mobile) return 'Mobile number is required';
      if (mobile.length < 10 || mobile.length > 15) {
        return 'Please enter a valid mobile number';
      }
      if (!/^\d+$/.test(mobile)) {
        return 'Mobile number should contain only digits';
      }
      return '';
    };

    const validateCoachType = (coachType) => {
      if (!coachType) return 'Please select a seat class';
      return '';
    };

    const validatePassengers = (numberOfPassengers) => {
      if (!numberOfPassengers || numberOfPassengers <= 0) {
        return 'Please enter number of passengers';
      }
      if (numberOfPassengers > 10) {
        return 'Maximum 10 passengers allowed per booking';
      }
      return '';
    };

    const validateDate = (date) => {
      if (!date) return 'Please select journey date';
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return 'Journey date cannot be in the past';
      }
      return '';
    };

    const validatePassengerDetails = (details, count) => {
      const errors = [];
      for (let i = 0; i < count; i++) {
        const passenger = details[i] || {};
        const passengerError = {};
        
        if (!passenger.name || passenger.name.trim().length < 2) {
          passengerError.name = 'Passenger name is required (min 2 characters)';
        }
        
        if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
          passengerError.age = 'Please enter a valid age (1-120)';
        }
        
        if (Object.keys(passengerError).length > 0) {
          errors[i] = passengerError;
        }
      }
      return errors;
    };

    // Handle input changes with validation
    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);
      setEmailError(validateEmail(value));
      setSubmitError('');
    };

    const handleMobileChange = (e) => {
      const value = e.target.value;
      setMobile(value);
      setMobileError(validateMobile(value));
      setSubmitError('');
    };

    const handleCoachTypeChange = (e) => {
      const value = e.target.value;
      setCoachType(value);
      setCoachTypeError(validateCoachType(value));
      setSubmitError('');
    };

    const handlePassengerChange = (event) => {
      const value = parseInt(event.target.value);
      setNumberOfPassengers(value);
      setPassengersError(validatePassengers(value));
      setSubmitError('');
      
      // Update passenger details array
      if (value > passengerDetails.length) {
        setPassengerDetails(prev => [...prev, ...Array(value - prev.length).fill({})]);
      } else {
        setPassengerDetails(prev => prev.slice(0, value));
      }
    };

    const handleDateChange = (e) => {
      const value = e.target.value;
      setJourneyDate(value);
      setDateError(validateDate(value));
      setSubmitError('');
    };

    const handlePassengerDetailsChange = (index, key, value) => {
      setPassengerDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails[index] = { ...updatedDetails[index], [key]: value };
        return updatedDetails;
      });
      
      // Validate the specific passenger detail
      const updatedDetails = [...passengerDetails];
      updatedDetails[index] = { ...updatedDetails[index], [key]: value };
      const errors = validatePassengerDetails(updatedDetails, numberOfPassengers);
      setPassengerDetailsErrors(errors);
      setSubmitError('');
    };
  
    useEffect(()=>{
      if(price[coachType] * basePrice * numberOfPassengers){
        setTotalPrice(price[coachType] * basePrice * numberOfPassengers);
      }
    },[numberOfPassengers, coachType, basePrice])
  
    const navigate = useNavigate();
  
    const bookFlight = async ()=>{
      setLoading(true);
      setSubmitError('');

      // Validate all fields
      const emailValidation = validateEmail(email);
      const mobileValidation = validateMobile(mobile);
      const coachTypeValidation = validateCoachType(coachType);
      const passengersValidation = validatePassengers(numberOfPassengers);
      const dateValidation = validateDate(journeyDate);
      const passengerDetailsValidation = validatePassengerDetails(passengerDetails, numberOfPassengers);

      setEmailError(emailValidation);
      setMobileError(mobileValidation);
      setCoachTypeError(coachTypeValidation);
      setPassengersError(passengersValidation);
      setDateError(dateValidation);
      setPassengerDetailsErrors(passengerDetailsValidation);

      // Check if there are any validation errors
      const hasErrors = emailValidation || mobileValidation || coachTypeValidation || 
                       passengersValidation || dateValidation || passengerDetailsValidation.length > 0;

      if (hasErrors) {
        setLoading(false);
        return;
      }

      const inputs = {
        user: localStorage.getItem('userId'), 
        flight: id, 
        flightName, 
        flightId, 
        departure: StartCity, 
        journeyTime: startTime, 
        destination: destinationCity, 
        email, 
        mobile, 
        passengers: passengerDetails, 
        totalPrice, 
        journeyDate, 
        seatClass: coachType
      };
      
      try {
        const response = await axios.post('http://localhost:6001/book-ticket', inputs);
        alert("Booking successful!");
        navigate('/bookings');
      } catch (err) {
        console.error('Booking error:', err);
        setSubmitError(err.response?.data?.message || 'Booking failed! Please try again.');
      } finally {
        setLoading(false);
      }
    }
  
    return (
      <div className='BookFlightPage'>
        <div className="BookingFlightPageContainer">
          <h2>Book ticket</h2>
          
          {submitError && (
            <div className="error-message">
              <p>{submitError}</p>
            </div>
          )}

          <span>
            <p><b>Flight Name: </b> {flightName}</p>
            <p><b>Flight No: </b> {flightId}</p>
          </span>
          <span>
            <p><b>Base price: </b> ${basePrice}</p>
          </span>
          
          <span>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className={`form-control ${emailError ? 'error' : ''}`}
                id="floatingInputemail" 
                value={email} 
                onChange={handleEmailChange}
                placeholder="Enter your email"
              />
              <label htmlFor="floatingInputemail">Email</label>
              {emailError && (
                <div className="validation-error">
                  <span>{emailError}</span>
                </div>
              )}
            </div>
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className={`form-control ${mobileError ? 'error' : ''}`}
                id="floatingInputmobile" 
                value={mobile} 
                onChange={handleMobileChange}
                placeholder="Enter mobile number"
              />
              <label htmlFor="floatingInputmobile">Mobile</label>
              {mobileError && (
                <div className="validation-error">
                  <span>{mobileError}</span>
                </div>
              )}
            </div>
          </span>

          <span className='span3'>
            <div className="no-of-passengers">
              <div className="form-floating mb-3">
                <input 
                  type="number" 
                  className={`form-control ${passengersError ? 'error' : ''}`}
                  id="floatingInputpassengers" 
                  value={numberOfPassengers} 
                  onChange={handlePassengerChange}
                  min="1"
                  max="10"
                  placeholder="Number of passengers"
                />
                <label htmlFor="floatingInputpassengers">No of passengers</label>
                {passengersError && (
                  <div className="validation-error">
                    <span>{passengersError}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="date" 
                className={`form-control ${dateError ? 'error' : ''}`}
                id="floatingInputdate" 
                value={journeyDate} 
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
              />
              <label htmlFor="floatingInputdate">Journey date</label>
              {dateError && (
                <div className="validation-error">
                  <span>{dateError}</span>
                </div>
              )}
            </div>
            <div className="form-floating">
              <select 
                className={`form-select form-select-sm mb-3 ${coachTypeError ? 'error' : ''}`}
                aria-label=".form-select-sm example" 
                value={coachType} 
                onChange={handleCoachTypeChange}
              >
                <option value="">Select seat class</option>
                <option value="economy">Economy class</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business class</option>
                <option value="first-class">First class</option>
              </select>
              <label htmlFor="floatingSelect">Seat Class</label>
              {coachTypeError && (
                <div className="validation-error">
                  <span>{coachTypeError}</span>
                </div>
              )}
            </div>
          </span>

          <div className="new-passengers">
            {Array.from({ length: numberOfPassengers }).map((_, index) => (
              <div className='new-passenger' key={index}>
                <h4>Passenger {index + 1}</h4>
                <div className="new-passenger-inputs">
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className={`form-control ${passengerDetailsErrors[index]?.name ? 'error' : ''}`}
                      id={`floatingInputpassengerName${index}`}
                      value={passengerDetails[index]?.name || ''} 
                      onChange={(event) => handlePassengerDetailsChange(index, 'name', event.target.value)}
                      placeholder="Passenger name"
                    />
                    <label htmlFor={`floatingInputpassengerName${index}`}>Name</label>
                    {passengerDetailsErrors[index]?.name && (
                      <div className="validation-error">
                        <span>{passengerDetailsErrors[index].name}</span>
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input 
                      type="number" 
                      className={`form-control ${passengerDetailsErrors[index]?.age ? 'error' : ''}`}
                      id={`floatingInputpassengerAge${index}`}
                      value={passengerDetails[index]?.age || ''} 
                      onChange={(event) => handlePassengerDetailsChange(index, 'age', event.target.value)}
                      min="1"
                      max="120"
                      placeholder="Age"
                    />
                    <label htmlFor={`floatingInputpassengerAge${index}`}>Age</label>
                    {passengerDetailsErrors[index]?.age && (
                      <div className="validation-error">
                        <span>{passengerDetailsErrors[index].age}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <h6><b>Total price</b>: ${totalPrice}</h6>
          <button 
            className={`btn btn-primary ${loading ? 'loading' : ''}`} 
            onClick={bookFlight}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Book now'}
          </button>
        </div>
      </div>
    )
  }

export default BookFlight