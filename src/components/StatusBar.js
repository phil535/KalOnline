import styles from './StatusBar.css';
import React, { PropTypes } from 'react';
import BorderBox from './BorderBox.js';

export default class StatusBar extends React.Component {
  static propTypes = {
    healthPoints: PropTypes.number.isRequired,
    manaPoints: PropTypes.number.isRequired,
    experiencePoints: PropTypes.number.isRequired,
    compass: PropTypes.number.isRequired
  };

  render() {
    const { healthPoints, manaPoints, experiencePoints, compass } = this.props;

    return (
      <div id={styles.statusBarContainer}>
        <div id={styles.statusBarLeft} />
        <BorderBox width={120} height={37}>
          <div
            className={`${styles.bar} ${styles.healthBar}`}
            style={{ width: `${healthPoints}%` }}
          />
          <div
            className={`${styles.bar} ${styles.manaBar}`}
            style={{ width: `${manaPoints}%` }}
          />
          <div className={styles.expBarContainer}>
            {Array.from(Array(Math.floor(experiencePoints / 10))).map((value, i) => (
              <div key={`${i}`} className={`${styles.bar} ${styles.expBar} ${styles.expBlock}`} />
            ))}
          </div>
          <div
            className={`${styles.bar} ${styles.expBar}`}
            style={{ width: `${(experiencePoints % 10) * 10}%` }}
          />
        </BorderBox>
        <div id={styles.statusBarRight}>
          <div
            id={styles.compass}
            style={{ transform: `rotate(${compass}rad)` }}
          />
        </div>
      </div>
    );
  }
}
