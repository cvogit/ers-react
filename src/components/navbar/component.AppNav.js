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
    let tNavItems = <NavItems {...this.props} />
    if(window.location.pathname === "/dashboard")
      tNavItems = null;

    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand className="Nav-brand" href="/">ERS</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {tNavItems}
            <NavDropdown {...this.props} />
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default withRouter(AppNav);
