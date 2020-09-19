import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
            
            <div class="col-md-6 mx-auto">
                <br></br>
                <h1 class="text-center">Page Login</h1>
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

                    <button class="btn btn-primary" onClick={this.login}>Login</button>
                

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