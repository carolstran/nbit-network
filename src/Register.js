import React from 'react';
import axios from './axios';
import {Link, hashHistory} from 'react-router';

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        };
        this.handleUserInfo = this.handleUserInfo.bind(this);
        this.submitUserInfo = this.submitUserInfo.bind(this);
    }
    submitUserInfo(e) {
        axios.post('/register', {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password})
        .then((result) => {
            location.replace('/');
        }).catch((err) => {
            console.log('Unable to submit user info', err);
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
            <div id="registration-wrapper">
                {this.state.error && <div className="error-message">{'Something went wrong! Please try again.'}</div>}
                <h2 className="welcome-text">For people who identify partly or solely outside of the gender binary in the technology industry.</h2><br />
                <h2 className="welcome-text">Join the conversation:</h2><br />
                <div id="registration-form">
                    <input type="text" className="input-field" name="firstName" maxlength="250" onChange={this.handleUserInfo} placeholder="First Name" required /><br />
                    <input type="text" className="input-field" name="lastName" maxlength="250" onChange={this.handleUserInfo} placeholder="Last Name" required /><br />
                    <input type="text" className="input-field" name="email" maxlength="250" onChange={this.handleUserInfo} placeholder="Email" required /><br />
                    <input type="password" className="input-field" name="password" onChange={this.handleUserInfo} placeholder="Password" required /><br />
                    <button type="button" className="button" onClick={this.submitUserInfo}>&gt; SUBMIT</button>
                </div><br />
                <p className="redirect-to">{'If you already have an account, please '}<Link to="/login">{'log in'}</Link>.</p>
            </div>
        )
    }
}
