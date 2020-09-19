import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

class PageHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: '',
    }
  }

  render() {
    return (
      <div style={{ margin: '10px'}}>
        <h2>Home</h2>
        <span>Hello, world! This is our find-a-friend application.</span>
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