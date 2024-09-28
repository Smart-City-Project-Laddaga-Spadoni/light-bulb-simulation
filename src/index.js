import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';


//function with ToggleOn option
function ToggleOn(props){
  return(
    <div>
    <img src="https://media.geeksforgeeks.org/wp-content/uploads/OFFbulb.jpg" />
    <button onClick={props.onClick}>
    ON
    </button>
    </div>
  );
}

//function with ToggleOff option
function ToggleOff(props){
  return(
    <div>
    <img src="https://media.geeksforgeeks.org/wp-content/uploads/ONbulb.jpg" />
    <button onClick={props.onClick}>
    OFF
    </button>
    </div>
  );
}

//class of Bulb
class Bulb extends React.Component{
  constructor(props){
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOffClick = this.handleOffClick.bind(this);
    this.state = {isToggleOn: false};
  }


  handleOnClick(){
    this.setState({isToggleOn: true});
  }

  handleOffClick(){
    this.setState({isToggleOn: false});
  }

  render() {
    const isToggleOn = this.state.isToggleOn;
    let button;
    if(isToggleOn){
      return button = <ToggleOff onClick={this.handleOffClick} />
    }else{
      return button = <ToggleOn onClick={this.handleOnClick} />
    }

    }
  }

render(
  <Bulb />,
  document.getElementById('root')
);