import React from 'react';
import {Link} from 'react-router';

export default function Logo() {
    return (
        <Link to="/">
            <img id="logo-small" src="/public/assets/NBiTNetwork-Small.png" />
        </Link>
    )
}
