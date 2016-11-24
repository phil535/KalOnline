import styles from './Chatbox.css';
import React, { PropTypes } from 'react';
import ScrollBox from './ScrollBox.js';

export default class ChatBox extends React.Component {
  render() {
    return (
      <div id={styles.chatboxContainer}>
        <div className={styles.container}>
          <ScrollBox height={50}>
            <p className={styles.textStatus}>test</p>
          </ScrollBox>
        </div>
        <div className={styles.container}>
          <ScrollBox height={147}>
            {Array.from(Array(100)).map((key, i) => (
              <p key={i} className={styles.textMessage}>test, {i}</p>
            ))}
          </ScrollBox>
          <input type="text" className={styles.chatBoxInput} />
        </div>
      </div>
    );
  }
}
