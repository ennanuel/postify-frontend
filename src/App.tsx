import { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Layout } from './components'
import { Home, Register, Login, EditProfile, Post, Story, Shorts, Message, Settings, Search } from './pages';
import ProfileScenes from "./scenes/profile"
import FriendScenes from './scenes/friend';
import GroupsScenes from './scenes/groups';
import GroupScenes from './scenes/group';
import ChannelScenes from './scenes/channels/';
import { EditPost } from './scenes/post';
import { AuthContext } from './context/authContext';

function App() {
  const { user, socket } = useContext(AuthContext)

  useEffect(() => { 
    socket.on('connect', () => {
      socket.on('event-error', ({ message }) => alert(`Socket error: ${message}!`))
    })
  }, [])

  return (
    <div className="main">
      <Routes>
        {
          !Boolean(user.id) ?
            <>
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<Login />} />
            </> :
            <Route element={<Layout />}>
              <Route path="*" element={<Home />} />
              <Route path="/message" element={<Message />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search/:q" element={<Search />} />
              <Route path="/story/:id" element={<Story />} />
              <Route path="/post/:post_id" element={<Post />} />
              <Route path="/edit_post/:id" element={<EditPost />} />
              <Route path="/short/:post_id/:queue_type" element={<Shorts />} />
              <Route path="/edit_profile/:id" element={<EditProfile />} />
              <Route path="/channels/*" element={<ChannelScenes />} />
              <Route path="/friends/*" element={<FriendScenes />} />
              <Route path="/group/*" element={<GroupScenes />} />
              <Route path="/groups/*" element={<GroupsScenes />} />
              <Route path="/profile/*" element={<ProfileScenes />} />
            </Route>
        }
      </Routes>
    </div>
  )
}

export default App
