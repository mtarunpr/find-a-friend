import React from 'react';

class ProfileCardView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    }
  }

  render() {
    return (
      <div style={{ border: 'black' }}> 
        <div onClick={() => 
          this.setState({ selected: !this.state.selected }) 
        }>
          <i
            className={
              this.state.selected
                ? 'fa fa-chevron-down'
                : 'fa fa-chevron-right'
            }
          ></i>
          {this.props.profile.name}
        </div>
        {this.state.selected && (
          <div>
            <i 
              style={{ padding: 10, width: 30}} 
              class="fa fa-phone icon" 
            />
            {this.props.profile.phone}
            <br />
            <i 
              style={{ padding: 10, width: 30}} 
              class="fa fa-facebook icon" 
            />
            {this.props.profile.facebook}
            <br />
            <i 
              style={{ padding: 10, width: 30}} 
              class="fa fa-instagram icon" 
            />
            {this.props.profile.instagram}
          </div>
        )}
        <br />
      </div>
    );
  }
}

export default ProfileCardView;