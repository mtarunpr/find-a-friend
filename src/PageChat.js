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
      const onComplete = () => alert("sent");//this.props.history.push(`/chats/${chatId}`);
      this.props.firebase.update(`/`, updates, onComplete);
      
  }
    render () {
        console.log(this.props)
        if(!isLoaded(this.props.messages)) {
            return <div>Loading...</div>
        }

        
        if(isEmpty(this.props.messages)) {
            return <div>Page not found!</div>
        }

        const messages = this.props.messages.map((message, index) =>{
          return (
              <tr>
                  <td>{message.sender_id}  {message.message}</td>
              </tr>
            )
        });
        
        const getCard = () => {

            //console.log(this.state.index);
            const card = this.props.cards[this.state.index];
            if (this.state.front) {
                return (<p>{card.front}</p>);
            } else {
                return (<p>{card.back}</p>);
            }
        }
        return (
            <div class="container">
                <br></br>

                <div class="row align-items-center">
                  <table>
                    {messages}
                  </table>
                    
                </div>
                <div class="row text-center">
                  Message
                  <div class="col-m-9">
                      <textarea 
                          class="form-control"
                          name="message_send"
                          onChange={this.handleChange}
                          placeholder="Send message"
                          value={this.state.message_send}
                      />
                  </div>
                  <div class="col-m-3">
                    <button
                        class="btn btn-light"
                        onClick={this.sendMessage}
                        disabled={!this.state.message_send}
                      >
                      Send
                    </button>
                  </div>
                </div>
                
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


// export default compose(
//     withRouter,
//     firebaseConnect(props =>{
//         // console.log('props',props);
//         const deckId = props.match.params.deckId;
//         return [{path: `/flashcards/${deckId}`, storeAs: deckId}];
//     }),
//     connect(mapStateToProps),
//  )(CardViewer);

 //firebaseConnect([{path: '/flashcards/chemistry', storeAs:'deck1'}])(CardViewer);

