import React, { useState, useEffect, useContext } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);
  const [markerId, setMarkerId] = useState(0);

  //   useEffect(() => {
  //     setMarkerId(markerId + 1);
  //   }, [markers, markerId, setMarkerId]);

  return (
    <AppContext.Provider value={{ markers, setMarkers }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
