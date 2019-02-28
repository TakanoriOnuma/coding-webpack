import React from 'react';

import styles from './css/MyComponent.scss';

class MyComponent extends React.Component {
  render() {
    return (
      <div className={styles.block}>
        <span className={styles.title}>My Component!</span>
      </div>
    );
  }
}

export default MyComponent;
