import React from 'react';
import bulbOff from './assets/images/light-bulb-OFF.jpg';
import bulbOn from './assets/images/light-bulb-ON.jpg';

const SERVER_URL = 'http://localhost:5000/';    

function ToggleOn(props) {
  return (
    <div>
      <img src={bulbOff} alt="Bulb Off" />
      <button onClick={props.onClick}>
        ON
      </button>
    </div>
  );
}

function ToggleOff(props) {
  return (
    <div>
      <img src={bulbOn} alt="Bulb On" />
      <button onClick={props.onClick}>
        OFF
      </button>
    </div>
  );
}

class Bulb extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOffClick = this.handleOffClick.bind(this);
    this.state = { isToggleOn: false };
  }

  componentDidMount() {
    this.fetchBulbState();
    this.sendBulbStateToServer();
  }

  fetchBulbState() {
    console.log('Fetching bulb state from server...');
    fetch(`${SERVER_URL}bulb`)
      .then(response => {
        console.log('Received response from server:', response);
        return response.json();
      })
      .then(data => {
        console.log('Parsed response data:', data);
        this.setState({ isToggleOn: data.is_on });
      })
      .catch(error => {
        console.error('Error fetching bulb state:', error);
      });
  }

  sendBulbStateToServer() {
    const { isToggleOn } = this.state;
    console.log('Sending bulb state to server:', isToggleOn);
    fetch(`${SERVER_URL}bulb/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_on: isToggleOn }),
    })
    .then(response => {
      console.log('Received response from server:', response);
      return response.json();
    })
    .then(data => {
      console.log('Parsed response data:', data);
    })
    .catch(error => {
      console.error('Error sending bulb state:', error);
    });
  }

  handleOnClick() {
    this.setState({ isToggleOn: true });
    console.log('Turning bulb on...');
    fetch(`${SERVER_URL}bulb/on`, { method: 'POST' })
      .then(response => {
        console.log('Received response from server:', response);
        return response.json();
      })
      .then(data => {
        console.log('Parsed response data:', data);
      })
      .catch(error => {
        console.error('Error turning bulb on:', error);
      });
  }

  handleOffClick() {
    this.setState({ isToggleOn: false });
    console.log('Turning bulb off...');
    fetch(`${SERVER_URL}bulb/off`, { method: 'POST' })
      .then(response => {
        console.log('Received response from server:', response);
        return response.json();
      })
      .then(data => {
        console.log('Parsed response data:', data);
      })
      .catch(error => {
        console.error('Error turning bulb off:', error);
      });
  }

  render() {
    const isToggleOn = this.state.isToggleOn;
    return isToggleOn ? (
      <ToggleOff onClick={this.handleOffClick} />
    ) : (
      <ToggleOn onClick={this.handleOnClick} />
    );
  }
}

export default Bulb;