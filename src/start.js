import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, hashHistory, browserHistory} from 'react-router';
import axios from './axios';

import Welcome from './Welcome';
import {Login} from './Login';
import {Register} from './Register';

import {App} from './App';
import {Profile} from './Profile';
import {OtherUserProfile} from './OtherUserProfile';
import {Friends} from './Friends';

import {OnlineNow} from './OnlineNow';
import {Chat} from './Chat';

let elem;
console.log('This is running');
const loggedOutRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Register} />
        </Route>
    </Router>
)

const loggedInRouter = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="/users/:id/" component={OtherUserProfile} />
            <Route path="/friends/" component={Friends} />
            <Route path="/onlinenow/" component={OnlineNow} />
            <Route path="/chat/" component={Chat} />
            <IndexRoute component={Profile} />
        </Route>
    </Router>
)

if (location.pathname == '/welcome') {
    elem = loggedOutRouter;
} else {
    elem = loggedInRouter;
}

ReactDOM.render(elem, document.getElementById('main'));
