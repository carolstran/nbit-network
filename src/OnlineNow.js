import React from 'react';
import axios from './axios';
import {Link} from 'react-router';

export class OnlineNow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { onlineUsers: '' };
    }
    componentDidMount() {
        axios.get('/onlineUsers').then((res) => {
            this.setState({
                onlineUsers: res.data.onlineUsers
            });
        });
    }
    render() {
        console.log(this.state.onlineUsers);
        if (this.state.onlineUsers) {
            return (
                <div className="online-page-wrapper">
                <h2 id="onlinenow-title">Online Now</h2><br /><br />
                {this.state.onlineUsers && this.state.onlineUsers.map(user => {
                    return (
                        <div id="online-users" className="single-user">
                        <Link to={`/users/${user.id}/`}>
                        <div className="user-image">
                        <img src={user.profile_pic_url || "./public/assets/invader.png"} />
                        </div>
                        <h3 className="user-name">{user.first_name} {user.last_name}</h3>
                        </Link>
                        </div>
                    )
                })}
                </div>
            )
        } else {
            return (
                <h2 id="noone-online-message">Looks like no one is online ¯\_(ツ)_/¯</h2>
            )
        }
    }
}
