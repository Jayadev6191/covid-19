import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import ReactCountryFlag from "react-country-flag"
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Switch from '@material-ui/core/Switch';
import {allCountries} from "../utils/flag"
import {Line, Doughnut, defaults} from 'react-chartjs-2'
import './Chart.css'

import { makeStyles } from '@material-ui/core/styles';

defaults.global.maintainAspectRatio = false

const options = {
    legend: {
        display: false
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
  canvascontainer: {
    height: '60vh'
  },
  appBar: {},
  main: {},
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: 20,
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
    }
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
}));

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

function CovidAppBar(props) {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Covid-19 Visualizer
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

function CovidMainContent(props) {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [flagCode, setFlagCode] = useState('US');
  const [data, setData] = useState({labels: [], datasets: []})
  const [pieData, setPieData] = useState({labels: [], datasets: []})
  const [activeCases, setActiveCases] = useState('')
  const [deaths, setDeaths] = useState('')
  const [recoveredCases, setRecoveredCases] = useState('')
  const [lineView, setLineView] = useState(true)
  
  const handleChangeCountry = (v) => {
    if(v) {
      setSelectedCountry(v.label)
      setFlagCode(v.code)
    }
  }

  const handleChangeChartView = (e, v) => setLineView(v)

  const AntSwitch = withStyles((theme) => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: option => option.label,
  });
  

  useEffect(() => {
    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(response => response.json())
      .then(res => {})
      .catch(err => console.log("could not fetch countries"))
  },[])

  useEffect(() => {
    if(selectedCountry) {
      fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(response => response.json())
      .then(res => {
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
        covid_obj.pointHoverRadius = 5;
        covid_obj.pointHoverBackgroundColor = 'rgba(75,192,192,1)';
        covid_obj.pointHoverBorderColor = 'rgba(220,220,220,1)';
        covid_obj.pointHoverBorderWidth = 2;
        covid_obj.pointRadius = 3;
        covid_obj.pointHitRadius = 10;
        covid_obj.data = res[`${selectedCountry}`].map(o => o.confirmed)
        latestLabels = res[`${selectedCountry}`].map(o => o.date)
        latestDatasets.push(covid_obj)
        setData({labels: latestLabels, datasets: latestDatasets})

        let pieChartLabels = ["Active Cases", "Number of deaths", "Recovered Cases"]
        const latest_data = res[`${selectedCountry}`].length-1

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

  return (
    <React.Fragment>
        <Autocomplete
          id="combo-box-demo"
          style={{ width: 300 }}
          options={allCountries}
          filterOptions={filterOptions}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          getOptionLabel={(option) => option.label}
          onChange={(e, v) => v ? handleChangeCountry(v) : null}
          renderOption={(option) => (
            <React.Fragment>
              <span>{countryToFlag(option.code)}</span>
              {option.label}
            </React.Fragment>
          )}
          renderInput={(params) => <TextField {...params} label="Select a country" variant="outlined" />}
          defaultValue={{"code":"US", "label": "US", "phone": '1', "suggested": true }}
        />

        <Card className="card" variant="outlined">
          <Grid item xs={12}>
            <ReactCountryFlag
              countryCode={flagCode}
              style={{
                fontSize: '8em',
                lineHeight: '1em',
              }}
              aria-label="United States"
            />
          </Grid>
          <Grid item sm container spacing={3} className="metrics">
            <Grid item xs={4} className="info">
              <span className="info_type" id="active_key">Active</span>
              <Typography id="active_value" color="textSecondary">{activeCases}</Typography>
            </Grid>
            <Grid item xs={4} className="info">
              <span className="info_type" id="recovered_key">Recovered</span>
              <Typography id="recovered_value" color="textSecondary">{recoveredCases}</Typography>
            </Grid>
            <Grid item xs={4} className="info">
              <span className="info_type" id="death_key">Deaths</span>
              <Typography id="death_value" color="textSecondary">{deaths}</Typography>
            </Grid>
          </Grid>
      </Card>
      <Grid component="label" container spacing={1} id="switch_container">
          <Grid item>Pie Chart</Grid>
          <Grid item>
            <AntSwitch checked={lineView} onChange={handleChangeChartView} name="checkedC" />
          </Grid>
          <Grid item>Line Chart</Grid>
      </Grid>
      {
        lineView ?
        <div className="line">
          <article className="canvas-container">
            <Line data={data} options={options} />
          </article>
        </div> :
        <div className="pie">
          <Doughnut data={pieData} height={400} />
        </div>
      }
    </React.Fragment>
  )
}


function ResponsiveChart(props) {
  const classes = useStyles();
  const [isMaintenanceModeOn] = useState(false)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <CovidAppBar/>
        {
            isMaintenanceModeOn ?
            <div className="maintenance">
              <Alert icon={false} elevation={6} variant="filled" severity="Error" className={clsx(classes.maintenanceAlert)} >
                  <AlertTitle>The site is in the maintenance mode. Will be back shortly!</AlertTitle>
              </Alert>
            </div>:
            <CovidMainContent/>
        }
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