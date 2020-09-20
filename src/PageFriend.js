import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';

class PageFriend extends React.Component {
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

  checkChanged = () => {
    const { profile } = this.props;

    const needCheck = ['name', 'phone', 'facebook', 'instagram'];

    let same = needCheck.every(input => this.state[input] === profile[input]);

    return same;
  };

  render() {
    if (!this.props.isLoggedIn) {
      return <Redirect to="/register" />;
    }
    const { name = '', phone = '', facebook = '', instagram = '' } = this.state;

    var changed = !this.checkChanged();

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="./">
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
              <li className="nav-item active">
                <a className="nav-link" href="./profile">
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
        <h2>Hello</h2>
        <hr />
        <br />
        <Link to="/">Home</Link>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const profile = state.firebase.data;
  console.log(profile);
  return { profile: profile, isLoggedIn: state.firebase.auth.uid };
};

export default compose(
  withRouter,
  firebaseConnect(props => {
    //console.log(id);
    const userId = props.match.params.userId;
    return [{ path: `/users/${userId}`, storeAs: 'user' }];
  }),
  connect(mapStateToProps),
)(PageFriend);
