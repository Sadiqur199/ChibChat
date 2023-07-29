import React from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Chat from './components/Chat';
import PageNotFound from './components/PageNotFound';
import AllChats from './components/AllChats';
import AuthProvider from './components/AuthContext';
import { chatsRef, messagesRef, usersRef } from './firebase';
import UserForm from './components/UserForm';

class App extends React.Component {
  state = {
    isDesktop: false,
    chats: []
  }
  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate.bind(this));
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 1000 });
  }

  createNewChat = async (e, userId, username, input) => {
    try {
        e.preventDefault()
        const user2 = await usersRef.where('userObj.username', '==', input).get()
        let user2Id
        let user2Name
        user2.forEach(user => {
          user2Id = user.id
          user2Name = user.data().userObj.username
        })
        console.log(user2Name)
        if (!user2Id || !user2Name) {
          console.log(user2Id)
          return alert('user not found')
        }
        console.log(user2Id, userId)
        const chat = {
          users: [userId, user2Id],
          usernames: [username, user2Name],
          createdAt: new Date()
        }
        if (chat.users.length === 2) {
            const newChat = await chatsRef.add({ chat })
            const chatObj = {
              id: newChat.id,
              ...chat
            }
            this.setState({ chats: [...this.state.chats, chatObj] })
        }
    } catch(error) {
        console.error('error creating chat: ', error)
    }
  }
  
  getChats = async userId => {
    try {
      this.setState({ chats: [] })
      const chats = await chatsRef.where('chat.users', 'array-contains', userId).orderBy('chat.createdAt').get()
      chats.forEach(chat => {
        const data = chat.data().chat
        const chatObj = {
          id: chat.id,
          ...data
        }
        this.setState({ chats: [...this.state.chats, chatObj] })
      })
    } catch(error) {
      console.error('Error getting chats: ', error)
    }
  }
  deleteChat = async chatId => {
    try {
      const messages = await messagesRef.where('message.chat', '==', chatId).get()
      if (messages.docs.length !== 0) {
        messages.forEach(message => {
          message.ref.delete()
        })
      }

      const chat = await chatsRef.doc(chatId)
      this.setState({
        chats: [
          ...this.state.chats.filter(chat => {
            return chat.id !== chatId
          })
        ]
      })
      chat.delete()
    } catch(error) {
      console.error('error deleting chat: ', error)
    }
  }
  render() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Switch>
            <Route exact path='/' render={() => (
              <UserForm/>
            )}/>
            <Route exact path='/:userId/chat/:chatId' render={(props) => (
              <Chat deleteChat={this.deleteChat} {...props} data={this.state.chats} isDesktop={this.state.isDesktop} getChats={this.getChats} />
            )} />
            <Route exact path='/:userId/chats' render={(props) => (
              <AllChats createNewChat={this.createNewChat} {...props} chats={this.state.chats} getChats={this.getChats} />
            )}/>
            <Route component={PageNotFound} />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    )
  }
}

export default App;
