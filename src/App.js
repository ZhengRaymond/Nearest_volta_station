import React, { Component } from 'react';
import GoogleMap from './google_map';
import './App.css';

class App extends Component {
  render() {
    let lon = 42;
    let lat = 40;
    return (
      <div className="App">
        <div className="header">
          <h1 className="title">Find a Volta charging station near you</h1>
        </div>
        <div className="content">
          <GoogleMap lon={lon} lat={lat} />
        </div>
      </div>
    );
  }
}

export default App;
