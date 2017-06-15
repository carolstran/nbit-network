import React from 'react';
import axios from './axios';
import {App} from './App';
import {Profile} from './Profile';

export class EditBio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSaveBio = this.handleSaveBio.bind(this);
        this.handleEditBio = this.handleEditBio.bind(this);
        this.closeEditBio = this.closeEditBio.bind(this);
    }
    handleSaveBio(e) {
        axios.post('/updateBio', { bio: this.state.bio })
        .then((res) => {
            if (res.data.success) {
                this.props.updateBio(res.data);
                this.props.toggleEditBio();
            }
        });
    }
    handleEditBio(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    closeEditBio(e) {
        this.props.toggleEditBio();
    }
    render() {
        return (
            <div id="edit-bio-wrapper">
                <textarea id="bio-input" type="text" name="bio" maxlength="250" value={this.state.bio} onChange={this.handleEditBio}></textarea><br />
                <button className="button" type="submit" onClick={this.handleSaveBio}>&gt; SAVE</button>
                <button className="button" onClick={this.closeEditBio}>&gt; NEVERMIND</button>
            </div>
        )
    }
}
