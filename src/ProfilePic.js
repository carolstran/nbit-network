import React from 'react';

export class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <img src={this.props.profilePicUrl} onClick={this.props.openProfilePicUpload} />
        )
    }
}
