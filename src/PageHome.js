import React from 'react';
import {Link} from 'react-router-dom';
import './index.css';

function PageHome() {
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
    </div>
  );
}

export default PageHome;