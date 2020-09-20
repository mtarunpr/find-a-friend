import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

class PageProfile extends React.Component {
  constructor(props) {
    super(props);

    const {
      name = '',
      phone = '',
      facebook = '',
      instagram = '',
    } = props.profile;

    this.state = {
      name,
      phone,
      facebook,
      instagram,
    };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  update = async () => {
    const profile = {
      ...this.state
    }
    
    try {
      await this.props.firebase.updateProfile(profile);
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  goToProfile = ({url, username}) => (
    <a href={`${url}${username}`} rel="noopener noreferrer" target="_blank" className="btn btn-light profile">
      Test It
    </a>
  );

  checkChanged= () => {
    const { profile } = this.props;

    const needCheck = [
      'name',
      'phone',
      'facebook',
      'instagram'
    ]

    let same = needCheck.every(input => this.state[input] === profile[input]);

    return same;
  }

  render() {
    if (!this.props.isLoggedIn) {
      return <Redirect to="/login" />
    }
    const {
      name = '',
      phone = '',
      facebook = '',
      instagram = ''
    } = this.state;

    var changed = !this.checkChanged();

    return (
      <div className="center">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="../">Find a Friend</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="./profile">Profile</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login" onClick={() => {this.props.firebase.logout()}}>Sign Out</a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h1>Profile</h1>
            </div>
          </div>
        {this.state.error}
        <br />
        Email: {this.props.email}
        <br />
        <br></br>
        <i 
          style={{ padding: 10, width: 30 }} 
          className="fa fa-user icon" />
        <input 
          autoComplete='off'
          name='name'
          onChange={this.handleInputChange}
          placeholder='Your name'
          type='text'
          value={name}
        />
        <br />
        <i 
          style={{ padding: 10, width: 30 }} 
          className="fa fa-phone icon" />
        <input 
          autoComplete='off'
          name='phone'
          onChange={this.handleInputChange}
          placeholder='Your Phone number'
          type='tel'
          value={phone}
        />
        <br />
        <br />
        Make online connections with your friends! <br></br>
        These links will be available to only the people 
        you match with.
        <br />
        <br></br>
        <i 
          style={{ padding: 10, width: 30 }} 
          className="fa fa-instagram icon" />
        <input 
          autoComplete='off'
          name='instagram'
          onChange={this.handleInputChange}
          placeholder='Instagram'
          type='text'
          value={instagram}
        />
        <this.goToProfile
          url="https://www.instagram.com/"
          username={instagram}
        />
        <br />
        <i 
          style={{ padding: 10, width: 30}} 
          className="fa fa-facebook icon" />
        <input 
          autoComplete='off'
          name='facebook'
          onChange={this.handleInputChange}
          placeholder='Facebook'
          type='text'
          value={facebook}
        />
        <this.goToProfile
          url="https://www.facebook.com/"
          username={facebook}
        />
        <br />
        <br></br>
        <button className="btn btn-dark update-profile"
          onClick={this.update}
          disabled={this.state.name.trim() === ''}
        >
          Update profile!
        </button>
        {changed && (
            <div style={{ color: 'red'}}>You have unsaved changes.</div>
        )}
        <br />
        <br></br>
        <br></br>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { 
    isLoggedIn: state.firebase.auth.uid,
    email: state.firebase.profile.email,
    profile: state.firebase.profile,
   }
}

export default compose(
  firebaseConnect(), 
  connect(mapStateToProps),
)(PageProfile);