import Post from './Post'
import './posts.scss'

type PostType = {
  id: string;
  name: string
  user_id: number;
  profile_pic: string;
  post_desc: string;
  post_likes?: number;
  post_comments?: number;
  shares?: number;
  liked_post: boolean;
  last_updated: string;
  date_posted: string;
}

const Posts = ({ posts = [] } : { posts?: PostType[] }) => {
  return (
    <div className='posts flex flex-col gap-[50px]'>
      {
        posts.map( (post) => (
          <Post {...post} />
        ))
      }
    </div>
  )
}

export default Posts
