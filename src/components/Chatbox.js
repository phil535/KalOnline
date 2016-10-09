import styles from './Chatbox.css';
import React, { PropTypes } from 'react';
import ScrollTextBox from './ScrollTextBox.js';

export default class ChatBox extends React.Component {
  render() {
    return (
      <div id={styles.chatboxContainer}>
        <div className={styles.scrollTextBoxContainer}>
          <ScrollTextBox height={50}>
            <p className={styles.textStatus}>test</p>
          </ScrollTextBox>
        </div>
        <div className={styles.scrollTextBoxContainer}>
          <ScrollTextBox height={147}>
            {Array.from(Array(100)).map((key, i) => (
              <p key={i} className={styles.textMessage}>test, {i}</p>
            ))}
          </ScrollTextBox>
          <input type="text" className={styles.chatBoxInput} />
        </div>
      </div>
    );
  }
}
