import styles from './ScrollBox.css';
import React, { PropTypes } from 'react';

export default class ScrollBox extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired
  };
  state = {
    scrollPos: 0
  };

  onScroll = (event) => {
    const { deltaY } = event;
    const { children, height } = this.props;
    let { scrollPos } = this.state;

    scrollPos -= deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1;
    scrollPos = Math.min(Math.max(scrollPos, 0), children.length - height / 12);

    this.setState({
      ...this.state,
      scrollPos
    });
  };

  render() {
    const { height, children } = this.props;
    const { scrollPos } = this.state;

    let scrollTextOffset;
    let scrollSliderPosition;
    if (children.length * 12 > height) {
      scrollTextOffset = -(children.length - scrollPos) * 12 + height;
      scrollSliderPosition = (1 - scrollPos / (children.length - height / 12)) * 100;
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
          {children}
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
