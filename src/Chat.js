import React from 'react';
import axios from './axios';
import {Link} from 'react-router';

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.keyDown = this.keyDown.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        axios.get('/chatMessages')
        .then((res) => {
            this.setState(res.data);
            this.props.socket.on('updateChat', (chatMessages) => {
                this.setState({ chatMessages: chatMessages })
            });
        });
    }
    keyDown(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            this.submitMessage(e);
        }
    }
    submitMessage(e) {
        if (this.state.message != '') {
            let messageData = {
                id: this.props.id,
                firstName: this.props.firstName,
                lastName: this.props.lastName,
                profilePicUrl: this.props.profilePicUrl,
                // timestamp: new Date().toLocaleString(),
                content: this.state.message
            };
                this.props.socket.emit('chat', messageData);
                this.setState({ content: this.state.message });
            } else {
                return;
            }
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    render() {
        let chatMessages;
        if (this.state.chatMessages) {
            chatMessages = this.state.chatMessages.map((chatMessage) => {
                return (
                    <div id="chat-wrapper">
                        <Link to={`/users/${chatMessage.id}`}>
                            <img className="chat-image" src={chatMessage.profilePicUrl || "./public/assets/invader.png"} />
                        </Link>
                        <div className="chat-line">
                            <h3 className="chat-name">{chatMessage.firstName} {chatMessage.lastName}</h3><p className="chat-time">at {chatMessage.timestamp}</p><br />
                            <p className="chat-content">{chatMessage.content}</p>
                        </div>
                    </div>
                )
            });
        } else {
            return (
                <h3 id="no-chat">Seems quiet in here. Get the conversation going below!</h3>
            )
        }

        return (
            <div id="overall-chat-wrapper">
            <h2 id="chat-title">Welcome to our community chat.<br /> What's on your mind?</h2>
            {chatMessages}
            <div id="chat-input-wrapper">
                <textarea className="chat-textarea" name="message" value={this.state.message} onChange={this.handleChange} onKeyDown={this.keyDown} />
                <button id="send-button" className="button" onClick={this.submitMessage}>&gt; SEND</button>
            </div>
            </div>
        )
    }
}
