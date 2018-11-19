import React, { Component } from 'react';
import axios  from 'axios';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavLink } from 'reactstrap';	
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import FontIcon from 'react-toolbox/lib/font_icon';

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
class NavDropdown extends Component {
  constructor(props) {
		super(props);
		this.state = {
      username: '',
      password: '',
      showPassword: false,
      isRemember: false
		};
  }

  stopDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleClickShowPassword = (e) => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleInputChange = (e) => {
		if (e.target.id === 'outlined-adornment-username') {
			this.setState({ username: e.target.value });
		} else if (e.target.id === 'outlined-adornment-password') {
      this.setState({ password: e.target.value });
    }
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('username', this.state.username);
    params.append('password', this.state.password);
    
    axios.post(SERVER_ADDRESS+'/users/login', params)
    .then((response) => {
      
      this.handleSnackbarMessage(response.data.message);
      this.handleSnackbarOpen();
      this.props.handleLogIn(response.data.username, 
                              response.data.roles, 
                              response.data.id,
                              response.data.jwt);
    })
    .catch((error) => {
      console.log(error.response);
      if(error.response) {
        this.handleSnackbarMessage(error.response.data.message);
        this.handleSnackbarOpen();
      }
    });
  }

  handleSnackbarMessage = (message) => {
    this.setState({
      snackbarMessage: message
    });
  };

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

  toggleRemember = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(state => ({isRemember: !state.isRemember }));
  }
  
  render() {
    // Dropdown name
    let tDropdown = "Sign In";

		// Navbar is user is not logged in
		let tMenu = <DropdownMenu className="App-dropdown" right>
                  <TextField
                    id="outlined-adornment-username"
                    className="navbar-input"
                    variant="outlined"
                    label="username"
                    value={this.state.username}
                    onClick={this.stopDefault}
                    onChange={this.handleInputChange}
                  />
                  <TextField
                    id="outlined-adornment-password"
                    className="navbar-input"
                    variant="outlined"
                    type={this.state.showPassword ? 'text' : 'password'}
                    label="password"
                    value={this.state.password}
                    onClick={this.stopDefault}
                    onChange={this.handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            className="show-password-btn"
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <DropdownItem id="login-submit">
                    <Checkbox
                      id="remember-user-checkbox" 
                      checked={this.state.isRemember}
                      label="Remember me"
                      onClick={this.toggleRemember}
                    />
                    <Button onClick={this.handleLoginSubmit} variant="contained" color="primary" id="login-btn">
                      Login
                    </Button>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => this.props.registerPage()}>
                    <Button variant="contained" id="register-btn">
                      Register
                    </Button>
                  </DropdownItem>
                </DropdownMenu>;
                      
		if(this.props.loggedIn) {
      tDropdown = this.props.username;
			tMenu=  <DropdownMenu className="App-dropdown" right>
                <DropdownItem>
                  <NavLink onClick={() => this.props.history.push('/profile')}>
                    Profile
                  </NavLink>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem on>
                  <NavLink onClick={this.props.handleLogOut}>
                    Logout
                  </NavLink>
                </DropdownItem>
              </DropdownMenu>;
		}

    return (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>
          <FontIcon id="nav-dropdown-icon" value='account_circle' />
          <p id="nav-dropdown-text">{tDropdown}</p>
        </DropdownToggle>
        {tMenu}
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
      </UncontrolledDropdown>
    );
  }
}

export default NavDropdown;