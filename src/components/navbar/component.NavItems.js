import React, { Component } from 'react';
import { NavItem, NavLink } from 'reactstrap';	

class NavItems extends Component {
  handleScroll = (value) => {
		console.log(value);
		var element = 'home';
		if (value === 'about') {
			element = document.getElementById('about');
		} else if (value === 'growths') {
			element = document.getElementById('growths');
		} else if (value === 'partners') {
			element = document.getElementById('partners');
		}

		if (element !== null)
    	element.scrollIntoView({behavior: 'smooth'});
  }
  
  render() {
    return (
      <>
        <NavItem className="Nav-item" eventKey={1} onClick={() => this.handleScroll('about')}>
          <NavLink>About</NavLink>
        </NavItem>
        <NavItem className="Nav-item" eventKey={2} onClick={() => this.handleScroll('growths')}>
          <NavLink>Growths</NavLink>
        </NavItem>
        <NavItem className="Nav-item" eventKey={3} onClick={() => this.handleScroll('partners')}>
          <NavLink>Partners</NavLink>
        </NavItem>
      </>
    );
  }
}

export default NavItems;