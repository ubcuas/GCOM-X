import React from 'react';
import ReactDOM from 'react-dom';
import GCOMv2 from '../app/gcom_v2';

const wrapper = document.getElementById('gcom_v2-root');
if (wrapper)
{
    ReactDOM.render(
        <GCOMv2 />,
        wrapper,
    );
}
