import React from 'react';
import axios from './axios';
import {Link, hashHistory} from 'react-router';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.handleUserInfo = this.handleUserInfo.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }
    loginUser(e) {
        axios.post('/login', {email: this.state.email, password: this.state.password})
        .then((result) => {
            location.replace('/');
        }).catch((err) => {
            console.log('Unable to login user info', err);
            this.setState({
                error: true
            });
        });
    }
    handleUserInfo(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    render() {
        return (
            <div id="login-wrapper">
                {this.state.error && <div className="error-message">{'Something went wrong! Please try again.'}</div>}
                <h2 className="welcome-text">Please log in.</h2><br />
                <div id="login-form">
                    <input type="text" className="input-field" name="email" onChange={this.handleUserInfo} placeholder="Email" required /><br />
                    <input type="password" className="input-field" name="password" onChange={this.handleUserInfo} placeholder="Password" required /><br />
                    <button type="button" className="button" onClick={this.loginUser}>&gt; LOGIN</button><br />
                </div><br />
                <p className="redirect-to">{'Not a member? Register '}<Link to="/">{'here'}</Link>.</p>
            </div>
        )
    }
}
