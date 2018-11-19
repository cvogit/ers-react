import React, { Component } from 'react';
import '../css/App.css';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import {HashRouter} from 'react-router-dom'

import Snackbar from '@material-ui/core/Snackbar';
import axios  from 'axios';

import AppNav from './navbar/component.AppNav';
import Dashboard from './page.Dashboard';
import Home from './page.Home';
import Register from './page.Register';

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
      loggedIn: false,
      username: "",
      id: "",
      role: "",
      snackbarOpen: false,
      snackbarMessage: 'snackbar', 
      page: ''
		};
  }

  componentDidMount() {

    if( !this.state.loggedIn ) {
			// If JWT is in localstorage, use it to refresh token
			if( localStorage.getItem('JWT') ) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('JWT');
        
        axios.post(SERVER_ADDRESS+'/users/refresh')
        .then((response) => {
        this.handleLogIn(response.data.username, 
                response.data.roles, 
                response.data.id,
                response.data.jwt);
        })
        .catch((error) => {
          console.log(error.response);
          localStorage.removeItem('JWT');
        });
      }
    }
  }

  handleRegisterPage = () => {
    this.setState({
      page: 'register'
    });
  }

  handleLogIn = (pUsername, pRole, pId, pJwt) => {
    let tRoleArray;
    if(pRole === "1")
      tRoleArray = "employee ";
    else if(pRole === "2")
      tRoleArray = "employee manager";

    this.setState({
      loggedIn: true,
      username: pUsername,
      id: parseInt(pId),
      role: tRoleArray
    })
    localStorage.setItem('JWT', pJwt);
  }
  
  handleLogOut = () => {
    this.setState({
      loggedIn: false,
      page: ''
    });
    localStorage.removeItem('JWT');
  }

  render() {
    return (
      <div className="App">
        <HashRouter>
          <>  
            <AppNav {...this.state} handleLogOut={this.handleLogOut} registerPage={this.handleRegisterPage} handleLogIn={this.handleLogIn}/>
            <Switch>
              <Route path='/'
                render={() => <Dashboard {...this.state} 
              />} />
            </Switch>
          </>
        </HashRouter>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={this.handleClose}
          autoHideDuration={6000}
          open={this.state.snackbarOpen}
          message={<span id="snackbar-message">{this.state.snackbarMessage}</span>}
        />
      </div>
    );
  }
}

export default App;