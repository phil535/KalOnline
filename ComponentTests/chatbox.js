import 'systemjs-hot-reloader/default-listener.js';
import React from 'react';
import { render } from 'react-dom';
import 'src/components/main.css';
import ChatBox from 'src/components/Chatbox.js';

render(React.createElement(ChatBox), document.getElementById('container'));
