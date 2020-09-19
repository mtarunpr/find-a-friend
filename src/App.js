import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageHome from './PageHome';
import PageLogin from './PageLogin';
import PageRegister from './PageRegister';
import PageChat from './PageChat';

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <PageHome />
      </Route>
      <Route exact path="/login">
        <PageLogin />
      </Route>
      <Route exact path="/register">
        <PageRegister />
      </Route>
      <Route exact path="/chat/:chatId">
        <PageChat />
      </Route>
      <Route>
        Page Not Found!
      </Route>
    </Switch>
  );
}

export default App;
