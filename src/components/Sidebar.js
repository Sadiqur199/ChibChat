import React from 'react'
import { AuthConsumer } from './AuthContext'

class Sidebar extends React.Component {
    render() {
        return (
            <aside>
                <AuthConsumer>
                    {({user}) => (
                        <React.Fragment>
                            <h2 className='text-center'>My Chats</h2>
                            {Object.keys(this.props.data).map(key => (
                                <a className={
                                    this.props.chatId === this.props.data[key].id ?
                                    'chat-link mx-auto active' : 'chat-link mx-auto'  
                                } key={this.props.data[key].id} href={`/${user.id}/chat/${this.props.data[key].id}`}>
                                    <span className='chat-link-title'>
                                        {
                                            this.props.data[key].usernames[0] === user.username ? 
                                            this.props.data[key].usernames[1] : this.props.data[key].usernames[0]
                                            }
                                    </span>
                                </a>
                            ))}
                        </React.Fragment>
                    )}
                </AuthConsumer>
                
            </aside>
        )
    }
}

export default Sidebar