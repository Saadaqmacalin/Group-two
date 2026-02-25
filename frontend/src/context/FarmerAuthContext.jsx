import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const FarmerAuthContext = createContext();

export const FarmerAuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const farmerInfo = localStorage.getItem('farmerInfo');
    if (farmerInfo) {
      setFarmer(JSON.parse(farmerInfo));
    }
    setLoading(false);
  }, []);

  const loginFarmer = async (email, password) => {
    const { data } = await api.post('/farmers/login', { email, password });
    setFarmer(data);
    localStorage.setItem('farmerInfo', JSON.stringify(data));
    return data;
  };

  const logoutFarmer = () => {
    setFarmer(null);
    localStorage.removeItem('farmerInfo');
  };

  const registerFarmer = async (farmerData) => {
    const { data } = await api.post('/farmers/register', farmerData);
    setFarmer(data);
    localStorage.setItem('farmerInfo', JSON.stringify(data));
    return data;
  };

  return (
    <FarmerAuthContext.Provider value={{ farmer, loading, loginFarmer, logoutFarmer, registerFarmer }}>
      {children}
    </FarmerAuthContext.Provider>
  );
};

export const useFarmerAuth = () => {
  const context = useContext(FarmerAuthContext);
  if (!context) {
    throw new Error('useFarmerAuth must be used within a FarmerAuthProvider');
  }
  return context;
};
