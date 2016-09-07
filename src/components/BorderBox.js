import styles from './BorderBox.css';
import React, { PropTypes } from 'react';

export default class BorderBox extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  };

  render() {
    const { height, width, children } = this.props;

    return (
      <div style={{ height, width }} className={styles.borderBox}>
        {children}
      </div>
    );
  }
}
