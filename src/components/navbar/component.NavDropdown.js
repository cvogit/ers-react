import React, { Component } from 'react';
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

  changeInput = (e) => {
    if(e.target.id === "outlined-adornment-username") {
      this.setState({
        username: e.target.value
      });
    } else if(e.target.id === "outlined-adornment-password") {
      this.setState({
        password: e.target.value
      });
    }
  }

  handleClickShowPassword = (e) => {
    this.setState(state => ({ showPassword: !state.showPassword }));
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
                  <DropdownItem>
                    <TextField
                      id="outlined-adornment-username"
                      className="navbar-input"
                      variant="outlined"
                      label="username"
                      value={this.state.username}
                      onClick={this.stopDefault}
                      onChange={this.changeInput}
                    />
                  </DropdownItem>
                  <DropdownItem>
                    <TextField
                      id="outlined-adornment-password"
                      className="navbar-input"
                      variant="outlined"
                      type={this.state.showPassword ? 'text' : 'password'}
                      label="password"
                      value={this.state.password}
                      onClick={this.stopDefault}
                      onChange={this.changeInput}
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
                  </DropdownItem>
                  <DropdownItem id="login-submit">
                    <Checkbox
                      id="remember-user-checkbox" 
                      checked={this.state.isRemember}
                      label="Remember me"
                      onClick={this.toggleRemember}
                    />
                    <Button variant="contained" color="primary" id="login-btn">
                      Login
                    </Button>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => this.props.history.push('/register')}>
                    <Button variant="contained" id="register-btn">
                      Register
                    </Button>
                  </DropdownItem>
                </DropdownMenu>;
                      
		if(this.props.loggedIn) {
      tDropdown = this.props.username;
			tMenu=  <DropdownMenu className="App-dropdown" right>
                <DropdownItem>
                  <NavLink onClick={() => this.props.history.push('/dashboard')}>
                    Dashboard
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
          {tDropdown}
        </DropdownToggle>
        {tMenu}
      </UncontrolledDropdown>
    );
  }
}

export default NavDropdown;