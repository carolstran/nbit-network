import React from 'react';
import axios from './axios';
import {ProfilePic} from './ProfilePic';
import {FriendButton} from './FriendButton';

export class OtherUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get(`/user/${this.props.params.id}`)
        .then((res) => {
            const { id, firstName, lastName, profilePicUrl, bio } = res.data;
            this.setState({ id, firstName, lastName, profilePicUrl, bio });
        });
    }
    render() {
        return (
            <div className="profile-wrapper">
                <div className="user-profile-pic">
                    <ProfilePic profilePicUrl={this.state.profilePicUrl} />
                </div>
                <div className="user-info">
                    <div className="full-name">
                        <h2>{this.state.firstName} {this.state.lastName}</h2>
                    </div>
                    <div className="profile-bio">
                        <p>{this.state.bio}</p>
                    </div>
                    <FriendButton otherUserId={this.props.params.id} />
                </div>
            </div>
        )
    }
}
