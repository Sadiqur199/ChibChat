import React from 'react'
import { AuthConsumer } from './AuthContext'

class Message extends React.Component {
    componentDidMount() {
        this.props.scrollDown()
    }
    getDate = date => {
        return (new Date(parseInt(date))).toLocaleDateString()
    }
    render() {
        return (
            <AuthConsumer>
                {({user}) => (
                    <React.Fragment>
                        {this.props.data.user === user.username ? (
                            <div className='message-container by-user'>
                                <div className='message'>
                                    <div className='message-header'>
                                        <small>{this.getDate(this.props.data.createdAt)}</small>
                                        <b>You</b>
                                    </div>
                                    <p>{this.props.data.text}</p>
                                </div>
                            </div>
                        ) : (
                            <div className='message-container'>
                                <div className='message'>
                                    <div className='message-header'>
                                        <b>{this.props.data.user}</b>
                                        <small>{this.getDate(this.props.data.createdAt)}</small>
                                    </div>
                                    <p>{this.props.data.text}</p>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                )}
            </AuthConsumer>
        )
    }
}

export default Message