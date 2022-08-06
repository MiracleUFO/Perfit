import { Switch, Route, useLocation } from 'react-router';
import Home from './screens/Home';
import User from './screens/User';

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <div>
      <Switch location={background || location}>
        <Route exact path='/' component={Home} />
        <Route path='/user' component={User} />
      </Switch>
    </div>
  );
};

export default App;
