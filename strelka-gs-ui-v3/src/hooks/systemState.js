import React, { createContext, useContext, useEffect, useState } from 'react';

const SystemStateContext = createContext();

export const useSystemState = () => {
  const context = useContext(SystemStateContext);
  if (!context) {
    throw new Error('useSystemState must be used within a SystemStateProvider');
  }
  return context;
};

export const SystemStateProvider = ({ children }) => {
  const [systemState, setSystemState] = useState(() => {
    // Try to get the state from local storage
    const storedState = localStorage.getItem('systemState');
    return storedState ? JSON.parse(storedState) : {};
  });

  useEffect(() => {
    // Update local storage whenever the state changes
    localStorage.setItem('systemState', JSON.stringify(systemState));
  }, [systemState]);

  const updateSystemState = (newState) => {
    setSystemState((prev) => {
      return { ...prev, ...newState };
    });
  };
  

  return (
    <SystemStateContext.Provider value={{ systemState, updateSystemState }}>
      {children}
    </SystemStateContext.Provider>
  );
};
