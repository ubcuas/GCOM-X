import React from 'react';
import ReactDOM from 'react-dom';
import GCOMv2 from '../app/gcomx';

const wrapper = document.getElementById('gcomx-root');
if (wrapper)
{
    ReactDOM.render(
        <GCOMv2 />,
        wrapper,
    );
}
