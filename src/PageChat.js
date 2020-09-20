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

class PageChat extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props.cards[0].front);
    this.state = {
      message_send: '',
      open: false,
      reveal: 'Reveal',
    };
  }

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });
  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  sendMessage = () => {
    if (this.state.message_send !== '') {
      console.log('sending message ' + this.props.isLoggedIn);
      const updates = {};
      const newMessage = {
        sender_id: this.props.isLoggedIn,
        message: this.state.message_send,
      };
      this.props.chat.messages.push(newMessage);
      // console.log(this.props.chat.messages);

      updates[
        `/chats/${this.props.chatId}/messages`
      ] = this.props.chat.messages;
      // const onComplete = () => alert("sent"); //this.props.history.push(`/chats/${chatId}`);
      this.props.firebase.update(`/`, updates);
      this.setState({ message_send: '' });
    }
  };

  leaveChat = () => {
    const chatId = this.props.chatId;
    const chat = this.props.chat;
    console.log('leaving ' + this.props.chatId);

    const updates = {};

    //check is both revealed
    const revealed = chat.reveal1 && chat.reveal2;
    if (revealed) {
      alert(
        'You both chose to reveal your identities! Find out who they are in your home page.',
      );

      // Add friends if this user is the first to leave
      if (this.props.chat.sender1 && this.props.chat.sender2) {
        updates[
          `/users/${this.props.chat.sender1}/friends/${this.props.chat.sender2}`
        ] = {
          id: this.props.chat.sender2,
        };

        updates[
          `/users/${this.props.chat.sender2}/friends/${this.props.chat.sender1}`
        ] = {
          id: this.props.chat.sender1,
        };
      }
    }

    // If other user has already left, clear out chat
    if (!this.props.chat.sender1 || !this.props.chat.sender2) {
      updates[`/chats/${this.props.chatId}`] = {};
    } else {
      // Otherwise only clear out this user's sender id
      if (this.props.chat.sender1 === this.props.isLoggedIn) {
        updates[`/chats/${this.props.chatId}/sender1`] = {};
      } else if (this.props.chat.sender2 === this.props.isLoggedIn) {
        updates[`/chats/${this.props.chatId}/sender2`] = {};
      }

      // Notify other user of the leaving
      const newMessage = {
        sender_id: 'Bot',
        message: 'Your anonymous friend has left the chat!',
      };
      this.props.chat.messages.push(newMessage);
      updates[
        `/chats/${this.props.chatId}/messages`
      ] = this.props.chat.messages;
    }

    updates[`/users/${this.props.isLoggedIn}/chat`] = [];

    const onComplete = () => this.props.history.push(`/`);
    this.props.firebase.update(`/`, updates, onComplete);
  };

  report = () => {
    const reportId = this.props.firebase.push('/reports').key;
    const updates = {};
    updates[reportId] = {
      ...this.props.chat,
      reporter_id: this.props.isLoggedIn,
    };

    this.props.firebase.update(`/reports`, updates);

    alert('This user has been reported. Please feel free to leave the chat.');
  };

  reveal = () => {
    const sender1 = this.props.chat.sender1;
    const sender2 = this.props.chat.sender2;

    const updates = {};
    if (this.state.reveal === 'Reveal') {
      if (this.props.isLoggedIn === sender1) {
        updates[`/chats/${this.props.chatId}/reveal1`] = true;
      } else {
        updates[`/chats/${this.props.chatId}/reveal2`] = true;
      }
      this.setState({ reveal: 'Conceal' });
    } else {
      if (this.props.isLoggedIn === sender1) {
        updates[`/chats/${this.props.chatId}/reveal1`] = false;
      } else {
        updates[`/chats/${this.props.chatId}/reveal2`] = false;
      }

      this.setState({ reveal: 'Reveal' });
    }
    // const onComplete = () => this.props.history.push(`/`);
    this.props.firebase.update(`/`, updates);
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    console.log(this.props);
    if (!isLoaded(this.props.chat)) {
      return <div>Loading...</div>;
    }

    if (!this.props.isLoggedIn) {
      return <Redirect to="/login" />;
    }

    if (isEmpty(this.props.chat)) {
      return <div>Page not found!</div>;
    }

    const messages = this.props.chat.messages.map((message, index) => {
      let avatar =
        'https://api.adorable.io/avatars/60/' +
        message.sender_id +
        '@adorable.io.png';
      if (message.sender_id === this.props.isLoggedIn) {
        return (
          <tr key={index}>
            <td></td>
            <td></td>
            <td className="user-one">{message.message}</td>
            <td className="propic-one">
              <img alt="User one" src={avatar}></img>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={index}>
            <td className="propic-two">
              <img alt="User two" src={avatar}></img>
            </td>
            <td className="user-two">{message.message}</td>
            <td></td>
            <td></td>
          </tr>
        );
      }
    });

    return (
      <div className="center">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="../">
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
                <a className="nav-link" href="../profile">
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
        <div className="jumbotron-chat jumbotron jumbotron-fluid">
          <div className="container">
            <br></br>
            <h1>Chat</h1>
            <p>
              If you both reveal, you'll be able to see each other's profile.
            </p>
          </div>
        </div>
        <div className="container chat">
          <br></br>
          <div className="row align-items-center">
            <table>
              <colgroup>
                <col className="pic" />
                <col className="message" />
                <col className="message" />
                <col className="pic" />
              </colgroup>
              <tbody>{messages}</tbody>
            </table>
          </div>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.messagesEnd = el;
            }}
          ></div>
        </div>
        <br></br>
        <div className="container">
          <div className="row text-center">
            <div className="col-10">
              <textarea
                className="form-control"
                name="message_send"
                onChange={this.handleChange}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    this.sendMessage();
                  }
                }}
                placeholder="Send message"
                value={this.state.message_send}
              />
            </div>
            <div className="col-2">
              <button
                className="btn btn-primary send-chat"
                onClick={this.sendMessage}
                disabled={!this.state.message_send}
              >
                Send
              </button>
            </div>
          </div>
          {/* Set up a confirmation before leaving the chat */}
          <button className="btn btn-primary leave" onClick={this.leaveChat}>
            Leave Chat
          </button>
          <button className="btn btn-danger report" onClick={this.report}>
            Report
          </button>
          <button className="btn btn-primary reveal" onClick={this.reveal}>
            {this.state.reveal}
          </button>
          <br></br>
          <br></br>
        </div>
      </div>
    );
  }
}

const populates = [
  { child: 'owner', root: 'users' }, // replace owner with user object
];

const mapStateToProps = (state, props) => {
  console.log(state);
  const chatId = props.match.params.chatId;
  const chat = state.firebase.data[chatId];
  // const messages = chat && chat.messages;
  // console.log(messages)

  const res = populate(state.firebase, chatId, populates);
  console.log(res);
  return {
    chat: chat,
    chatId: chatId,
    isLoggedIn: state.firebase.auth.uid,
    res: res,
  };
};

export default compose(
  withRouter,
  firebaseConnect(props => {
    // console.log('props',props);
    const chatId = props.match.params.chatId;
    console.log(chatId);
    //const res = populate(props.firebase, deckId, populates)
    return [{ path: `/chats/${chatId}`, storeAs: chatId }];
  }),
  connect(mapStateToProps),
)(PageChat);
