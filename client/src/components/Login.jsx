import React, { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Login = ({setIsLogin}) => {

  const {setEmail, setPassword, login, error, clearError, loading} = useContext(GeneralContext);
  
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [serverError, setServerError] = useState('');

  // Clear error when component mounts or when switching forms
  useEffect(() => {
    clearError();
    setServerError('');
  }, [clearError]);

  // Handle server error messages
  useEffect(() => {
    if (error) {
      if (error.includes('User not found')) {
        setServerError('No account found with this email. Please check your email or create a new account.');
      } else if (error.includes('Incorrect password')) {
        setServerError('The password you entered is incorrect. Please try again.');
      } else if (error.includes('Server Error')) {
        setServerError('Something went wrong. Please try again later.');
      } else {
        setServerError(error);
      }
    } else {
      setServerError('');
    }
  }, [error]);

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
    return '';
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

  // Handle email blur
  const handleEmailBlur = () => {
    setEmailTouched(true);
    const error = validateEmail(emailValue);
    setEmailError(error);
  };

  // Handle password blur
  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const error = validatePassword(passwordValue);
    setPasswordError(error);
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailValidation = validateEmail(emailValue);
    const passwordValidation = validatePassword(passwordValue);
    
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setEmailTouched(true);
    setPasswordTouched(true);
    
    // If there are validation errors, don't proceed
    if (emailValidation || passwordValidation) {
      return;
    }
    
    await login();
  };

  // Clear validation errors when switching forms
  const handleSwitchToRegister = () => {
    setEmailError('');
    setPasswordError('');
    setEmailTouched(false);
    setPasswordTouched(false);
    setEmailValue('');
    setPasswordValue('');
    setServerError('');
    clearError();
    setIsLogin(false);
  };

  return (
    <form className="authForm">
        <h2>Login</h2>
        
        {serverError && (
          <div className="error-message">
            <p>{serverError}</p>
            {serverError.includes('No account found') && (
              <div className="error-suggestion">
                <p>Don't have an account? <span onClick={handleSwitchToRegister}>Register here</span></p>
              </div>
            )}
            {serverError.includes('Incorrect password') && (
              <div className="error-suggestion">
                <p>Forgot your password? Contact support for assistance.</p>
              </div>
            )}
          </div>
        )}

        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="email" 
              className={`form-control ${emailError ? 'error' : ''}`}
              id="floatingInput" 
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
        
        <button 
          type="submit" 
          className={`btn btn-primary ${loading ? 'loading' : ''}`} 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p>Not registered? <span onClick={handleSwitchToRegister}>Register</span></p>
    </form>
  )
}

export default Login