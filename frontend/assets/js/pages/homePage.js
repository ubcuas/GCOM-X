import React from 'react';
import ReactDOM from 'react-dom';
import GCOMX from '../app/gcomx';

const wrapper = document.getElementById('gcomx-root');
if (wrapper)
{
    ReactDOM.render(
        <GCOMX />,
        wrapper,
    );
}
