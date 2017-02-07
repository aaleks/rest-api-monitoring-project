import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './containers/App';
import RestMonitoringPage from './containers/RestMonitoringPage/RestMonitoringPage'
import QuickChecker from './containers/QuickChecker/QuickChecker'


export default (
    <Route path="/" component={App}>

        <IndexRoute component={RestMonitoringPage}/>

        <Route path="/appchecker" component={QuickChecker}/>

    </Route>
); 