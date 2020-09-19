import React from 'react';
import { Link } from 'react-router-dom';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './index.css';

class PageHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: ''
    }
  }

  render() {
    return (
      <div class="center">
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
              <Link class="btn btn-primary" to="/chat">Let's Chat!</Link>
            </div>
          </div>
        </div>
        <h2 style = {{ marginTop: '20px'}}>Account</h2>
          {this.props.isLoggedIn ? (
            <div>
              <div>{this.props.email}</div>
              <Link to="/profile">Profile</Link>
              <br />
              <button onClick= {() => this.props.firebase.logout()}>Log out</button>
            
            </div>
          ) : (
            <div>
              <Link to="/register">Register</Link>
              <br />
              <Link to="/login">Login</Link>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { 
    email: state.firebase.auth.email,
    isLoggedIn: state.firebase.auth.uid }
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)((PageHome))