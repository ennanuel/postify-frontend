import { useEffect, useContext, useState } from 'react';
import Post from './Post'
import './posts.scss'
import { AuthContext } from '../../context/authContext';
import { PostType } from '../../types/post.types';

const Posts = ({ posts }: { posts: PostType[] }) => {
  const { user, socket } = useContext(AuthContext);
  const [dynamicPosts, setDynamicPosts] = useState(posts);

  function updatePostLikes({ post_id, post_likes, user_id, liked }: { post_id: string, post_likes: number, user_id: string, liked: boolean }) {
    const foundPost = dynamicPosts.find( post => post.id === post_id );
    if (!foundPost) return;
    foundPost.liked = user.id == user_id ? liked : foundPost.liked;
    foundPost.post_likes = post_likes;
    setDynamicPosts((prev) => prev.map(post => post.id == post_id ? foundPost : post));
  };
  function updatePostComments({ post_id, post_comments }: { post_id: string; post_comments: number; }) {
    const foundPost = dynamicPosts.find(post => post.id === post_id);
    if (!foundPost) return;
    foundPost.post_comments = post_comments;
    setDynamicPosts(prev => prev.map(post => post.id === post_id ? foundPost : post));
  };

  useEffect(() => {
    setDynamicPosts(posts);
  }, [posts]);
    
  useEffect(() => {
    socket.removeAllListeners('someone-liked');
    socket.removeAllListeners('someone-commented');
    socket.on('someone-liked', updatePostLikes);
    socket.on('someone-commented', updatePostComments);
  }, [dynamicPosts]);

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
