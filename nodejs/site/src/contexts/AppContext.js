import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('Context must be used within a Provider.');
  }

  return context;
};

const AppContextProvider = ({ children, initialValues }) => {
  const [values, setValues] = useState(initialValues ?? {});
  return (
    <AppContext.Provider value={[values, setValues]}>
      {children}
    </AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialValues: PropTypes.any,
};

export default AppContextProvider;
