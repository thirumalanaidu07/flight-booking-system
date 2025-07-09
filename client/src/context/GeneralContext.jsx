import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [ticketBookingDate, setTicketBookingDate] = useState();

  const inputs = {username, email, usertype, password};

  const navigate = useNavigate();

  const clearError = () => {
    setError('');
  };

  const login = async () => {
    try {
      setLoading(true);
      setError('');

      // Validation
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      const loginInputs = { email, password };
      
      const response = await axios.post('http://localhost:6001/login', loginInputs);
      
      const userData = response.data;

      // Store user data
      localStorage.setItem('userId', userData._id);
      localStorage.setItem('userType', userData.usertype);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('email', userData.email);

      // Navigate based on user type
      if (userData.usertype === 'customer') {
        navigate('/');
      } else if (userData.usertype === 'admin') {
        navigate('/admin');
      } else if (userData.usertype === 'flight-operator') {
        navigate('/flight-admin');
      }

    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data.message;
        
        if (errorMessage === 'Invalid email or password') {
          alert('Invalid email or password. Please check your credentials.');
        } else if (errorMessage === 'User not found') {
          alert('No account found with this email address. Please register first.');
        } else if (errorMessage === 'Account not approved') {
          alert('Your account is pending approval. Please contact administrator.');
        } else {
          alert(errorMessage || 'Login failed. Please try again.');
        }
      } else if (err.request) {
        // Network error
        alert('Network error. Please check your internet connection and try again.');
      } else {
        // Other error
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const register = async () => {
    try {
      setLoading(true);
      setError('');

      // Validation
      if (!username || !email || !password || !usertype) {
        alert('Please fill in all fields');
        return;
      }

      if (username.length < 3) {
        alert('Username must be at least 3 characters long');
        return;
      }

      if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }

      if (!['admin', 'customer', 'flight-operator'].includes(usertype)) {
        alert('Please select a valid user type');
        return;
      }

      const response = await axios.post('http://localhost:6001/register', inputs);
      
      const userData = response.data;

      // Store user data
      localStorage.setItem('userId', userData._id);
      localStorage.setItem('userType', userData.usertype);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('email', userData.email);

      // Navigate based on user type
      if (userData.usertype === 'customer') {
        navigate('/');
      } else if (userData.usertype === 'admin') {
        navigate('/admin');
      } else if (userData.usertype === 'flight-operator') {
        navigate('/flight-admin');
      }

    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data.message;
        
        if (errorMessage === 'User already exists') {
          setError('An account with this email already exists. Please login instead.');
        } else if (errorMessage === 'Invalid email format') {
          setError('Please enter a valid email address.');
        } else if (errorMessage === 'Password too weak') {
          setError('Password is too weak. Please choose a stronger password.');
        } else if (errorMessage === 'Invalid user type') {
          setError('Please select a valid user type.');
        } else {
          setError(errorMessage || 'Registration failed. Please try again.');
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your internet connection and try again.');
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear all localStorage
      localStorage.clear();
      
      // Additional cleanup
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorage.removeItem(key);
        }
      }
      
      // Clear form states
      setUsername('');
      setEmail('');
      setPassword('');
      setUsertype('');
      setError('');
      
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Force navigation even if there's an error
      navigate('/');
    }
  };

  return (
    <GeneralContext.Provider value={{
      login, 
      register, 
      logout, 
      username, 
      setUsername, 
      email, 
      setEmail, 
      password, 
      setPassword, 
      usertype, 
      setUsertype, 
      ticketBookingDate, 
      setTicketBookingDate,
      error,
      setError,
      clearError,
      loading
    }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider
