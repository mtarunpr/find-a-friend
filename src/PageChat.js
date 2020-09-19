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
          message_send: ''
        };

    }

    handleChange = event => this.setState({[event.target.name]: event.target.value});

    sendMessage = () => {

      console.log("sending message " + this.props.isLoggedIn);
      const updates = {};
      const newMessage = {
        sender_id: this.props.isLoggedIn,
        message: this.state.message_send
      }
      this.props.messages.push(newMessage);

      updates[`/chats/${this.props.chatId}`] = this.props.messages;
      //const onComplete = () => alert("sent"); //this.props.history.push(`/chats/${chatId}`);
      this.props.firebase.update(`/`, updates);
      this.state.message_send = '';
    }

    render () {
        // console.log(this.props)
        if(!isLoaded(this.props.messages)) {
            return <div>Loading...</div>
        } 
        if(isEmpty(this.props.messages)) {
            return <div>Page not found!</div>
        }
        let users = [];
        const messages = this.props.messages.map((message, index) =>{
          if (!users.includes(message.sender_id)){
            users.push(message.sender_id);
          }
          if (message.sender_id == users[0]){
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
    const messages = state.firebase.data[chatId];
    console.log(messages)

    const res = populate(state.firebase, chatId, populates);
    console.log(res);
    return {messages: messages, chatId: chatId, isLoggedIn: state.firebase.auth.uid, res:res};
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
