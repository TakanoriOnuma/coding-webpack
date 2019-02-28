import React from 'react';
import { hot } from 'react-hot-loader/root';

import MyComponent from './components/MyComponent';

class App extends React.Component {
  render() {
    return (
      <div>
        <div>Hello, World!</div>
        <MyComponent/>
      </div>
    );
  }
}

export default hot(App);
