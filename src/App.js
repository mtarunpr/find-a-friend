import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageHome from './PageHome';
import PageLogin from './PageLogin';
import PageRegister from './PageRegister';
import PageChat from './PageChat';
import { isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';

const App = props => {
  if(!isLoaded(props.auth, props.profile)) {
    return <div>Authentication Loading...</div>
  }

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
      <Route exact path="/chat">
        <PageChat />
      </Route>
      <Route>
        Page Not Found!
      </Route>
    </Switch>
  );
}

const mapStateToProps = state => {
  return { auth: state.firebase.auth, profile: state.firebase.profile }
}

export default connect(mapStateToProps)(App);
