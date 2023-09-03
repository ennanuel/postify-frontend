import { useEffect, useContext, useState } from 'react';
import { Stories, Posts, Share } from '../../components';
import Rightbar from '../../components/layout/Rightbar';
import Leftbar from '../../components/layout/Leftbar';
import './home.scss';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';

const Home = () => {
  const { user: { id: user_id } } = useContext(AuthContext)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`${APIURL}/post/feed/${user_id}`)
      if(response.status !== 200) {
        alert('something went wrong')
      }
      else {
        const res = await response.json();
        setPosts(res || [])
      }
    }

    fetchPosts()
  }, [])

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
