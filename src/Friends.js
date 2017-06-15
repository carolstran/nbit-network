import React from 'react';
import axios from './axios';
import {Link} from 'react-router';

export class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friendType: 'requests'
        };
        this.changeVisStatus = this.changeVisStatus.bind(this);
    }
    componentDidMount() {
        axios.get('/friendLists')
        .then((res) => {
            this.setState({
                friends: res.data.friends,
                requests: res.data.requests
            });
        });
    }
    changeVisStatus(e) {
        this.setState({
            friendType: e.target.options[e.target.selectedIndex].value
        });
    }
    render() {
        return (
            <div id="friends-wrapper">
                <div className="selector-wrapper">
                    <select id="friend-type-selector" onChange={this.changeVisStatus}>
                        <option value="requests">Pending Requests</option>
                        <option value="friends">My Friends</option>
                    </select>
                </div>
                <div className="page-wrapper">
                {this.state[this.state.friendType] && this.state[this.state.friendType].map(friend => {
                return (
                    <div className="single-friend">
                        <Link to={`/users/${friend.id}/`}>
                        <div className="user-image">
                            <img src={friend.profile_pic_url || "./public/assets/invader.png"} />
                        </div>
                        <h3 className="user-name">{friend.first_name} {friend.last_name}</h3>
                        </Link>
                    </div>
                )
                })}
                </div>
            </div>
        )
    }
}

// if
