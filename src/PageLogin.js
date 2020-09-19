import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import 'firebase/database';
class PageLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    }

    login = async () => {
        const credentials = {
            email: this.state.email,
            password: this.state.password,
        };

        try{
            await this.props.firebase.login(credentials);
        } catch(error) {
            this.setState({error: error.message});
        }
    }
    render () {
        if (this.props.isLoggedIn) {
          this.props.firebase.logout();
        }
        return (
        <div class="center">
            <div class="jumbotron jumbotron-fluid">
              <div class="container">
                <h1>Find a Friend</h1>
                <p>Chat with an anonymous person from your school and reveal to make friends!</p>
              </div>
            </div>
            <div class="col-md-6 mx-auto">
                <br></br>
                <h3 class="text-center">Login</h3>
                <br></br>
                <div>{this.state.error}</div>
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
                            name="password"
                            type="password"
                            class="form-control"
                            onChange={this.handleChange}
                            placeholder="Password"
                            value={this.state.password}
                        />
                    </div>
                    <br></br>
                    <button class="btn btn-primary" onClick={this.login}>Login</button>
                    <br></br><br></br>
                    <p>Don't have an account? <Link to="/register">Register.</Link></p>
            </div>
        </div>
        )
    }
}

const mapStateToProps = state => {
    return {isLoggedIn: state.firebase.auth.uid};
}

export default compose(
    firebaseConnect(),
    connect(mapStateToProps),
)
(PageLogin);