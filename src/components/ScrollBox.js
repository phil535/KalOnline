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

    const delta = (deltaY) === 0 ? 0 : deltaY > 0 ? 12 : -12;

    this.updateScroll(delta);
  };

  updateScroll(delta) {
    const { height } = this.props;
    const { scrollPos, childrenHeight } = this.state;

    this.setState({
      scrollPos: Math.max(Math.min(scrollPos - delta, childrenHeight - height), 0)
    });
  }

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
          <div onClick={() => this.updateScroll(-12)} className={styles.scrollTop} />
          <div
            style={{ backgroundPosition: `0 ${scrollSliderPosition}%` }}
            className={styles.scrollSlider}
          />
          <div onClick={() => this.updateScroll(12)} className={styles.scrollBottom} />
        </div>
      </div>
    );
  }
}
