import React from 'react';
import injectSheet from 'react-jss'

const styles = {
  container: {
    padding: 0,
    margin: 0,
    fontFamily: '"apple_regular", monospace',
    fontSize: '10px',
    color: 'white',
    position: 'relative'
  },
  '@font-face': {
    fontFamily: 'apple_regular',
    src: 'url("./font/apple_-webfont.woff2") format("woff2"), url("./font/apple_-webfont.woff") format("woff")',
    fontWeight: 'normal',
    fontStyle: 'normal'
  }
};

class Container extends React.Component {
  render() {
    const { children, classes, width, height } = this.props;

    return (
      <div style={{ width, height }} className={classes.container}>
        {children}
      </div>
    );
  }
}

export default injectSheet(styles)(Container);
