import { useEffect, useContext, useState } from 'react';
import Post from './Post'
import './posts.scss'
import { AuthContext } from '../../context/authContext';

type PostType = {
  id: string;
  name: string
  user_id: number;
  profile_pic: string;
  post_type: string;
  post_bg: 'none' | 'blue' | 'red' | 'white' | 'black';
  files: string[];
  post_desc: string;
  post_likes: number;
  post_comments: number;
  shares: number;
  liked_post: boolean;
  last_updated: string;
  date_posted: string;
  is_yours: boolean;
  group_name?: string;
  group_id?: string;
}

const Posts = ({ posts = [] }: { posts?: PostType[] }) => {
  const { user, socket } = useContext(AuthContext)
  const [dynamicPosts, setDynamicPosts] = useState(posts)

  useEffect(() => {
    setDynamicPosts( posts )
  }, [posts])
    
  useEffect(() => { 
    socket.on('someone-liked', ({ id, likes, user_id, type }: { id: string, likes: number, user_id: string, type: string }) => {
      setDynamicPosts((prev) => prev.map( post => post.id == id ?
        ({
          ...post,
          post_likes: likes,
          liked_post: type == 'add' ? user.id == user_id || post.liked_post : user.id != user_id && post.liked_post
        }) : post
      ))
    })

    socket.on('someone-commented', ({ post_id, comments }) => {
      setDynamicPosts( prev => prev.map( post => post.id === post_id ? ({ ...post, post_comments: comments }) : post) )
    })
  }, [])

  return (
    <div className='posts flex flex-col gap-4 md:gap-[50px]'>
      {
        dynamicPosts.map( (post) => (
          <Post key={post.id} {...post} />
        ))
      }
    </div>
  )
}

export default Posts
