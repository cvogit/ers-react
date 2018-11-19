import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav} from 'reactstrap';	
import { withRouter } from 'react-router';
import NavDropdown from './component.NavDropdown';
import NavItems from './component.NavItems';
import logo from '../../images/revature.png';

class AppNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
	}

  render() {

    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand className="Nav-brand" href="/">
          <img id="Nav-brand-img" label="Logo" src={logo} />
          <h1 id="Nav-brand-text">ERS</h1>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {/* {tNavItems} */}
            <NavDropdown {...this.props} />
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default withRouter(AppNav);
