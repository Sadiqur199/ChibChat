import React from 'react'

class ChatPreview extends React.Component {
    goToChat = () => {
        this.props.goToChat(this.props.user.id, this.props.data.id)
    }
    render() {
        return (
            <React.Fragment>
                <div className={
                    this.props.chatId === this.props.data.id ?
                    'chat-link mx-auto active' : 'chat-link mx-auto'  
                } onClick={this.goToChat}>
                    <span className='chat-link-title'>
                        {
                            this.props.data.usernames[0] === this.props.user.username ? 
                            this.props.data.usernames[1] : this.props.data.usernames[0]
                        }
                    </span>
                </div>
            </React.Fragment>
        )
    }
}

export default ChatPreview