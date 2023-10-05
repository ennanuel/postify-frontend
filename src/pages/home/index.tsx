import { useEffect, useContext, useState } from 'react';
import { Stories, Posts, Share } from '../../components';
import Rightbar from '../../components/layout/Rightbar';
import Leftbar from '../../components/layout/Leftbar';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { fetchOptions } from '../../assets/data/data';

const Home = () => {
  const { user, friend, group, socket } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    const response = await fetch(`${APIURL}/post/feed/${user.id}`, fetchOptions)
    if(response.status !== 200) {
      alert('something went wrong')
    }
    else {
      const res = await response.json();
      setPosts(res || [])
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [])

  useEffect(() => { 
    socket.removeAllListeners('post-event');

    socket.on('post-event', ({ user_id, group_id }: { user_id: string, group_id?: string }) => {
      if (user_id == user.id || (friend.includes(user_id) && !group_id) || group.includes(group_id || '')) {
        alert('someone posted something');
      }
    })
  }, [socket, friend, group])

  return (
    <div className="home grid grid-cols-1 md:grid-cols-[300px,1fr] lg:grid-cols-[300px,1fr,300px] md:gap-4 lg:gap-6 md:pr-4 lg:p-0">
      <Leftbar />
      <div className="center">
        <div className="flex flex-col-reverse lg:flex-col">
          <Stories />
          <Share />
        </div>
        <Posts posts={posts} />
      </div>
      <Rightbar />
    </div>
  )
}

export default Home
