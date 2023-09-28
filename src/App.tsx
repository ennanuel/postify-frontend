import { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Layout } from './components'
import { Home, Register, Login, Profile, Post, Friends, Groups, Group, Story, Shorts, Message, Channels, Settings } from './pages';
import { ProfilePosts, ProfilePhotos, ProfileVideos, ProfileFriends, EditProfile } from "./scenes/profile"
import { FriendsList, FriendRequests, FriendSuggestions, Friends as RealFriends, CustomList, SentRequests, CustomListSingle } from './scenes/friend';
import { AuthContext } from './context/authContext';
import { GroupsList, Group as GroupInfo, GroupsPost, CreateGroup, EditGroup, GroupsDiscover, GroupMembers, GroupPhotos, GroupVideos, GroupInvites, GroupInvitedMembers } from './scenes/group';
import { ChannelFeed, ChannelExplore, ChannelDetails, ChannelsAll, CreateChannel, EditChannel } from './scenes/channels/';
import { EditPost } from './scenes/post';

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
              <Route path="/edit_profile/:id" element={<EditProfile />} />
              <Route path="/edit_post/:id" element={<EditPost />} />
            <Route path="*" element={<Home />} />
            <Route path="/profile" element={<Profile />}>
              <Route path=":id" element={<ProfilePosts />} />
              <Route path="photos/:id" element={<ProfilePhotos />} />
              <Route path="videos/:id" element={<ProfileVideos />} />
                <Route path="friends/:id" element={<ProfileFriends />} />
            </Route>
            <Route path="/friends" element={<Friends />}>
              <Route path="all" element={<FriendsList />} />
              <Route path="requests" element={<FriendRequests />} />
              <Route path="sent" element={<SentRequests />} />
              <Route path="suggestions" element={<FriendSuggestions />} />
              <Route path="list" element={<RealFriends />} />
              <Route path="custom" element={<CustomList />} />
              <Route path="custom/:id" element={<CustomListSingle />} />
            </Route>
            <Route path="/groups" element={<Groups />}>
              <Route path="posts" element={<GroupsPost />} />
              <Route path="list" element={<GroupsList />} />
                <Route path="create" element={<CreateGroup />} />
                <Route path="edit_group/:id" element={<EditGroup />} />
              <Route path="discover" element={<GroupsDiscover />} />
              <Route path="invites" element={<GroupInvites />} />
            </Route>
              <Route path="group" element={<Group />}>
                <Route path=":id" element={<GroupInfo />} />
                <Route path="members/:id" element={<GroupMembers />} />
                <Route path="photos/:id" element={<GroupPhotos />} />
                <Route path="videos/:id" element={<GroupVideos />} />
                <Route path="invites/:id" element={<GroupInvitedMembers />} />
              </Route>
            <Route path="/channels" element={<Channels />}>
              <Route path="feed" element={<ChannelFeed />} />
              <Route path="explore" element={<ChannelExplore />} />
              <Route path="list" element={<ChannelsAll />} />
                <Route path="info/:id" element={<ChannelDetails />} />
                <Route path="create" element={<CreateChannel />} />
                <Route path="edit/:id" element={<EditChannel />} />
            </Route>
            <Route path="/post/:id" element={<Post />} />
            <Route path="/story/:id" element={<Story />} />
            <Route path="/short/:id" element={<Shorts />} />
              <Route path="/message" element={<Message />} />
              <Route path="/settings" element={<Settings />} />
          </Route>
        }
      </Routes>
    </div>
  )
}

export default App
