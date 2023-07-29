import React from 'react'
import Sidebar from './Sidebar'
import Message from './Message'
import {withRouter} from 'react-router-dom'
import { AuthConsumer } from './AuthContext'
import { messagesRef } from '../firebase'
import { chatsRef } from '../firebase'

class Chat extends React.Component {
    state = {
        currentMessages: [],
        currentChat: {}
    }
    componentDidMount() {
        this.getChat(this.props.match.params.chatId)
        this.fetchMessages(this.props.match.params.chatId)
        this.props.getChats(this.props.match.params.userId)
    }
    getChat = async chatId => {
        try {
            const chat = await chatsRef.doc(chatId).get()
            this.setState({ currentChat: chat.data().chat })
            console.log(this.state.currentChat)
        } catch(err) {
            console.error('error getting chat ', err)
        }
    }
    fetchMessages = chatId => {
        try {
            messagesRef.where('message.chat', '==', chatId)
                .orderBy('message.createdAt')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        const doc = change.doc
                        const message = {
                            id: doc.id,
                            text: doc.data().message.text,
                            user: doc.data().message.user,
                            createdAt: doc.data().message.createdAt.seconds * 1000
                        }
                        if (change.type === 'added') {
                            this.setState({ currentMessages: [...this.state.currentMessages, message] })
                        }
                        if (change.type === 'removed') {
                            this.setState({
                                currentMessages: [
                                    ...this.state.currentMessages.filter(card => {
                                        return card.id !== change.doc.id
                                    })
                                ]
                            })
                        }
                    })
                })
        } catch(err) {
            console.error('error fetching messages: ', err)
        }
    }
    createNewMessage = async (e, username) => {
        try {
            e.preventDefault()
            const message = {
                text: this.nameInput.current.value.trim(),
                chat: this.props.match.params.chatId,
                createdAt: new Date(),
                user: username
            }
            if (message.text && message.chat) {
                await messagesRef.add({ message })
            }
            this.nameInput.current.value = ''
        } catch(error) {
            console.error('error creating message: ', error)
        }
    }
    goToChat = chatId => {
        this.props.history.push(`/chat/${chatId}`)
    }
    scrollDown = () => {
        this.scrollE.current.scrollIntoView();
    }
    deleteChat = () => {
        this.props.deleteChat(this.props.match.params.chatId)
    }
    scrollE = React.createRef()
    nameInput = React.createRef()
    render() {
        return (
            <AuthConsumer>
                {({user}) => (
                    <main>
                        {Object.keys(this.state.currentChat).length !== 0 ? (
                            <React.Fragment>
                                {this.state.currentChat.users.includes(user.id) ? (
                                    <button onClick={this.deleteChat}>Delete chat</button>
                                ) : (<span></span>)}
                            </React.Fragment>
                        ) : (<span></span>)}
                        {this.props.isDesktop ? (
                            <Sidebar data={this.props.data} goToChat={this.goToChat}
                            user={user} chatId={this.props.match.params.chatId}/>
                        ) : (<React.Fragment></React.Fragment>)}
                        {Object.keys(this.state.currentChat).length !== 0 ? (
                            <React.Fragment>
                                {this.state.currentChat.users.includes(user.id) ? (
                                    <React.Fragment>
                                        <div>
                                            {Object.keys(this.state.currentMessages).map(key => (
                                                <Message scrollDown={this.scrollDown} data={this.state.currentMessages[key]} 
                                                key={this.state.currentMessages[key].id} />
                                            ))}
                                        </div>
                                        </React.Fragment>
                                ) : (<span>You do not have access to this chat</span>)}
                            </React.Fragment>
                        ) : (<span></span>)}
                        <div ref={this.scrollE} ></div>
                        {Object.keys(this.state.currentChat).length !== 0 ? (
                            <React.Fragment>
                                {this.state.currentChat.users.includes(user.id) ? (
                                    <React.Fragment>
                                        <div className='chat-form-container' >
                                            <form className='chat-form' onSubmit={(e) => this.createNewMessage(e, user.username)}>
                                                <input type='text' name='message' placeholder='Message...' ref={this.nameInput}
                                                autoComplete='off'/>
                                                <button type='submit'>Send</button>
                                            </form>
                                        </div>
                                    </React.Fragment>
                                ) : (<span></span>)}
                            </React.Fragment>
                        ) : (<span></span>)}
                    </main>
                )}
            </AuthConsumer>
        )
    }
}

export default withRouter(Chat)