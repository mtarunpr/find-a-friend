import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  populate,
} from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './index.css';
import ProfileCardView from './ProfileCardView.js';

class PageHome extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props.cards[0].front);
    this.state = {
      message_send: '',
    };
  }

  openChat = () => {
    const id = this.props.isLoggedIn;
    const profiles = this.props.profiles;
    const user = profiles[id];
    console.log(user);
    const chat = user.chat;
    if (!chat) {
      console.log('no chat');
      this.createChat();
      //create new chat
    } else {
      console.log('existing chat');
      const chatId = chat.chatId;
      const updates = {};
      updates[`joined_chat`] = true;

      const onComplete = () => this.props.history.push(`/chat/${chatId}`);
      this.props.firebase.update(`/users/${id}/chat`, updates, onComplete);
    }
  };

  createChat = () => {
    const id = this.props.isLoggedIn;
    const profiles = this.props.profiles;
    const user = profiles[id];

    //keys of userId
    const keys = Object.keys(profiles);

    // print all keys
    console.log(keys);

    // iterate over object
    //loop through to find another user without a chat
    var secondUser;
    var id2;
    for (var i = 0; i < keys.length * 4; i++) {
      const rand = (Math.random() * keys.length) | 0;
      id2 = keys[rand];
      secondUser = profiles[id2];

      if (!secondUser.chat && id2 !== id) {
        break;
      }
    }
    if (secondUser.chat || id2 === id) {
      alert(
        'Sorry, there are no available matches at the moment. Please wait a hot sec',
      );
      return;
    }
    const updates = {};

    //create new chat
    const chatId = this.props.firebase.push('/chats').key;

    //add deck
    updates[`/chats/${chatId}`] = {
      sender1: id,
      sender2: id2,
      messages: [{ sender_id: 'Bot', message: 'Hello. Welcome to a new chat' }],
    };

    updates[`/users/${id}/chat`] = {
      user_id: id2,
      chatId: chatId,
    };

    updates[`/users/${id2}/chat`] = {
      user_id: id,
      chatId: chatId,
      joined_chat: false
    };

    const onComplete = () => this.props.history.push(`/chat/${chatId}`);
    this.props.firebase.update(`/`, updates, onComplete);
  };

  render() {
    if (!isLoaded(this.props.profiles)) {
      return <div>Loading...</div>;
    }

    if (!this.props.isLoggedIn) {
      return <Redirect to="/login" />;
    }

    if (isEmpty(this.props.profiles)) {
      return <div>Page not found!</div>;
    }

    const user = this.props.profiles[this.props.isLoggedIn];

    var friends;
    if (user.friends !== undefined) {
      const profiles = this.props.profiles;
      friends = Object.keys(user.friends).map(function (keyName, keyIndex) {
        console.log(profiles);
        const profile = profiles[keyName];
        const path = `/profile/${keyName}`;
        return <ProfileCardView key={keyName} profile={profile} />;
      });
    }

    return (
      <div className="center">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="./">
            Find a Friend
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="./profile">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/login"
                  onClick={() => {
                    this.props.firebase.logout();
                  }}
                >
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1>Find a Friend</h1>
            <p>
              Chat with an anonymous person from your school and reveal to make
              friends!
            </p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm">
              <h3>Friends</h3>
              <hr></hr>
              {friends}
            </div>
            <div className="col-sm">
              {console.log('Chat', this.props.chat)}
              {(this.props.chat && this.props.chat.joined_chat) ? (
                <button className="btn btn-success" onClick={this.openChat}>
                  Continue chatting
                </button>
              ) : (
                <button className="btn btn-primary" onClick={this.openChat}>
                  Create new chat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const userId = state.firebase.auth.uid;
  const profiles = state.firebase.data;
  const chat = state.firebase.profile.chat;
  console.log(profiles.users);
  return { isLoggedIn: userId, profiles: profiles.users, chat };
};

export default compose(
  withRouter,
  firebaseConnect(props => {
    //console.log(id);
    return [{ path: `/users/`, storeAs: 'users' }];
  }),
  connect(mapStateToProps),
)(PageHome);
