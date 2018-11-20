import React, { Component } from 'react';

import Button from 'react-toolbox/lib/button/Button';
import Navigation from 'react-toolbox/lib/navigation/Navigation';

import Employee from './dashboard/contents/dashboard.Employee';
import Manager from './dashboard/contents/dashboard.Manager';
import Home from './page.Home';
import Register from './page.Register';
class Dashboard extends Component {
  constructor(props) {
		super(props);
		this.state = {
			active: "employee",
		};
	}

	handleTabSelect = (event) => {
		event.preventDefault();
		this.setState({
			active: event.target.value,
		});
  }
  
	getMonthFromDate = (pDate) => {
		const monthNames = ["January", "Febuary", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];
		return monthNames[pDate.getMonth()];
	}

	render() {
		const activeTab   = this.state.active;
		const tabSelect 	= this.handleTabSelect;
		const date 				= new Date();
		const currentDate 	= date.getDate();
		const currentMonth 	= date.getMonth()+1;
		const currentYear 	= date.getFullYear();
		const currentHour 	= date.getHours();
		const currentMinute = date.getMinutes();
		let renderTabs;
		if(this.props.loggedIn) {
			renderTabs = this.props.role.split(" ").map(function(role) {
				if (activeTab === role)
					return <Button className="tab-active" key={role} label={role} accent onClick={tabSelect} value={role} />
				else if ( role !== '')
					return <Button className="tab" key={role} label={role} accent onClick={tabSelect} value={role} />	
				else
					return null;
			});
		} else {
			renderTabs = null;
		}

    let renderContent = null;
    if(activeTab === "employee" && this.props.loggedIn)
      renderContent = <Employee {...this.props} />;
    else if(activeTab === "manager" && this.props.loggedIn)
			renderContent = <Manager {...this.props} />;
		else if(!this.props.loggedIn && this.props.page === 'register')
			renderContent = <Register />;
		else if(!this.props.loggedIn)
			renderContent = <Home />;

    return (
      <div id="dashboard">
        <div className="sidebar">
          <div className="sidebar-header">
            <h5 className="sidebar-month"> {currentMonth}-{currentDate}-{currentYear}</h5>
            <h6 className="sidebar-date"> {currentHour}:{currentMinute} </h6>
          </div>
          <Navigation type='vertical'>
            { renderTabs } 
          </Navigation>
        </div>
        <div id="dashboard-container">
          {renderContent}
        </div>
      </div>
    );
  }
}

export default Dashboard;