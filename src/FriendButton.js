import React from 'react';
import axios from './axios';
import {OtherUserProfile} from './OtherUserProfile';

export class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeFriendStatus = this.changeFriendStatus.bind(this);
    }
    componentDidMount() {
        axios.get(`/getFriendStatus?otherUserId=${this.props.otherUserId}`)
        .then((res) => {
            if (res.data) {
                this.setState({
                    friendStatus: res.data.action,
                    actionUrl: res.data.actionUrl
                });
            }
        });
    }
    changeFriendStatus() {
        axios.post(this.state.actionUrl, {otherUserId: this.props.otherUserId})
        .then((res) => {
            this.setState({
                friendStatus: res.data.action,
                actionUrl: res.data.actionUrl
            })
        });
    }
    render() {
        return (
            <button className="button" onClick={this.changeFriendStatus}>&gt; {this.state.friendStatus}</button>
        )
    }
}
