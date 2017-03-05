import React from 'react';
import BorderBox from './BorderBox.js';
import injectSheet from 'react-jss'
import statusLeft from 'data/HyperText/status_left.bmp!src/plugins/bmp.js';
import statusRight from 'data/HyperText/status_right.bmp!src/plugins/bmp.js';
import compass from 'data/HyperText/compas.bmp!src/plugins/bmp.js';

const styles = {
  statusBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'inline-flex',
    alignItems: 'center',
    overflow: 'hidden'
  },
  statusBarLeft: {
    width: '13px',
    height: '52px',
    backgroundImage: `url("${statusLeft}")`
  },
  statusBarRight: {
    width: '96px',
    height: '52px',
    backgroundImage: `url("${statusRight}")`
  },
  compass: {
    marginTop: '2px',
    marginLeft: '13px',
    width: '49px',
    height: '49px',
    backgroundImage: `url("${compass}")`
  },
  bar: {
    boxSizing: 'border-box',
    height: '7px'
  },
  healthBar: {
    backgroundColor: '#a12',
    border: '1px solid #e88',
    borderRight: '1px solid #200',
    borderBottom: '1px solid #300'
  },
  manaBar: {
    backgroundColor: '#249',
    border: '1px solid #8ae',
    borderRight: '1px solid #013',
    borderBottom: '1px solid #012'
  },
  expBar: {
    backgroundColor: '#a92',
    border: '1px solid #ed8',
    borderRight: '1px solid #320',
    borderBottom: '1px solid #430'
  },
  expBarContainer: {
    display: 'inline-flex'
  },
  expBlock: {
    width: '11px',
    marginRight: '1px'
  }
}

export default class StatusBar extends React.Component {
  static propTypes = {
    healthPoints: React.PropTypes.number.isRequired,
    manaPoints: React.PropTypes.number.isRequired,
    experiencePoints: React.PropTypes.number.isRequired,
    compass: React.PropTypes.number.isRequired
  };

  render() {
    const { healthPoints, manaPoints, experiencePoints, compass, classes } = this.props;

    return (
      <div className={classes.statusBarContainer}>
        <div className={classes.statusBarLeft} />
        <BorderBox width={120} height={37}>
          <div
            className={`${classes.bar} ${classes.healthBar}`}
            style={{ width: `${healthPoints}%` }}
          />
          <div
            className={`${classes.bar} ${classes.manaBar}`}
            style={{ width: `${manaPoints}%` }}
          />
          <div className={classes.expBarContainer}>
            {Array.from(Array(Math.floor(experiencePoints / 10))).map((value, i) => (
              <div key={`${i}`} className={`${classes.bar} ${classes.expBar} ${classes.expBlock}`} />
            ))}
          </div>
          <div
            className={`${classes.bar} ${classes.expBar}`}
            style={{ width: `${(experiencePoints % 10) * 10}%` }}
          />
        </BorderBox>
        <div className={classes.statusBarRight}>
          <div
            className={classes.compass}
            style={{ transform: `rotate(${compass}rad)` }}
          />
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(StatusBar);
