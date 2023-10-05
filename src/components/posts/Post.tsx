import { useMemo, useContext } from 'react';
import { FavoriteBorderOutlined, Favorite, MoreHoriz, TextsmsOutlined, Share, PermMedia, PeopleAltRounded, EditRounded, PersonRounded, ViewCarousel } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { cloudImgURL, post_bgs } from '../../assets/data/data';

type PostType = {
  id: string;
  name: string
  user_id: number;
  profile_pic: string;
  post_type: string;
  files: string[];
  post_bg: 'none' | 'blue' | 'red' | 'white' | 'black';
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

const Post = ({
  id,
  name,
  user_id,
  profile_pic,
  post_type,
  files,
  post_bg,
  post_desc,
  post_likes,
  post_comments,
  shares,
  liked_post,
  is_yours,
  last_updated,
  date_posted,
  group_id,
  group_name
}: PostType) => {
  const { user, socket } = useContext(AuthContext)
  const { id: groupId } = useParams();

  const date = useMemo(() => {
    let time: string;
    const currDate = new Date();
    const newDate = new Date(date_posted);
    const timePassed = currDate.getTime() - newDate.getTime();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    time = `${months[newDate.getMonth()]} ${newDate.getDay() + 1}`;

    if (timePassed < 1000 * 60 * 60) time = Math.floor(timePassed / (1000 * 60)) + ' mins ago';
    if (timePassed < 1000 * 60 * 60 * 24 && timePassed > 1000 * 60 * 60) time = Math.floor(timePassed / (1000 * 60 * 60)) + 'hrs ago';
    if (timePassed < 1000 * 60 * 60 * 48 && timePassed > 1000 * 60 * 60 * 24) time = 'Yesterday';
    if (timePassed >= 1000 * 60 * 60 * 48 && newDate.getFullYear() > currDate.getFullYear()) time = `${months[newDate.getMonth()]} ${newDate.getDay()}, ${newDate.getFullYear()}`;

    return time;
  }, [])
  const { from, via, to } = useMemo(() => post_bgs[post_bg] || {}, [])

  const likePost = () => {
    socket.emit('like-post', {user_id: user.id, post_id: id}, liked_post ? 'remove' : 'add')
  }

  return (
    <div className='single-post md:rounded-lg'>
      <div className="p-[10px] pb-0">
        <div className="p-[10px] flex items-center justify-between">
          <div className="flex gap-[20px] items-center">
            <img className='h-[40px] aspect-square rounded-full' src={`${APIURL}/image/profile_pics/${profile_pic}`} alt={name} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${user_id}`} className="text-inherit text-sm">
                  <span className="font-[500]">{name}</span>
                </Link>
                {
                  (group_id && groupId !== group_id) &&
                  <>
                  <span className="block w-1 h-1 rounded-full bg-white/50"></span>
                  <Link to={`/group/info/${group_id}`}>
                    {group_name}
                  </Link>
                  </>
                }
              </div>
              <span className="text-xs">{ date }</span>
            </div>
          </div>
          <div className="relative z-[999]">
            <button className="peer flex items-center justify-center">
              <MoreHoriz />
            </button>
            <div className="absolute top-[50%] translate-y-[-50%] right-[140%] flex flex-col text-sm w-max bg-black-900/50 backdrop-blur-lg opacity-0 pointer-events-none hover:pointer-events-auto peer-focus:opacity-100 peer-focus:pointer-events-auto shadow-lg shadow-black-900/50 border border-white/5 rounded-md">
              <Link to={`/post/${id}`} className='pl-2 pr-3 py-1 flex items-center gap-2 hover:bg-white/5'>
                  <span className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-white/5">
                    <ViewCarousel fontSize="small" />
                  </span>
                <span>View Post</span>
              </Link>
              <Link to={`/profile/${user_id}`} className='pl-2 pr-3 py-1 flex items-center gap-2 hover:bg-white/5'>
                  <span className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-white/5">
                    <PersonRounded fontSize="small" />
                  </span>
                <span>View User</span>
              </Link>
              {
                group_id &&
                <Link to={`/group/info/${group_id}`} className='pl-2 pr-3 py-1 hover:bg-white/5'>
                  <span className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-white/5">
                    <PeopleAltRounded fontSize="small" />
                  </span>
                  <span>View Group</span>
                </Link>
              }
              {
                is_yours &&
                <Link to={`/edit_post/${id}`} className='pl-2 pr-3 py-1 flex items-center gap-2 hover:bg-white/5'>
                  <span className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-white/5">
                    <EditRounded fontSize="small" />
                  </span>
                  <span>Edit Post</span>
                </Link>
              }
            </div>
          </div>
        </div>

        {
          post_type === 'text' ?
            <Link to={`/post/${id}`}>
              <p className={`rounded-[7px] mt-[5px] p-[15px] bg-gradient-to-br ${from} ${via} ${to} ${post_bg !== 'none' && 'aspect-square flex justify-center items-center text-center text-3xl font-bold p-4'} ${/white/i.test(post_bg) && 'text-black-600'}`}>{ post_desc }</p>
            </Link> :
            <div className="flex flex-col gap-2 p-3 pb-0">
              <p>{post_desc}</p>
              <Link to={`/post/${id}`} className='w-full h-full flex-1 block'>
                <ul className={`grid gap-4 grid-cols-2 h-full`}>
                  {
                    files?.slice(0, 4)?.map((file, i, arr) => (
                      <li
                        className={`relative aspect-square overflow-clip rounded-lg ${arr.length === 1 && i === 0 ? 'col-span-2' : 'col-span-1'}`}>
                        {
                          (files.length > 4 && i == 3) &&
                            <div className="absolute z-1 top-0 left-0 w-full h-full flex items-center justify-center bg-black-900/50 text-[3em] font-bold">
                            +<span>{ files.length - 4 }</span>
                            </div>
                        }
                        {
                          post_type === 'photo' ?
                            <img className="w-full h-full"
                              src={`${APIURL}/image/post_images/${file}`}
                              alt={post_desc}
                            /> :
                          <video className="w-full aspect-square object-cover" src={`${APIURL}/video/post_videos/${file}`} autoPlay={true}></video>
                        }
                      </li>
                    ))
                  }
                </ul>
              </Link>
            </div>
        }
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
          <img className="h-[40px] aspect-square rounded-full" src={user.profile_pic} alt="" />
          <input className="flex-1 border-none outline-none h-[40px] px-[15px] rounded-[20px]" type="text" placeholder="Leave a comment" />
        </div>
    </div>
  )
}

export default Post
