import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect, Link } from 'react-router-dom';

class PageRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      phone: ''
    };
  }

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value, erroar: '' });

  register = async () => {
    const credentials = {
      email: this.state.email,
      password: this.state.password,
    };

    const profile = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      chat: {}
    };

    try {
      await this.props.firebase.createUser(credentials, profile);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    if (this.props.isLoggedIn) {
      this.props.firebase.logout();
    }

    return (
      
        <div class="col-md-6 mx-auto">
        <br></br>
        <h1 class="text-center">Page Register</h1>
        <br></br>
            <div>{this.state.error}</div>
            
            <div class="form-group">
                <input
                    class="form-control"
                    name="name"
                    onChange={this.handleChange}
                    placeholder="Name"
                    value={this.state.name}
                />
            </div>
            <div class="form-group">
                <input
                    name="email"
                    class="form-control"
                    onChange={this.handleChange}
                    placeholder="Email"
                    value={this.state.email}
                />
            </div>
            <div class="form-group">
                <input
                    name="phone"
                    class="form-control"
                    onChange={this.handleChange}
                    placeholder="Phone"
                    value={this.state.phone}
                />
            </div>
            <div class="form-group">
                <input
                    name="password"
                    type="password"
                    class="form-control"
                    onChange={this.handleChange}
                    placeholder="Password"
                    value={this.state.password}
                />
            </div>

            <button class="btn btn-primary" disabled={!this.state.name} onClick={this.register}>Register</button>
        

    </div>
    );
  }
}

const mapStateToProps = state => {
  return { isLoggedIn: state.firebase.auth.uid };
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(PageRegister);
