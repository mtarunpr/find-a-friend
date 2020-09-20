import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import {firebaseConnect, isLoaded, isEmpty, populate} from 'react-redux-firebase'
import {compose} from 'redux'
import {connect} from 'react-redux'
import './index.css';

class PageHome extends React.Component {
  constructor(props) {
      super(props);
     // console.log(this.props.cards[0].front);
      this.state = {
        message_send: ''
      };

  }

  openChat = () => {
      const id = this.props.isLoggedIn;
      const profiles = this.props.profiles;
      const user = profiles[id];
      console.log(user)
      const chat = user.chat;
      if(!chat){
        console.log('no chat')
        this.createChat()
        //create new chat
      } else{
        console.log('exisiting chat')
        const chatId = chat.chatId;
        this.props.history.push(`/chat/${chatId}`);

      }      
  }

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
      const rand = (Math.random() * (keys.length))|0;
      id2 = keys[rand];
      secondUser = profiles[id2];

      if(!secondUser.chat){
        break;
      }
    }
    const updates = {};

    //create new chat
    const chatId = this.props.firebase.push('/chats').key;

    //add deck
    updates[`/chats/${chatId}`] = {
      sender1:id,
      sender2:id2,
      messages: [{sender_id:'Bot', message:'Hello. Welcome to a new chat'}]
    };

    updates[`/users/${id}`] = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      chat: {
        user_id: id2,
        chatId: chatId
      }
    };

    updates[`/users/${id2}`] = {
      name: secondUser.name,
      email: secondUser.email,
      phone: secondUser.phone,
      chat: {
        user_id: id,
        chatId: chatId
      }
    };

    const onComplete = () => this.props.history.push(`/chat/${chatId}`);
    this.props.firebase.update(`/`, updates, onComplete);
  }


  createDeck = () => {

    console.log("creating deck");
    const updates = {};
    const deckId = this.props.firebase.push('/flashcards').key;
    const newDeck = {
        cards: this.state.cards,
        name: this.state.name,
        description: this.state.description,
        visibility: this.state.visibility,
        owner: this.props.isLoggedIn,
    };
    console.log(newDeck.owner);
    //add deck
    updates[`/flashcards/${deckId}`] = newDeck;
    //add link
    updates[`/homepage/${deckId}`] = {
        name: this.state.name,
        description: this.state.description,
        owner: this.props.isLoggedIn,
        visibility: this.state.visibility,

    };
    const onComplete = () => this.props.history.push(`/viewer/${deckId}`);
    this.props.firebase.update(`/`, updates, onComplete);
  }
   


  render () {
    if(!isLoaded(this.props.profiles)) {
      return <div>Loading...</div>
    }

    
    if(isEmpty(this.props.profiles)) {
        return <div>Page not found!</div>
    }
      return (
        <div class="center">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="./">Find a Friend</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                  <a class="nav-link" href="./profile">Profile</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/login" onClick={() => {this.props.firebase.logout()}}>Sign Out</a>
                </li>
              </ul>
            </div>
          </nav>
          <div class="jumbotron jumbotron-fluid">
            <div class="container">
              <h1>Find a Friend</h1>
              <p>Chat with an anonymous person from your school and reveal to make friends!</p>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-sm">
                <h3>Friends</h3>
                <hr></hr>
              </div>
              <div class="col-sm">
                <button class="btn btn-primary" onClick={this.openChat}>
                Let's Chat!
                </button>
                {/* <Link class="btn btn-primary" to="/chat">Let's Chat!</Link> */}
              </div>
            </div>
          </div>
          {/* <button class="btn btn-primary" onClick={() => {this.props.firebase.logout(); window.location.reload(true);}}>
                Logout
                </button> */}
        </div>
      );
  }
}

const populates = [
  { child: 'owner', root: 'users' } // replace owner with user object
]

const mapStateToProps = (state, props) => {

  const userId = state.firebase.auth.uid;
  const profiles = state.firebase.data;
  const profile = profiles[userId];
  
  // const username = profile && profile.username;

  console.log(profiles.users)
  // console.log(username)



  return {isLoggedIn: userId, profiles: profiles.users};
}


export default compose(
  withRouter,
  firebaseConnect(props =>{
      //console.log(id);
      return [{path:`/users/`, storeAs: 'users'}, ];
  }),
  connect(mapStateToProps),
)(PageHome);
