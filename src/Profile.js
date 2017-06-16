import React from 'react';
import {ProfilePic} from './ProfilePic';
import {ProfilePicUpload} from './ProfilePicUpload';
import {Bio} from './Bio';
import {EditBio} from './EditBio';
import {App} from './App';

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.toggleEditBio = this.toggleEditBio.bind(this);
     }
    toggleEditBio() {
        this.setState({
            showEditBio: !this.state.showEditBio
        });
    }
    render() {
        return (
            <div className="profile-wrapper">
                <div className="user-profile-pic">
                    <ProfilePic profilePicUrl={this.props.profilePicUrl} onClick={this.props.openProfilePicUpload} />
                </div>
                <div className="user-info">
                    <div className="full-name">
                        <h2>{this.props.firstName} {this.props.lastName}</h2>
                    </div>
                    <div className="profile-bio">
                        {this.state.showEditBio ? <EditBio toggleEditBio={this.toggleEditBio} updateBio={this.props.updateBio} /> : <Bio bio={this.props.bio} toggleEditBio={this.toggleEditBio} />}
                    </div>
                </div>
            </div>
        )
    }
}
