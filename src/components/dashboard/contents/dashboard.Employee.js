import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EnhancedTable from  './employeeTables/component.EmployeeReimbursementTable';

class Employee extends Component {
  constructor(props) {
		super(props);
		this.state = {
      value: 0
		};
  }
  
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div id="employee-container">
        {/* <Tabs value={this.state.value} onChange={this.handleChange}>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs> */}
        <EnhancedTable id={this.props.id} />
      </div>
    );
  }
}

export default Employee;