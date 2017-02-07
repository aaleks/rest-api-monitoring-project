import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from './routes';

//style import
import './stylesheets/style-main.scss';


//create new Element on route render
function createElement(Component, props) {
    return <Component {...props} />
}

render(
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory} createElement={createElement}>
        {routes}
    </Router>,
    document.getElementById('root')
);
