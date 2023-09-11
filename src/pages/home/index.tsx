import { useEffect, useContext, useState } from 'react';
import { Stories, Posts, Share } from '../../components';
import Rightbar from '../../components/layout/Rightbar';
import Leftbar from '../../components/layout/Leftbar';
import './home.scss';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';

const Home = () => {
  const { user, friend, group, socket } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    const response = await fetch(`${APIURL}/post/feed/${user.id}`)
    if(response.status !== 200) {
      alert('something went wrong')
    }
    else {
      const res = await response.json();
      setPosts(res || [])
    }
  }

  useEffect(() => {
    fetchPosts()

    socket.on('post-event', ({ user_id, group_id }: { user_id: string, group_id?: string }) => {
      if (user_id == user.id || (friend.includes(user_id) && !group_id) || group.includes(group_id || '')) {
        alert('someone posted something');
      }
    })
  }, [friend, group])

  return (
    <div className="home">
      <Leftbar />
      <div className="center">
        <Stories />
        <Share />
        <Posts posts={posts} />
      </div>
      <Rightbar />
    </div>
  )
}

export default Home
