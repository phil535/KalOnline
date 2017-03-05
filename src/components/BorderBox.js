import React from 'react';
import injectSheet from 'react-jss'

const styles = {
  borderBox: {
    position: 'relative',
    border: '1px solid #200',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: '2px',
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:before': {
      position: 'absolute',
      content: '" "',
      zIndex: '-1',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      border: '1px solid #742',
      outline: '1px solid #c95'
    }
  }
};

class BorderBox extends React.Component {
  static propTypes = {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  };

  render() {
    const { height, width, children, classes } = this.props;

    return (
      <div style={{ height, width }} className={classes.borderBox}>
        {children}
      </div>
    );
  }
}

export default injectSheet(styles)(BorderBox);
