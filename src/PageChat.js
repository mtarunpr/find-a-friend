import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {firebaseConnect, isLoaded, isEmpty, populate} from 'react-redux-firebase'
import {compose} from 'redux'
import {connect} from 'react-redux'

class PageChat extends React.Component {
    constructor(props) {
        super(props);
       // console.log(this.props.cards[0].front);
        this.state = {
          message_send: '',
          open: false 
        };


    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    handleChange = event => this.setState({[event.target.name]: event.target.value});

    sendMessage = () => {

      console.log("sending message " + this.props.isLoggedIn);
      const updates = {};
      const newMessage = {
        sender_id: this.props.isLoggedIn,
        message: this.state.message_send
      }
      this.props.chat.messages.push(newMessage);
      // console.log(this.props.chat.messages);


      updates[`/chats/${this.props.chatId}/messages`] = this.props.chat.messages;
      // const onComplete = () => alert("sent"); //this.props.history.push(`/chats/${chatId}`);
      this.props.firebase.update(`/`, updates);
      this.state.message_send = '';
    }


    leaveChat = () => {
        const chatId = this.props.chatId;
        console.log("leaving " + this.props.chatId);
        const updates = {};

        
        
        updates[`/users/${this.props.chat.sender1}/chat`] = [];
        updates[`/users/${this.props.chat.sender2}/chat`] = [];
        updates[`/chats/${this.props.chatId}`] = {};
        const onComplete = () => this.props.history.push(`/`);
        this.props.firebase.update(`/`, updates, onComplete);

      
    }

    render () {
        // console.log(this.props)
        if(!isLoaded(this.props.chat)) {
            return <div>Loading...</div>
        } 
        if(isEmpty(this.props.chat)) {
            return <div>Page not found!</div>
        }

        const messages = this.props.chat.messages.map((message, index) =>{
          if (message.sender_id == this.props.isLoggedIn){
            return (
              <tr>
                <td></td><td></td><td class="user-one">{message.message}</td><td>{message.sender_id}</td>
              </tr>
            )
          }
          else{
            return (
              <tr>
                <td>{message.sender_id}</td><td class="user-two">{message.message}</td><td></td><td></td>
              </tr>
            )
          }
        });

        return (
          <div class="center">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="./">Find a Friend</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="./profile">Profile</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/login" onClick={() => {this.props.firebase.logout()}}>Sign Out</a>
                </li>
              </ul>
            </div>
          </nav>
            <div class="jumbotron-chat jumbotron jumbotron-fluid">
              <div class="container">
                <br></br>
                <h1>Chat</h1>
                <p>If you both reveal, you'll be able to see each other's profile.</p>
              </div>
            </div>
            <div class="container chat">
                <br></br>
                <div class="row align-items-center">
                  <table>
                    {messages}
                  </table>
                </div>
                <div class="row text-center">
                  <div class="col-10">
                      <textarea 
                          class="form-control"
                          name="message_send"
                          onChange={this.handleChange}
                          placeholder="Send message"
                          value={this.state.message_send}
                      />
                  </div>
                  <div class="col-2">
                    <button
                        class="btn btn-primary send-chat"
                        onClick={this.sendMessage}
                        disabled={!this.state.message_send}
                      >
                      Send
                    </button>
                  </div>
                </div>
                <br></br>
            </div>
            <br></br>
            <br></br>

            <button
              class="btn btn-primary"
              onClick={this.leaveChat}
            >
              Leave Chat
            </button>
          </div>
        );
    }
}

const populates = [
    { child: 'owner', root: 'users' } // replace owner with user object
  ]

const mapStateToProps = (state, props) => {

    console.log(state);
    const chatId = props.match.params.chatId;
    const chat = state.firebase.data[chatId];
    // const messages = chat && chat.messages;
    // console.log(messages)

    const res = populate(state.firebase, chatId, populates);
    console.log(res);
    return {chat: chat, chatId: chatId, isLoggedIn: state.firebase.auth.uid, res:res};
}

export default compose(
    withRouter,
    firebaseConnect(props =>{
        // console.log('props',props);
        const chatId = props.match.params.chatId;
        console.log(chatId);
        //const res = populate(props.firebase, deckId, populates)
        return [{path: `/chats/${chatId}`, storeAs: chatId}];
    }),
    connect(mapStateToProps),
 )(PageChat);