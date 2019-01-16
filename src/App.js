import React, { Component } from 'react';
import './App.css';
import Graph from './Graph';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldReload: true
    }

    setInterval(this.checkReload.bind(this), 60 * 1000)
  }

  checkReload() {
    if(this.state.shouldReload) {
      document.location.reload()
    }
  }

  toggle() {
    this.setState({
      shouldReload: !this.state.shouldReload
    })
  }

  render() {
    console.log("Rerendering")
    console.log('this.state.shouldReload: ', this.state.shouldReload);
    return (
      <div className="App">
        <button id="resetter" className={`should-reload-${this.state.shouldReload}`} onClick={this.toggle.bind(this)} >
          {this.state.shouldReload ? "Auto-reload" : "Don't Reload"}
        </button>
        <Graph />
      </div>
    );
  }
}

export default App;
