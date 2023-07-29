import React from 'react'
import { AuthConsumer } from './AuthContext'

class UserForm extends React.Component {
    emailInput = React.createRef()
    passwordInput = React.createRef()
    redirect = (userId) => {
        this.props.history.push(`/${userId}/chats`)
    }    
    render() {
        return (
            <AuthConsumer>
                {({ signUp, logIn, user, authMessage }) => (
                    <React.Fragment>
                        {!user.uid ? (
                            <div className='sign-up-wrapper text-center'>
                                <h2>Sign in or create account</h2>
                                {authMessage ? <span>{authMessage}</span> : ''}
                                <form className='sign-up-form'>
                                    <div>
                                        <input ref={this.emailInput} type='text' maxLength="20" pattern='[A-Za-z0-9_]{1,}' name='email' placeholder='Username (a-z, 0-9 only)'/>
                                    </div>
                                    <div>
                                        <input ref={this.passwordInput} type='password' name='password' placeholder='Password'/>
                                    </div>
                                </form>
                                <div>
                                <button onClick={(e) => logIn(
                                    this.emailInput.current.value,
                                    this.passwordInput.current.value, e)}>Log in</button>
                                    <button onClick={(e) => signUp(
                                    this.emailInput.current.value,
                                    this.passwordInput.current.value, e)}>Sign Up</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => this.redirect(user.id)}>Go to my chats</button>
                        )}
                    </React.Fragment>
                )}
            </AuthConsumer>
        )
    }
}

export default UserForm