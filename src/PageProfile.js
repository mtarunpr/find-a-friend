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
    <a href={`${url}${username}`} rel="noopener noreferrer" target="_blank">
      Test it out
    </a>
  );

  render() {
    if (!this.props.isLoggedIn) {
      return <Redirect to="/register" />
    }
    const {
      name = '',
      phone = '',
      facebook = '',
      instagram = ''
    } = this.state;

    return (
      <div>
        <h2>Profile</h2>
        {this.state.error}
        <br />
        Email: {this.props.email}
        <br />
        <i 
          style={{ padding: 10, width: 30 }} 
          class="fa fa-user icon" />
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
          class="fa fa-phone icon" />
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
        Make online connections with your match! 
        (These links will be available to only the people 
        you match with)
        <br />
        <i 
          style={{ padding: 10, width: 30 }} 
          class="fa fa-instagram icon" />
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
          class="fa fa-facebook icon" />
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
          username={instagram}
        />
        <br />
        <button
          onClick={this.update}
          disabled={this.state.name.trim() === ''}
        >
          Update profile!
        </button>
        <hr />
        <br />
        <Link to="/">Home</Link>
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