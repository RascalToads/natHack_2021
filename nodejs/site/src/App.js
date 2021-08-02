import Styles from './styles/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppContextProvider from './contexts/AppContext';
import WebhookConfigurator from './components/WebHookConfigurator';

const App = () => (
  <AppContextProvider>
    <Styles>
      <Router>
        <Route path="/">
          <WebhookConfigurator />
        </Route>
      </Router>
    </Styles>
  </AppContextProvider>
);

export default App;
