import React from 'react';
import ReactHeight from 'react-height';
import injectSheet from 'react-jss'
import buttonArrowUp from 'data/HyperText/button_arrow_up.bmp!src/plugins/bmp.js';
import buttonArrowDown from 'data/HyperText/button_arrow_down.bmp!src/plugins/bmp.js';
import buttonArrowTab from 'data/HyperText/scroll_tab.bmp!src/plugins/bmp.js';

const styles = {
  scrollBoxContainer: {
    display: 'flex',
    overflowY: 'hidden'
  },
  childrenContainer: {
    float: 'left',
    flexGrow: '1',
    minHeight: '100%'
  },
  scrollContainer: {
    padding: '1px',
    boxSizing: 'borderBox',
    height: '100%',
    float: 'left',
    flexShrink: 0,
    width: '11px',
    display: 'flex',
    flexDirection: 'column'
  },
  scrollTop: {
    height: '12px',
    width: '9px',
    backgroundImage: `url("${buttonArrowUp}")`,
    flexShrink: 0
  },
  scrollBottom: {
    height: '12px',
    width: '9px',
    backgroundImage: `url("${buttonArrowDown}")`,
    flexShrink: 0
  },
  scrollSlider: {
    flexGrow: 1,
    backgroundImage: `url("${buttonArrowTab}")`,
    backgroundRepeat: 'no-repeat'
  }
};

class ScrollBox extends React.Component {
  static propTypes = {
    height: React.PropTypes.number.isRequired
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
    const { height, children, classes } = this.props;
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
      <div style={{ height }} className={classes.scrollBoxContainer}>
        <div
          onWheel={this.onScroll}
          style={{ marginTop: `${scrollTextOffset}px` }}
          className={classes.childrenContainer}
        >
          <ReactHeight onHeightReady={childrenHeight => this.setState({ childrenHeight })}>
          {children}
          </ReactHeight>
        </div>
        <div className={classes.scrollContainer}>
          <div onClick={() => this.updateScroll(-12)} className={classes.scrollTop} />
          <div
            style={{ backgroundPosition: `0 ${scrollSliderPosition}%` }}
            className={classes.scrollSlider}
          />
          <div onClick={() => this.updateScroll(12)} className={classes.scrollBottom} />
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(ScrollBox);
