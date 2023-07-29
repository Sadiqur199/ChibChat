import React from 'react'
import ChatPreview from './ChatPreview'
import {withRouter} from 'react-router-dom'
import { AuthConsumer } from './AuthContext'

class AllChats extends React.Component {
    componentDidMount() {
        this.props.getChats(this.props.match.params.userId)
    }
    createNewChat = async (e, userId, username) => {
        await this.props.createNewChat(e, userId, username, this.userInput.current.value)
        this.userInput.current.value = ''
    }
    goToChat = (userId, chatId) => {
        this.props.history.push(`/${userId}/chat/${chatId}`)
    }
    userInput = React.createRef()
    render() {
        return (
            <AuthConsumer>
                {({user}) => (
                    <React.Fragment>
                        {user.id === this.props.match.params.userId ? (
                            <React.Fragment>
                                <div className='all-chats-header text-center'>
                                    <h1>My chats</h1>
                                    <form className='new-chat-form' autoComplete='off' onSubmit={(e) => this.createNewChat(e, this.props.match.params.userId, user.username)}>
                                        <h2>Create new chat</h2>
                                        <input placeholder='Username of new chat' ref={this.userInput}/>
                                        <button type='submit'>Create chat</button>
                                    </form>
                                </div>
                                <div className='all-chats-container'>
                                    {Object.keys(this.props.chats).map(key => (
                                        <ChatPreview key={this.props.chats[key].id} data={this.props.chats[key]} 
                                        goToChat={this.goToChat} user={user} chatId={''} />
                                    ))}
                                </div>
                            </React.Fragment>
                        ) : (<div className='text-center'><a href={`/${user.id}/chats`} className='go'>Go to my chats</a></div>)}
                    </React.Fragment>
                )}
            </AuthConsumer>
        )
    }
}

export default withRouter(AllChats)