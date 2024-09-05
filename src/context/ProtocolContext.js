import React, { createContext, useContext, useState } from 'react';

const ProtocolContext = createContext();

export function ProtocolProvider({ children }) {
  const [protocol, setProtocol] = useState({
    published: true,
    protocol: '',
    types: {},
    structure: {}
  });

  const updateProtocol = (newData) => {
    setProtocol((prevProtocol) => ({ ...prevProtocol, ...newData }));
  };

  return (
    <ProtocolContext.Provider value={{ protocol, updateProtocol }}>
      {children}
    </ProtocolContext.Provider>
  );
}

export function useProtocol() {
  return useContext(ProtocolContext);
}