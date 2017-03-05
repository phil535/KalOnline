import React from 'react';
import injectSheet from 'react-jss'
import ScrollBox from './ScrollBox.js';

const styles = {
  chatboxContainer: {
    width: '420px',
    height: '240px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  container: {
    border: '1px solid #cc9955',
    borderRadius: '1px',
    '& + container': {
      marginTop: '2px',
    },
    '& p': {
      margin: '0 1px',
      lineHeight: '12px',
      '&.textStatus': { color: '#f84' },
      '&.textMessage': { color: '#fff' },
      '&.textGlobal': { color: '#f9f' }
    }
  },
  chatBoxInput: {
    padding: '1px',
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none'
    }
  }
};

class ChatBox extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.chatboxContainer}>
        <div className={classes.container}>
          <ScrollBox height={50}>
            <p className={classes.textStatus}>test</p>
          </ScrollBox>
        </div>
        <div className={classes.container}>
          <ScrollBox height={147}>
            {Array.from(Array(100)).map((key, i) => (
              <p key={`${i}`} className={classes.textMessage}>test, {i}</p>
            ))}
          </ScrollBox>
          <input type="text" className={classes.chatBoxInput} />
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(ChatBox);
