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
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

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
  const { classes, newTicket } = props;

  return (
    <Toolbar >
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          My Reimbursements
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions} id="reimbursement-tooltip-container">
          <Tooltip title="Deny">
            <>
              <Button id="reimbursement-table-deny-icon" onClick={() => newTicket()} aria-label="Clear">
                <h6 className="reimbursement-table-tooltip">New</h6>
                <AddIcon />
              </Button>
            </>
          </Tooltip>
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

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'submitted',
    selected: [],
    dialogOpen: false,
    ticketType: 0,
    ticketAmount: null,
    ticketDescription: '',
    snackbarOpen: false,
    snackbarMessage: 'snackbar',
    data: [],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount() {
    window.setTimeout(() => {
      if( localStorage.getItem('JWT') ) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('JWT');
        axios.get(SERVER_ADDRESS+'/reimbursements/users/'+this.props.id)
        .then((response) => {
          console.log("Success");
          this.setState({
            data: response.data
          });
        })
        .catch((error) => {
          console.log("Fail");
          console.log(error.response);
        });
      }
    }, 1000);
  }

  handleTicketSubmit = () => {
    if(this.state.ticketType !== 0 && 
        this.state.ticketAmount !== 0 &&
        this.state.ticketDescription !== '') {
      if( localStorage.getItem('JWT') ) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('JWT');
        axios.post(SERVER_ADDRESS+'/reimbursements?amount='+this.state.ticketAmount+"&description="+this.state.ticketDescription+"&type_id="+this.state.ticketType)
        .then((response) => {
          this.handleSnackbarMessage("Ticket submitted.");
          this.handleSnackbarOpen();
          axios.get(SERVER_ADDRESS+'/reimbursements/users/'+this.props.id)
          .then((response) => {
            this.setState({
              data: response.data, 
              ticketType: 0,
              ticketAmount: null,
              ticketDescription: ''
            });
          })
          .catch((error) => {
          this.handleSnackbarOpen();
            this.handleSnackbarMessage("Server error, please contact support");
            this.handleSnackbarOpen();
          });
        })
        .catch((error) => {
          this.handleSnackbarMessage("Server error, please contact support");
          this.handleSnackbarOpen();
        });
      }
      this.setState({
        dialogOpen: false
      });
    } else {
      this.handleSnackbarMessage("Please finish fill out the form.");
      this.handleSnackbarOpen();
    }
  }

  ticketAmountChange = (event) => {
    this.setState({
      ticketAmount: event.target.value
    });
  };

  handleDescriptionChange = (event) => {
    this.setState({
      ticketDescription: event.target.value
    });
  }

  handleTicketTypeChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

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
    const ticketTypes = [
      {
        value: 1,
        label: "Travel",
      },
      {
        value: 2,
        label: "Food",
      },
      {
        value: 3,
        label: "Lodging",
      },
      {
        value: 4,
        label: "Other",
      },
    ];
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar newTicket={this.handleDialogOpen} numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
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
                      <TableCell className="description-column" title={n.description} numeric>
                        <p className="description-column">{n.description}
                        </p>
                      </TableCell>
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
        <Dialog
          type="large"
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="responsive-dialog-title"
          onOverlayClick={this.handleDialogClose}
        >
          <DialogTitle id="responsive-dialog-title">{"Submit a new ticket"}</DialogTitle>
          <DialogContent>
            <DialogContentText>

            </DialogContentText>
            <TextField
              id="filled-select-currency"
              label="Amount"
              value={this.state.ticketAmount}
              onChange={(event) => this.ticketAmountChange(event)}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <TextField
              id="filled-select-type"
              select
              label="Type"
              className="filled-select-type"
              value={this.state.ticketType}
              onChange={this.handleTicketTypeChange("ticketType")}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select your currency"
              margin="normal"
              variant="filled"
            >
              {ticketTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="ticket-description-input"
              label="Description"
              className="navbar-dialog-input"
              type="text"
              margin="normal"
              fullWidth
              multiline
              rowsMax={2}
              onChange={this.handleDescriptionChange}
              value={this.state.ticketDescription}
              inputProps={{
                maxLength: 100
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleTicketSubmit} color="primary" autoFocus>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);