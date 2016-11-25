import styles from './ScrollBox.css';
import React, { PropTypes } from 'react';
import ReactHeight from 'react-height';

export default class ScrollBox extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired
  };
  state = {
    childrenHeight: 0,
    scrollPos: 0
  };

  onScroll = (event) => {
    const { deltaY } = event;
    const { height } = this.props;
    let { scrollPos, childrenHeight } = this.state;

    scrollPos -= (deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1) * 12;
    scrollPos = Math.min(Math.max(scrollPos, 0), childrenHeight - height);

    this.setState({
      scrollPos
    });
  };

  render() {
    const { height, children } = this.props;
    const { scrollPos, childrenHeight } = this.state;

    let scrollTextOffset;
    let scrollSliderPosition;
    if (childrenHeight > height) {
      scrollTextOffset = -(childrenHeight - scrollPos) + height;
      scrollSliderPosition = (1 - scrollPos / (childrenHeight - height)) * 100;
    } else {
      scrollTextOffset = 0;
      scrollSliderPosition = 0;
    }

    return (
      <div style={{ height }} className={styles.scrollBoxContainer}>
        <div
          onWheel={this.onScroll}
          style={{ marginTop: `${scrollTextOffset}px` }}
          className={styles.childrenContainer}
        >
          <ReactHeight onHeightReady={childrenHeight => this.setState({ childrenHeight })}>
          {children}
          </ReactHeight>
        </div>
        <div className={styles.scrollContainer}>
          <div className={styles.scrollTop} />
          <div
            style={{ backgroundPosition: `0 ${scrollSliderPosition}%` }}
            className={styles.scrollSlider}
          />
          <div className={styles.scrollBottom} />
        </div>
      </div>
    );
  }
}
