import { UserProvider } from './context/userContext';
import { ModalProvider } from './context/modalContext';
import { Switch, Route, useLocation } from 'react-router';

import Home from './pages/Home';
import User from './pages/User';

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <UserProvider>
      <ModalProvider>
        <Switch location={background || location}>
          <Route exact path='/' component={Home} />
          <Route path='/user' component={User} />
        </Switch>
      </ModalProvider>
    </UserProvider>
  );
};

export default App;
