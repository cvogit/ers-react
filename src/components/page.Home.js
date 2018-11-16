import React, { Component } from 'react';
import About from './home/page.About';
import Growths from './home/page.Growths';
import Partners from './home/page.Partners';

class Home extends Component {
  render() {
    return (
      <>
        <About />
        <Growths />
        <Partners />
      </>
    );
  }
}

export default Home;