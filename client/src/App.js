import { Switch, Route, useLocation } from 'react-router';
import Home from './components/Home';
import './App.css';

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <div>
      <Switch location={background || location}>
        <Route exact path='/' component={Home} />
      </Switch>
    </div>
  );
}

export default App;
