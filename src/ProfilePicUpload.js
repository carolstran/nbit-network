import React from 'react';
import {Link, hashHistory} from 'react-router';
import axios from './axios';
import {App} from './App'

export class ProfilePicUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handlePicUpload = this.handlePicUpload.bind(this);
        this.handlePicInfo = this.handlePicInfo.bind(this);
    }
    handlePicUpload(e) {
        let file = this.state.file;
        var formData = new FormData();
        formData.append('file', file);

        axios.post('/uploadFile', formData)
        .then((result) => {
            if (result.data.profilePicUrl) {
                return this.props.setImage(result.data.profilePicUrl);
            }
        });
    }
    handlePicInfo(e) {
        this.setState({
            file: e.target.files[0]
        });
    }
    render() {
        return (
            <div className="modal" className="modal-wrapper">
                <div className="modal-overlay"></div>
                <div id="upload-form">
                    <p className="close-modal" onClick={() => {this.props.closeModal()}}>X</p>
                    <h2 id="modal-title">Change Your Profile Pic</h2>
                    <input type="file" className="button" onChange={this.handlePicInfo} /><br />
                    <button className="button" type="submit" onClick={this.handlePicUpload}>&gt; UPLOAD</button>
                </div>
            </div>
        )
    }
}
