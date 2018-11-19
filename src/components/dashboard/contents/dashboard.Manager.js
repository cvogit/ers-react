import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EnhancedTable from  './managerTables/component.ManagerReimburseTable';
import PendingTable from  './managerTables/component.ManagerPendingTable';
import ApprovedTable from  './managerTables/component.ManagerApprovedTable';
import DeniedTable from  './managerTables/component.ManagerDeniedTable';

class Manager extends Component {
  state = {
    value: 0,
    reimbursementList: []
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleTableRender = () => {
    if(this.state.value === 0)
      return <EnhancedTable id={this.props.id} />;
    else if(this.state.value === 1)
      return <PendingTable id={this.props.id} />;
    else if(this.state.value === 2)
      return <ApprovedTable id={this.props.id} />;
    else if(this.state.value === 3)
      return <DeniedTable id={this.props.id} />;
    else return null;
  }

  render() {

    let table = this.handleTableRender();

    return (
      <div id="manager-container">
        <Paper square>
          <Tabs
            value={this.state.value}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Denied" />
          </Tabs>
          {table}
        </Paper>
      </div>
    );
  }
}

export default Manager;