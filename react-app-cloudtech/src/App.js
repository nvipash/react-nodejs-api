import './App.css';

import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import Home from './Home';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
        </Switch>
      </div>
    );

    return (
      <Switch className='app-container'>
        <App/>
      </Switch>
    );
  }
}

export default App;