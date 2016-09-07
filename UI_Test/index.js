import 'systemjs-hot-reloader/default-listener.js';
import React from 'react';
import { render } from 'react-dom';
import 'src/components/main.css';
import ChatBox from 'src/components/Chatbox.js';
import StatusBar from 'src/components/StatusBar.js';

render(React.createElement('div', null, [
  React.createElement(ChatBox),
  React.createElement(StatusBar, { manaPoints: 100, healthPoints: 100, experiencePoints: 56, compass: 1.2 })
]), document.getElementById('container'));
