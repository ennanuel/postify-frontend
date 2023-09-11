import { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Layout } from './components'
import { Home, Register, Login, Profile, Post, Friends, Groups, Group, Story, Shorts, Message, Channels } from './pages';
import { ProfilePosts, ProfilePhotos, ProfileVideos, ProfileFriends } from "./scenes/profile"
import { FriendsList, FriendRequests, FriendSuggestions, Friends as RealFriends, CustomList, SentRequests, CustomListSingle } from './scenes/friend';
import { AuthContext } from './context/authContext';
import { GroupsList, Group as GroupInfo, GroupsPost, CreateGroup, GroupsDiscover, GroupMembers, GroupPhotos, GroupVideos, GroupInvites, GroupInvitedMembers } from './scenes/group';
import { ChannelFeed, ChannelExplore, ChannelDetails, ChannelsAll, CreateChannel } from './scenes/channels/';

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
          !Boolean(user.name) ?
          <>
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Login />} />
          </> :
          <Route element={<Layout />}>
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
            </Route>
            <Route path="/post/:id" element={<Post />} />
            <Route path="/story" element={<Story />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/message" element={<Message />} />
          </Route>
        }
      </Routes>
    </div>
  )
}

export default App
