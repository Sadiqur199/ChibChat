import React from 'react'
import { firebaseAuth, usersRef } from '../firebase'
import { withRouter } from 'react-router-dom'

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
    state = {
        user: {},
        authMessage: ''
    }
    UNSAFE_componentWillMount() {
        firebaseAuth.onAuthStateChanged(async (user) => {
            if (user) {
                this.setState({user: {
                    uid: user.uid,
                    username: user.email.replace('@chibib.co.uk', '')
                }})
                const userObject = await usersRef.where('userObj.userId', '==', user.uid).get()
                let userObjId
                userObject.forEach(user => {
                    userObjId = user.id
                })
                if (userObjId !== undefined) {
                    this.setState({user: {
                        uid: user.uid,
                        username: user.email.replace('@chibib.co.uk', ''),
                        id: userObjId
                    }})
                }
            } else {
                this.setState({ user: {} })
            }
        })
    }
    signUp = async (email, password, e) => {
        try {
            e.preventDefault()
            await firebaseAuth.createUserWithEmailAndPassword(`${email}@chibib.co.uk`, password)
            const userObj = {
                userId: this.state.user.uid,
                username: email.replace('@chibib.co.uk', '')
            }
            const userObjId = await usersRef.add({ userObj })
            this.setState(prevState => ({
                user: {
                    ...prevState.user,
                    id: userObjId.id
                }
            }))
            this.props.history.push(`/${this.state.user.id}/chats`)
        } catch(err) {
            this.setState({ authMessage: err.message })
        }
    }
    logIn = async (email, password, e) => {
        try {
            e.preventDefault()
            await firebaseAuth.signInWithEmailAndPassword(`${email}@chibib.co.uk`, password)
            await usersRef.where('userObj.userId', '==', this.state.user.uid).get()
            this.props.history.push(`/${this.state.user.id}/chats`)
        } catch(err) {
            this.setState({ authMessage: err.message })
        }
    }
    logOut = (e) => {
        try {
            e.preventDefault()
            firebaseAuth.signOut()
            this.setState({
                user: {}
            })
            this.props.history.push(`/`)
        } catch(err) {
            this.setState({ authMessage: err.message })
        }
    }
    render() {
        return (
            <AuthContext.Provider 
            value={{ 
                user: this.state.user, signUp: this.signUp,
                logIn: this.logIn, logOut: this.logOut, authMessage: this.state.authMessage
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer

export default withRouter(AuthProvider)
export { AuthConsumer }