import { useMemo, useContext } from 'react';
import { FavoriteBorderOutlined, Favorite, MoreHoriz, TextsmsOutlined, Share } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';

type PostType = {
  id: string;
  name: string
  user_id: number;
  profile_pic: string;
  post_desc: string;
  post_likes: number;
  post_comments: number;
  shares: number;
  liked_post: boolean;
  last_updated: string;
  date_posted: string;
  group_name?: string;
  group_id?: string;
}

const Post = ({
  id,
  name,
  user_id,
  profile_pic,
  post_desc,
  post_likes,
  post_comments,
  shares,
  liked_post,
  last_updated,
  date_posted,
  group_id,
  group_name
}: PostType) => {
  const { user, socket } = useContext(AuthContext)

  const date = useMemo(() => {
    const newDate = new Date(date_posted)
    return `0${newDate.getDay()}-0${newDate.getMonth()}-${newDate.getFullYear()}`;
  }, [])

  const likePost = () => {
    socket.emit('like-post', {user_id: user.id, post_id: id}, liked_post ? 'remove' : 'add')
  }

  return (
    <div className='single-post rounded-[15px]'>
      <div className="p-[10px] pb-0">
        <div className="p-[10px] flex items-center justify-between">
          <div className="flex gap-[20px] items-center">
            <img className='h-[40px] aspect-square rounded-full' src={profile_pic} alt={name} />
            <div className="flex flex-col">
              <Link to={`/profile/${user_id}`} className="text-inherit text-sm">
                <span className="font-[500]">{name}</span>
              </Link>
              {
                group_id &&
                <Link to={`/group/info/${group_id}`}>
                  {group_name}
                </Link>
              }
              <span className="text-xs">{ date }</span>
            </div>
          </div>
          <MoreHoriz />
        </div>

        <Link to={`/post/${id}`} className="flex flex-col content rounded-[7px] mt-[5px] p-[15px]">
          <p>{ post_desc }</p>
        </Link>
        <div className="actions py-[10px] mt-[5px] flex items-center gap-[10px]">
          <button onClick={likePost} className={`px-[15px] flex items-center justify-center gap-[5px] h-[35px] rounded-[18px] ${liked_post && 'liked'}`}> 
            {liked_post ? <Favorite /> : <FavoriteBorderOutlined />}
            <span>{ post_likes }</span>
          </button>
          <button className="px-[15px] flex items-center justify-center gap-[5px] h-[35px] rounded-[17.5px]">
            <TextsmsOutlined />
            <span>{ post_comments }</span>
          </button>
          <button className="px-[15px] flex items-center justify-center gap-[5px] h-[35px] rounded-[17.5px]">
            <Share />
            <span>{ shares }</span>
          </button>
        </div>
      </div>
        <div className="leave-comment mx-[10px] py-[10px] flex items-center gap-[10px]">
          <img className="h-[40px] aspect-square rounded-full" src="" alt="" />
          <input className="flex-1 border-none outline-none h-[40px] px-[15px] rounded-[20px]" type="text" placeholder="Leave a comment" />
        </div>
    </div>
  )
}

export default Post
