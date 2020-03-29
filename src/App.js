import React, {Component} from 'react';
// import Chart from './components/Chart'
import ResponsiveChart from './components/ResponsiveChart'
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<ResponsiveChart />
			</div>
		);
	}
}

export default App;
