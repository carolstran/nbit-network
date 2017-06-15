import React from 'react';
import {Router, Route, Link, IndexRoute, hashHistory} from 'react-router';
import axios from './axios';
import Logo from './Logo';
import {ProfilePic} from './ProfilePic';
import {ProfilePicUpload} from './ProfilePicUpload';
import {Bio} from './Bio';
import {EditBio} from './EditBio';
import {Menu} from './Menu';
import {MenuModal} from './MenuModal';
import * as io from 'socket.io-client';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePicUrl: "",
            showMenuModal: false,
            showProfilePicUpload: false
        };
        let socket = io.connect();
        socket.on('connect', function() {
            axios.get(`/connected/${socket.id}`);
        });
        this.socket = socket;
        this.setImage = this.setImage.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentDidMount() {
        axios.get('/userProfile').then((res) => {
            const { id, firstName, lastName, profilePicUrl, bio } = res.data;
            this.setState({ id, firstName, lastName, profilePicUrl, bio });
        });
    }
    openMenuModal() {
        this.setState({
            showMenuModal: true
        });
    }
    setImage(url) {
        this.setState({
            profilePicUrl: url,
            showProfilePicUpload: false
        });
    }
    openProfilePicUpload() {
        this.setState({
            showProfilePicUpload: true
        });
    }
    closeModal() {
        this.setState({
            showMenuModal: false,
            showProfilePicUpload: false
        });
    }
    updateBio(data) {
        this.setState({
            bio: data.bio,
            showEditBio: false
        });
    }
    render() {
        const { id, firstName, lastName, profilePicUrl, bio } = this.state;
        const date = new Date().getTime();
        const profilePic = this.state.profilePicUrl
            ? `${this.state.profilePicUrl}?${date}`
            : `./public/assets/invader.png?${date}`;

        const children = React.cloneElement(this.props.children, { id, firstName, lastName, profilePicUrl: profilePic, bio, updateBio: this.updateBio, socket: this.socket });

        return (
            <div id="main-page">
                <div id="header">
                    <Logo />
                    <div className="current-user">
                        <ProfilePic profilePicUrl={profilePic} openProfilePicUpload={this.openProfilePicUpload.bind(this)}/>
                    </div>
                    <Menu openMenuModal={this.openMenuModal.bind(this)} />
                    <hr className="header-line" />
                {this.state.showProfilePicUpload && <ProfilePicUpload closeModal={this.closeModal} setImage={this.setImage} />}
                {this.state.showMenuModal && <MenuModal closeModal={this.closeModal} />}
                </div>
                {children}
            </div>
        )
    }
}
