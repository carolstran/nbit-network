import React from 'react';
import axios from './axios';
import {Link} from 'react-router';

export class MenuModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout(e) {
        e.preventDefault();
        axios.get('/logout').then((res) => {
            location.replace('/');
        });
    }
    render() {
        return (
            <div className="modal" className="modal-wrapper">
                <div className="modal-overlay" onClick={() => {this.props.closeModal()}}></div>
                <div id="menu-wrapper">
                    <p className="close-modal" onClick={() => {this.props.closeModal()}}>X</p>
                    <h2 id="menu-title">Menu</h2>
                    <hr className="modal-line"></hr><br />
                    <Link to="/friends/" onClick={() => {this.props.closeModal()}}>Friends and Requests</Link><br /><br />
                    <Link to="/onlinenow/" onClick={() => {this.props.closeModal()}}>Online Now</Link><br /><br />
                    <Link to="/chat/" onClick={() => {this.props.closeModal()}}>Chat</Link><br /><br />
                    <Link to="/" onClick={() => {this.props.closeModal()}}>Edit Profile</Link><br /><br />
                    <Link target="_blank" to="https://github.com/hacksmiths/code-of-conduct" onClick={() => {this.props.closeModal()}}>Code of Conduct</Link><br /><br />
                    <Link onClick={this.handleLogout}>Logout</Link>
                </div>
            </div>
        )
    }
}
