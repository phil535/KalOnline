import styles from './ScrollTextBox.css';
import React, { PropTypes } from 'react';

export default class ScrollTextBox extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired
  };

  render() {
    const { height, children } = this.props;

    return (
      <div style={{ height }} className={styles.scrollTextBoxContainer}>
        {children}
      </div>
    );
  }
}
