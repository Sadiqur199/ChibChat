import React from 'react'
import { AuthConsumer } from './AuthContext'

class Header extends React.Component {
    render() {
        return (
            <AuthConsumer>
                {({user, logOut}) => (
                    <header>
                        <nav>
                            <div className='user-area'>
                                <a href={`/${user.id}/chats`}>All Chats</a>
                                <button onClick={(e) => logOut(e)}>Logout</button>
                            </div>
                            <h1>ChibChat</h1>
                        </nav>
                    </header>
                )}
            </AuthConsumer>
        )
    }
}

export default Header