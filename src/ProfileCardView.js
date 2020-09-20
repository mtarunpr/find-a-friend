import React from 'react';

class ProfileCardView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  goToProfile = ({ url, username, classname }) => (
    <a
      href={`${url}${username}`}
      rel="noopener noreferrer"
      target="_blank"
      className={classname}
    >
      {username}
    </a>
  );

  render() {
    return (
      <div style={{ border: 'black' }}>
        <div onClick={() => this.setState({ selected: !this.state.selected })}>
          <i
            className={
              this.state.selected ? 'fa fa-chevron-down' : 'fa fa-chevron-right'
            }
            style={{ padding: 10, width: 30 }}
          ></i>
          {this.props.profile.name}
        </div>
        {this.state.selected && (
          <div>
            <i
              style={{ padding: 10, width: 30 }}
              className="fa fa-phone icon"
            />
            {this.props.profile.phone}
            <br />
            <i
              style={{ padding: 10, width: 30 }}
              className="fa fa-facebook icon"
            />
            <this.goToProfile
              url="https://www.facebook.com/"
              username={this.props.profile.facebook || 'n/a'}
              classname="btn btn-outline-primary btn-sm"
            />
            {/* {this.props.profile.facebook || 'n/a'} */}
            <br />
            <i
              style={{ padding: 10, width: 30 }}
              className="fa fa-instagram icon"
            />
            <this.goToProfile
              url="https://www.instagram.com/"
              username={this.props.profile.instagram || 'n/a'}
              classname="btn btn-outline-info btn-sm"
            />
          </div>
        )}
        <br />
      </div>
    );
  }
}

export default ProfileCardView;
