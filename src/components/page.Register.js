import React, { Component } from 'react';
import axios  from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
class Register extends Component {
  constructor(props) {
		super(props);
		this.state = {
      username: '',
      password: '',
      first_name 	: '',
      last_name 	: '',
			email 			: '',
			password 		: '',
      password_confirmation : '',
      snackbarOpen: false,
      snackbarMessage: ''
		};
  }

  handleSnackbarOpen = () => {
    this.setState({
      snackbarOpen: true 
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false 
    });
  };

  handleInputChange = (e) => {
		if (e.target.id === 'firstname-input') {
			this.setState({ first_name: e.target.value });
		} else if (e.target.id === 'lastname-input') {
			this.setState({ last_name: e.target.value });
		} else if (e.target.id === 'username-input') {
			this.setState({ username: e.target.value });
    } else if (e.target.id === 'email-input') {
			this.setState({ email: e.target.value });
    } else if (e.target.id === 'password-input') {
			this.setState({ password: e.target.value });
    } else if (e.target.id === 'password-confirmation') {
			this.setState({ password_confirmation: e.target.value });
    }
  }

  handleSnackbarMessage = (message) => {
    this.setState({
      snackbarMessage: message
    });
  };

  handleRegisterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(this.state);
    
    axios.post(SERVER_ADDRESS+'/users', params)
    .then((response) => {
      console.log(response);
      this.handleSnackbarMessage(response.data.message);
      this.handleSnackbarOpen();
    })
    .catch((error) => {
      console.log(error.response);
      if(error.response.data.message !== null) {
        this.handleSnackbarMessage(error.response.data.message);
        this.handleSnackbarOpen();
      }
      else {
        this.handleSnackbarMessage("Unable to handle request, please contact support.");
        this.handleSnackbarOpen();
      }
    });
  };

  render() {
    return (
      <div id="register-container" class="row">
        <div class="col-12 register-inputs-container">
          <h1 id="register-text">
            Register
          </h1>
          <TextField
            id="firstname-input"
            label="Firstname"
            className="navbar-dialog-input navbar-input-name-left"
            type="name"
            margin="normal"
            fullWidth
            onChange={this.handleInputChange}
          />
          <TextField
            id="lastname-input"
            label="Lastname"
            className="navbar-dialog-input navbar-input-name-right"
            type="name"
            margin="normal"
            fullWidth
            onChange={this.handleInputChange}
          />
          <TextField
            id="username-input"
            label="Username"
            className="navbar-dialog-input navbar-input-name-left"
            type="name"
            margin="normal"
            fullWidth
            onChange={this.handleInputChange}
          />
          <TextField
            id="email-input"
            label="Email"
            className="navbar-dialog-input navbar-input-name-right"
            type="email"
            margin="normal"
            fullWidth
            onChange={this.handleInputChange}
          />
          <TextField
            id="password-input"
            label="Password"
            className="navbar-dialog-input navbar-input-name-left"
            type="password"
            fullWidth
            margin="normal"
            onChange={this.handleInputChange} 
          />
          <TextField
            id="password-confirmation"
            label="Retype password"
            className="navbar-dialog-input navbar-input-name-right"
            type="password"
            fullWidth
            margin="normal"
            onChange={this.handleInputChange}
          />
        </div>
        <Button color="primary" className="register-submit-btn" onClick={this.handleRegisterSubmit}>Register</Button>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={5000}
          onClose={this.handleSnackbarClose}
          message={<h6 className="app-snackbar-message">{this.state.snackbarMessage}</h6>}
        />
      </div>
    );
  }
}

export default Register;