import React from 'react';
import {App} from './App';
import {Profile} from './Profile';

export function Bio(props) {
    return (
        <div id="bio-wrapper">
            <p className="actual-bio">{props.bio}</p>
            <button className="button" onClick={props.toggleEditBio}>&gt; Edit Your Bio</button>
        </div>
    )
}
