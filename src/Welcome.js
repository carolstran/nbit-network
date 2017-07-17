import React from 'react';

export default function Welcome(props) {
    console.log('We loaded welcome');
    return (
        <div id="welcome-wrapper">
            <img id="logo-large" src="./public/assets/NBiTNetwork-Large.png" />
            {props.children}
        </div>
    );
}
