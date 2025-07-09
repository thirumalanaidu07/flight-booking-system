import React, { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Register = ({setIsLogin}) => {

  const {setUsername, setEmail, setPassword, usertype, setUsertype, register, error, clearError, loading} = useContext(GeneralContext);
  
  const [usernameValue, setUsernameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [usertypeValue, setUsertypeValue] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usertypeError, setUsertypeError] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [usertypeTouched, setUsertypeTouched] = useState(false);
  const [serverError, setServerError] = useState('');

  // Clear error when component mounts or when switching forms
  useEffect(() => {
    clearError();
    setServerError('');
  }, [clearError]);

  // Handle server error messages
  useEffect(() => {
    if (error) {
      if (error.includes('already exists')) {
        setServerError('An account with this email already exists. Please try logging in instead.');
      } else if (error.includes('Server Error')) {
        setServerError('Something went wrong. Please try again later.');
      } else {
        setServerError(error);
      }
    } else {
      setServerError('');
    }
  }, [error]);

  // Username validation
  const validateUsername = (username) => {
    if (!username) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
      return 'Username must be less than 20 characters';
    }
    return '';
  };

  // Email validation
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!email.includes('.')) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password.length > 50) {
      return 'Password must be less than 50 characters';
    }
    return '';
  };

  // User type validation
  const validateUsertype = (usertype) => {
    if (!usertype) {
      return 'Please select a user type';
    }
    if (!['admin', 'customer', 'flight-operator'].includes(usertype)) {
      return 'Please select a valid user type';
    }
    return '';
  };

  // Handle username change
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsernameValue(value);
    setUsername(value);
    setServerError(''); // Clear server error when user starts typing
    
    if (usernameTouched) {
      const error = validateUsername(value);
      setUsernameError(error);
    }
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailValue(value);
    setEmail(value);
    setServerError(''); // Clear server error when user starts typing
    
    if (emailTouched) {
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordValue(value);
    setPassword(value);
    setServerError(''); // Clear server error when user starts typing
    
    if (passwordTouched) {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  // Handle usertype change
  const handleUsertypeChange = (e) => {
    const value = e.target.value;
    setUsertypeValue(value);
    setUsertype(value);
    setServerError(''); // Clear server error when user starts typing
    
    if (usertypeTouched) {
      const error = validateUsertype(value);
      setUsertypeError(error);
    }
  };

  // Handle field blur events
  const handleUsernameBlur = () => {
    setUsernameTouched(true);
    const error = validateUsername(usernameValue);
    setUsernameError(error);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const error = validateEmail(emailValue);
    setEmailError(error);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const error = validatePassword(passwordValue);
    setPasswordError(error);
  };

  const handleUsertypeBlur = () => {
    setUsertypeTouched(true);
    const error = validateUsertype(usertypeValue);
    setUsertypeError(error);
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const usernameValidation = validateUsername(usernameValue);
    const emailValidation = validateEmail(emailValue);
    const passwordValidation = validatePassword(passwordValue);
    const usertypeValidation = validateUsertype(usertypeValue);
    
    setUsernameError(usernameValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setUsertypeError(usertypeValidation);
    setUsernameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setUsertypeTouched(true);
    
    // If there are validation errors, don't proceed
    if (usernameValidation || emailValidation || passwordValidation || usertypeValidation) {
      return;
    }
    
    await register();
  };

  // Clear validation errors when switching forms
  const handleSwitchToLogin = () => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setUsertypeError('');
    setUsernameTouched(false);
    setEmailTouched(false);
    setPasswordTouched(false);
    setUsertypeTouched(false);
    setUsernameValue('');
    setEmailValue('');
    setPasswordValue('');
    setUsertypeValue('');
    setServerError('');
    clearError();
    setIsLogin(true);
  };

  return (
    <form className="authForm">
        <h2>Register</h2>
        
        {serverError && (
          <div className="error-message">
            <p>{serverError}</p>
            {serverError.includes('already exists') && (
              <div className="error-suggestion">
                <p>Already have an account? <span onClick={handleSwitchToLogin}>Login here</span></p>
              </div>
            )}
          </div>
        )}

        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="text" 
              className={`form-control ${usernameError ? 'error' : ''}`}
              id="floatingInput" 
              placeholder="username"
              value={usernameValue}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onFocus={() => {
                clearError();
                setServerError('');
              }}
            />
            <label htmlFor="floatingInput">Username</label>
            {usernameError && (
              <div className="validation-error">
                <span>{usernameError}</span>
              </div>
            )}
        </div>
        
        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="email" 
              className={`form-control ${emailError ? 'error' : ''}`}
              id="floatingEmail" 
              placeholder="name@example.com"
              value={emailValue}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onFocus={() => {
                clearError();
                setServerError('');
              }}
            />
            <label htmlFor="floatingInput">Email address</label>
            {emailError && (
              <div className="validation-error">
                <span>{emailError}</span>
              </div>
            )}
        </div>
        
        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="password" 
              className={`form-control ${passwordError ? 'error' : ''}`}
              id="floatingPassword" 
              placeholder="Password"
              value={passwordValue}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              onFocus={() => {
                clearError();
                setServerError('');
              }}
            /> 
            <label htmlFor="floatingPassword">Password</label>
            {passwordError && (
              <div className="validation-error">
                <span>{passwordError}</span>
              </div>
            )}
        </div>
        
        <select 
          className={`form-select form-select-lg mb-3 ${usertypeError ? 'error' : ''}`}
          aria-label=".form-select-lg example" 
          value={usertypeValue}
          onChange={handleUsertypeChange}
          onBlur={handleUsertypeBlur}
          onFocus={() => {
            clearError();
            setServerError('');
          }}
        >
          <option value="">User type</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="flight-operator">Flight Operator</option>
        </select>
        {usertypeError && (
          <div className="validation-error">
            <span>{usertypeError}</span>
          </div>
        )}
        
        <button 
          className={`btn btn-primary ${loading ? 'loading' : ''}`} 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        
        <p>Already registered? <span onClick={handleSwitchToLogin}>Login</span></p>
    </form>
  )
}

export default Register;