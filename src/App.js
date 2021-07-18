import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './services/firebase';
import './styles/global.scss';

import { Home } from "./pages/Home";
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';

import { AuthContextProvider } from './contexts/AuthContext';
import { AdminRoom } from './pages/AdminRoom';

const App = () => {

  return (

    <BrowserRouter>

      <AuthContextProvider>
        <Switch>
          <Route exact path = '/' component = { Home } />
          <Route path = '/rooms/new' component = { NewRoom } />
          <Route path = '/rooms/:id' component = { Room } />
          <Route path = '/admin/:user/rooms/:id' component = { AdminRoom } />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>

  );
}

export default App;