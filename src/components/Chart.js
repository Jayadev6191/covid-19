import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import ClearIcon from '@material-ui/icons/Clear';
import './Chart.css'
import {Line, Doughnut} from 'react-chartjs-2'
const drawerWidth = 240;

var options = {
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

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  alert: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  maintenanceAlert: {
    justifyContent: 'center',
    alignItems: 'center',
    height:150
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

let all_countries = []

export default function Chart() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [countries, setCountries] = useState(all_countries);
  const [filteredCountry, setFilteredCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [data, setData] = useState({labels: [], datasets: []})
  const [pieData, setPieData] = useState({labels: [], datasets: []})
  const [activeCases, setActiveCases] = useState('')
  const [deaths, setDeaths] = useState('')
  const [recoveredCases, setRecoveredCases] = useState('')
  const [isMaintenanceModeOn, setMaintenance] = useState(true)

  const handleDrawerOpen = () => {
    setOpen(true);
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
      .then(res => {setCountries(Object.keys(res))})
      .catch(err => {alert("hi")})

    // fetch("https://corona.lmao.ninja/countries")
    //   .then(response => response.json())
    //   .then(res => {
    //       setCountries(res.map(o => {
    //           all_countries.push(o.country)
    //           return o.country
    //       }))
    //   })
    //   .catch(err => {
    //     alert("hi")
    //   })
  },[])

  useEffect(() => {
    if(selectedCountry) {
      fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(response => response.json())
      .then(data => {
        // data[`${selectedCountry}`].forEach(({ date, confirmed, recovered, deaths }) =>
        // let covid_obj = {}
        //     covid_obj.label = res.standardizedCountryName.toUpperCase()
        //     covid_obj.fill = false;
        //     covid_obj.lineTension = 0.1;
        //     covid_obj.backgroundColor ='rgba(75,192,192,0.4)';
        //     covid_obj.borderColor = 'rgba(75,192,192,1)';
        //     covid_obj.borderCapStyle = 'butt';
        //     covid_obj.borderDash = [];
        //     covid_obj.borderDashOffset = 0.0;
        //     covid_obj.borderJoinStyle = 'miter';
        //     covid_obj.pointBorderColor = 'rgba(75,192,192,1)';
        //     covid_obj.pointBackgroundColor = '#fff';
        //     covid_obj.pointBorderWidth = 1;
        //     covid_obj.pointHoverRadius = 5;
        //     covid_obj.pointHoverBackgroundColor = 'rgba(75,192,192,1)';
        //     covid_obj.pointHoverBorderColor = 'rgba(220,220,220,1)';
        //     covid_obj.pointHoverBorderWidth = 2;
        //     covid_obj.pointRadius = 1;
        //     covid_obj.pointHitRadius = 10;
        //     covid_obj.data = Object.values(res.timeline.cases).map(Number)
        //     latestDatasets.push(covid_obj)
        //     setData({labels: latestLabels, datasets: latestDatasets})
        //)
      })
      // fetch(`https://corona.lmao.ninja/historical/${selectedCountry.toLowerCase()}`)
      // .then(response => response.json())
      // .then(res => {
      //     console.log(res)
      //     const keys = Object.keys(res.timeline.cases);
      //     const currentKey = keys[keys.length - 1];
      //     setActiveCases(res.timeline.cases[currentKey])
      //     setDeaths(res.timeline.deaths[currentKey])
      //     setRecoveredCases(res.timeline.recovered[currentKey])
      //     // variables for line chart
      //     let latestLabels = Object.keys(res.timeline.cases)
      //     let latestDatasets = []
      //     // variables for pie/doughnut chart
      //     let pieChartLabels = ["Active Cases", "Number of deaths", "Recovered Cases"]
      //     let pieChartDataPoints = [res.timeline.cases[currentKey], res.timeline.deaths[currentKey], res.timeline.recovered[currentKey]]
      //     let pieChartData = {
      //         labels: pieChartLabels,
      //         datasets: [{
      //             data: pieChartDataPoints,
      //             backgroundColor: [
      //                 '#FF6384',
      //                 '#36A2EB',
      //                 '#FFCE56'
      //             ],
      //             hoverBackgroundColor: [
      //                 '#FF6384',
      //                 '#36A2EB',
      //                 '#FFCE56'
      //             ]
      //         }]
      //     }

      //     setPieData(pieChartData)

      //     let covid_obj = {}
      //     covid_obj.label = res.standardizedCountryName.toUpperCase()
      //     covid_obj.fill = false;
      //     covid_obj.lineTension = 0.1;
      //     covid_obj.backgroundColor ='rgba(75,192,192,0.4)';
      //     covid_obj.borderColor = 'rgba(75,192,192,1)';
      //     covid_obj.borderCapStyle = 'butt';
      //     covid_obj.borderDash = [];
      //     covid_obj.borderDashOffset = 0.0;
      //     covid_obj.borderJoinStyle = 'miter';
      //     covid_obj.pointBorderColor = 'rgba(75,192,192,1)';
      //     covid_obj.pointBackgroundColor = '#fff';
      //     covid_obj.pointBorderWidth = 1;
      //     covid_obj.pointHoverRadius = 5;
      //     covid_obj.pointHoverBackgroundColor = 'rgba(75,192,192,1)';
      //     covid_obj.pointHoverBorderColor = 'rgba(220,220,220,1)';
      //     covid_obj.pointHoverBorderWidth = 2;
      //     covid_obj.pointRadius = 1;
      //     covid_obj.pointHitRadius = 10;
      //     covid_obj.data = Object.values(res.timeline.cases).map(Number)
      //     latestDatasets.push(covid_obj)
      //     setData({labels: latestLabels, datasets: latestDatasets})
      // })
      // .catch(err => {
        
      // })
    } 
  }, [selectedCountry])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Covid-19 Statistics
          </Typography>
        </Toolbar>
      </AppBar>
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
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
        </Drawer> 
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
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
                      <div className="line">
                          <Line data={data} options={options} />
                      </div>
                      <div className="pie">
                          <Doughnut data={pieData} />
                      </div>
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
                      <div className="alert">
                          <Alert icon={false} elevation={6} variant="filled" severity="warning" className={clsx(classes.alert)} >
                              <AlertTitle>Did you wash your hands yet <span aria-label="question" role="img">🤷🏽‍♂️</span>? <a href="https://www.youtube.com/watch?v=u4l35otdiHw" rel="noopener noreferrer" target="_blank">Watch here</a> Please follow social distancing, be safe and responsible</AlertTitle>
                          </Alert>
                      </div>
                  </React.Fragment>
                }
              </div>
        </main>
      
      </React.Fragment>
    </div>
  );
}