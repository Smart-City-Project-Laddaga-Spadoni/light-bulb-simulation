import React from 'react';
import bulbOff from './assets/images/light-bulb-OFF.jpg';
import bulbOn from './assets/images/light-bulb-ON.jpg';

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

  handleOnClick() {
    this.setState({ isToggleOn: true });
  }

  handleOffClick() {
    this.setState({ isToggleOn: false });
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