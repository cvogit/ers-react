import React, { Component } from 'react';
import '../css/App.css';

import { BrowserRouter, Route, Switch } from "react-router-dom";

import AppNav from './navbar/component.AppNav';
import Dashboard from './page.Dashboard';
import Home from './page.Home';
import Register from './page.Register';

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
      loggedIn: true,
      username: "John"
		};
  }
  
  handleLogOut = () => {
    this.setState({
      loggedIn: false
    })
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <>  
            <AppNav {...this.state} handleLogOut={this.handleLogOut}/>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route path='/dashboard'
                render={(props) => <Dashboard {...props} 
              />} />
            </Switch>
          </>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;