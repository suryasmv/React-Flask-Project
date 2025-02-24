/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (check cookies)
    const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    if (accessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate('/', { replace: true }); // Redirect to login page
    }
  }, [navigate]);

  return isLoggedIn ? children : null;
};

export default ProtectedRoute;
