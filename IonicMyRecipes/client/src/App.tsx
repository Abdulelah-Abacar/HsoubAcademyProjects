import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { IonApp, IonLabel, IonPage, IonRouterOutlet, IonSplitPane, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Register from './pages/register';
import Login from './pages/login';
import AppTabs from './AppTabs';
import Menu from './components/Menu/Menu'
import AuthContextProvider from './context/AuthContext'

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthContextProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/account/register">
            <Register />
          </Route>
          <Route exact path="/account/login">
            <Login />
          </Route>
          <Route path="/my-recipe">
            <Menu />
            <AppTabs />
          </Route>
          <Route exact path="/">
            <Redirect to="/my-recipe/all-posts" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthContextProvider>
  </IonApp>
);

export default App;
