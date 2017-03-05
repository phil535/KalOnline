// import 'systemjs-hot-reloader/default-listener.js';
import React from 'react';
import ReactDOM from 'react-dom';
import Container from 'src/components/Container.js';
import ChatBox from 'src/components/Chatbox.js';
import StatusBar from 'src/components/StatusBar.js';
import jss from 'jss';
import preset from 'jss-preset-default';

jss.setup(preset());

ReactDOM.render(React.createElement(Container, { width: 720, height: 480 }, [
  React.createElement(ChatBox, { key: 'chatbox' }),
  React.createElement(StatusBar, {
    key: 'statusbar',
    manaPoints: 1.0,
    healthPoints: 1.0,
    experiencePoints: 0.56,
    compass: 1.2
  })
]), document.getElementById('container'));
