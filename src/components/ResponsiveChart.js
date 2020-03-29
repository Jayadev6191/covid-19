import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import ClearIcon from '@material-ui/icons/Clear';
import {Line, Doughnut} from 'react-chartjs-2'

import './Chart.css'

import { makeStyles, useTheme } from '@material-ui/core/styles';

const drawerWidth = 240;

const options = {
    legend: {
        display: true
    },
    animation: {
        duration: 1
    },
    scales: {
        yAxes: [{
            stacked: true
        }]
    }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  main: {
    [theme.breakpoints.up('sm')]: {
        width: `100%`,
        marginLeft: 0,
        backgroundColor: 'red'
      },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

let all_countries = []

function ResponsiveChart(props) {
  const classes = useStyles();
  // const [open, setOpen] = useState(true);
  const [countries, setCountries] = useState(all_countries);
  const [filteredCountry, setFilteredCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [data, setData] = useState({labels: [], datasets: []})
  const [pieData, setPieData] = useState({labels: [], datasets: []})
  const [activeCases, setActiveCases] = useState('')
  const [deaths, setDeaths] = useState('')
  const [recoveredCases, setRecoveredCases] = useState('')
  const [isMaintenanceModeOn, setMaintenance] = useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { container } = props;
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFiterSearch = (e) => {
    setFilteredCountry(e.target.value)
    const filtered_search = all_countries.filter(country => {
        return country.toLowerCase().startsWith(e.target.value.toLowerCase());
    });

    setCountries(filtered_search);
  }

  const handleClearFilter = () => {
    setFilteredCountry('')
    const filtered_search = [...all_countries]
    setCountries(filtered_search);
  }

  const selectCountry = (e) => {
    // TODO:  This ugly conditional will be deleted when a mapping file is created - start
    if(e.target.textContent === "S. Korea") {
        setSelectedCountry("korea, south")
        return;
    }
    // TODO:  This ugly conditional will be deleted when a mapping file is created - end

    if(selectedCountry !== e.target.textContent) {
        setSelectedCountry(e.target.textContent)
    }
  }

  useEffect(() => {
    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(response => response.json())
      .then(res => {
        setCountries(Object.keys(res).map(country => {
          all_countries.push(country)
          return country
        }))
      })
      .catch(err => console.log("could not fetch countries"))
  },[])

  useEffect(() => {
    if(selectedCountry) {
      fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(response => response.json())
      .then(res => {
        console.log(res[`${selectedCountry}`])
        let latestLabels = []
        let latestDatasets = []
        let covid_obj = {}
        covid_obj.label = selectedCountry
        covid_obj.fill = false;
        covid_obj.lineTension = 0.1;
        covid_obj.backgroundColor ='rgba(75,192,192,0.4)';
        covid_obj.borderColor = 'rgba(75,192,192,1)';
        covid_obj.borderCapStyle = 'butt';
        covid_obj.borderDash = [];
        covid_obj.borderDashOffset = 0.0;
        covid_obj.borderJoinStyle = 'miter';
        covid_obj.pointBorderColor = 'rgba(75,192,192,1)';
        covid_obj.pointBackgroundColor = '#fff';
        covid_obj.pointBorderWidth = 1;
        covid_obj.pointHoverRadius = 10;
        covid_obj.pointHoverBackgroundColor = 'rgba(75,192,192,1)';
        covid_obj.pointHoverBorderColor = 'rgba(220,220,220,1)';
        covid_obj.pointHoverBorderWidth = 2;
        covid_obj.pointRadius = 5;
        covid_obj.pointHitRadius = 10;
        res[`${selectedCountry}`].map(o => console.log(o.confirmed))
        covid_obj.data = res[`${selectedCountry}`].map(o => o.confirmed)
        latestLabels = res[`${selectedCountry}`].map(o => {
          console.log(o)
          return o.date
        })
        latestDatasets.push(covid_obj)
        console.log(latestLabels)
        setData({labels: latestLabels, datasets: latestDatasets})

        let pieChartLabels = ["Active Cases", "Number of deaths", "Recovered Cases"]
        const latest_data = res[`${selectedCountry}`].length-1
        console.log(res[`${selectedCountry}`][latest_data])

        let pieChartDataPoints = [res[`${selectedCountry}`][latest_data].confirmed, res[`${selectedCountry}`][latest_data].deaths, res[`${selectedCountry}`][latest_data].recovered]
        let pieChartData = {
            labels: pieChartLabels,
            datasets: [{
                data: pieChartDataPoints,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        }

        setPieData(pieChartData)
        setActiveCases(res[`${selectedCountry}`][latest_data].confirmed)
        setDeaths(res[`${selectedCountry}`][latest_data].deaths)
        setRecoveredCases(res[`${selectedCountry}`][latest_data].recovered)

      })
    } 
  }, [selectedCountry])

  const drawer = (
    <React.Fragment>
      <div className={classes.drawerHeader}>
          <FormControl fullWidth className={classes.margin} variant="filled">
            <InputLabel htmlFor="filled-adornment-amount">Search for a country</InputLabel>
            <Input
                id="filled-adornment-amount"
                value={filteredCountry}
                onChange={handleFiterSearch}
                endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search input"
                        onClick={handleClearFilter}
                      >
                        {filteredCountry ? <ClearIcon /> : null}
                      </IconButton>
                    </InputAdornment>
                  }
            />
          </FormControl>
      </div>
      <List>
        {countries.map((text, index) => (
          <ListItem button key={text} onClick={selectCountry} selected={text.toLowerCase() === selectedCountry.toLocaleLowerCase()}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Covid-19 Visualizer
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.drawerHeader} />
              <div className="main">
                {
                  isMaintenanceModeOn ?
                  <div className="maintenance">
                    <Alert icon={false} elevation={6} variant="filled" severity="Error" className={clsx(classes.maintenanceAlert)} >
                        <AlertTitle>The site is in the maintenance mode. Will be back shortly!</AlertTitle>
                    </Alert>
                  </div>:
                  <React.Fragment>
                      <Grid container className="grid">
                          <Grid item xs={3}>
                              <Typography variant="body2" component="p">
                                  Active Cases: {activeCases}
                              </Typography>
                          </Grid>
                          <Grid item xs={3}>
                              <Typography variant="body2" component="p">
                                  Number of deaths: {deaths}
                              </Typography>
                          </Grid>
                          <Grid item xs={3}>
                              <Typography variant="body2" component="p">
                                  Recovered Cases: {recoveredCases}
                              </Typography>
                          </Grid>
                      </Grid>
                      <div className="line">
                          <Line data={data} options={options} />
                      </div>
                      <div className="pie">
                          <Doughnut data={pieData} />
                      </div>
                  
                      <div className="alert">
                          <Alert icon={false} elevation={6} variant="filled" severity="warning" className={clsx(classes.alert)} >
                              <AlertTitle>Did you wash your hands yet <span aria-label="question" role="img">🤷🏽‍♂️</span>? <a href="https://www.youtube.com/watch?v=u4l35otdiHw" rel="noopener noreferrer" target="_blank">Watch here</a> Please follow social distancing, be safe and responsible</AlertTitle>
                          </Alert>
                      </div>
                  </React.Fragment>
                }
              </div>
      </main>
    </div>
  );
}

ResponsiveChart.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.any,
};

export default ResponsiveChart;
