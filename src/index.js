import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import { createStore, combineReducers } from 'redux';
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
} from 'react-redux-firebase';
import { BrowserRouter } from 'react-router-dom';

import { composeWithDevTools } from 'redux-devtools-extension';

const firebaseConfig = {
  apiKey: 'AIzaSyAMe7PAK5Zn0XoYWt3okgY_hiRcRkFvZxo',
  authDomain: 'find-a-friend-hackmit.firebaseapp.com',
  databaseURL: 'https://find-a-friend-hackmit.firebaseio.com',
  projectId: 'find-a-friend-hackmit',
  storageBucket: 'find-a-friend-hackmit.appspot.com',
  messagingSenderId: '528000103219',
  appId: '1:528000103219:web:bf3c5dbc6c8fc9e2590446',
};

firebase.initializeApp(firebaseConfig);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  // firestore: firestoreReducer // <- needed if using firestore
});

// Create store with reducers and initial state
const store = createStore(rootReducer, composeWithDevTools());

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  // enableClaims: true // Get custom claims along with the profile
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  // createFirestoreInstance // <- needed if using firestore
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root'),
);
