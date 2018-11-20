import React from 'react';

import axios  from 'axios';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import FilterListIcon from '@material-ui/icons/FilterList';
import Snackbar from '@material-ui/core/Snackbar';

import { lighten } from '@material-ui/core/styles/colorManipulator';

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'submitted', numeric: false, disablePadding: false, label: 'Submitted' },
  { id: 'resolved', numeric: true, disablePadding: false, label: 'Resolved' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Author' },
  { id: 'manager', numeric: false, disablePadding: false, label: 'Manager' }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, statusUpdate } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Denied Reimbursements
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions} id="reimbursement-tooltip-container">
        {numSelected > 0 ? (
          <>
            <Tooltip title="Deny">
            <>
              <Button id="reimbursement-table-deny-icon" onClick={() => statusUpdate(3)} aria-label="Clear">
                <h6 className="reimbursement-table-tooltip">Deny</h6>
                <ClearIcon />
              </Button>
            </>
            </Tooltip>
            <Tooltip title="Approve">
            <>
              <Button id="reimbursement-table-approve-icon" onClick={() => statusUpdate(2)} aria-label="Check">
                <h6 className="reimbursement-table-tooltip">Approve</h6>
                <CheckIcon />
              </Button>
            </>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class DeniedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'submitted',
    selected: [],
    snackbarOpen: false,
    snackbarMessage: 'snackbar',
    data: [],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount() {
    if( localStorage.getItem('JWT') ) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('JWT');

      axios.get(SERVER_ADDRESS+'/reimbursements?status=3')
      .then((response) => {
        this.setState({
          data: response.data
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
    }
  }

  // Send request to update reimbursements
  handleStatusUpdate = (pReStatus) => {
    if( localStorage.getItem('JWT') ) {
      const params = new URLSearchParams();
      params.append('status', parseInt(pReStatus));
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('JWT');

      this.state.selected.forEach( id => {
        console.log(SERVER_ADDRESS+'/reimbursements/'+id+"?status="+pReStatus);
        axios.put(SERVER_ADDRESS+'/reimbursements/'+id+"?status="+pReStatus)
        .then((response) => {
          let list = this.state.data;
          list.forEach( cell => {
            if(cell.id === id) {
              if(pReStatus === 2)
                cell.status = "approved";
              else if(pReStatus === 3)
                cell.status = "denied";
            }
          });
          this.setState({
            data: list
          })
          this.handleSnackbarMessage("Update request " + response.data.message);
          this.handleSnackbarOpen();
        })
        .catch((error) => {
          this.handleSnackbarMessage(error.response.data.message);
          this.handleSnackbarOpen();
        });
      });

      axios.get(SERVER_ADDRESS+'/reimbursements')
      .then((response) => {
        console.log(response.data);
        this.setState({
          data: response.data
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
    }
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar statusUpdate={this.handleStatusUpdate} numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  let author = n.authorFirst + " " + n.authorLast;
                  if(n.authorFirst === null)
                    author = "N/A";
                  let resolver = n.resolverFirst + " " + n.resolverLast;
                  if(n.resolverFirst === null)
                    resolver = "N/A";
                  let tSubmit = new Date(parseInt(n.submitted));
                  let tSubmitTime = tSubmit.toDateString();
                  let tResolved;
                  let tResolvedTime = "N/A";
                  
                  if(n.resolved !== null) {
                    tResolved = new Date(parseInt(n.resolved));
                    tResolvedTime = tResolved.toDateString();
                  }

                  let statusRow;
                  if(n.status === "approved")
                    statusRow = <TableCell className="status-column green-text" numeric>{n.status}</TableCell>;
                  else if(n.status === "denied")
                    statusRow = <TableCell className="status-column red-text" numeric>{n.status}</TableCell>;
                  else
                    statusRow = <TableCell className="status-column" numeric>{n.status}</TableCell>;

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell className="type-column"  component="th" scope="row" padding="none">
                        {n.type}
                      </TableCell>
                      <TableCell className="submit-column" numeric>{tSubmitTime}</TableCell>
                      <TableCell className="resolved-column" numeric>{tResolvedTime}</TableCell>
                      <TableCell className="amount-column" numeric>{n.amount}</TableCell>
                      <TableCell className="description-column" numeric>{n.description}</TableCell>
                      {statusRow}
                      <TableCell className="author-column" numeric>{author}</TableCell>
                      <TableCell className="resolver-column" numeric>{resolver}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={this.handleSnackbarClose}
          autoHideDuration={2000}
          open={this.state.snackbarOpen}
          message={<span id="snackbar-message">{this.state.snackbarMessage}</span>}
        />
      </Paper>
    );
  }
}

DeniedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeniedTable);
