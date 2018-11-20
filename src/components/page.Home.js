import React, { Component } from 'react';
import About from './home/page.About';
import Growths from './home/page.Growths';
import Partners from './home/page.Partners';

class Home extends Component {
  render() {
    return (
      <div id="home-container">
        <h1 id="home-main-text">
          Welcome!
        </h1>
        <h2 id="home-sub-text">
          Revature Reimbursement System
        </h2>
      </div>
    );
  }
}

export default Home;