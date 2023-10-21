import { useMemo, useContext } from 'react';
import { FavoriteBorderOutlined, Favorite, MoreHoriz, TextsmsOutlined, Share, PeopleAltRounded, EditRounded, PersonRounded, ViewCarousel } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { cloudImgURL, post_bgs } from '../../assets/data/data';

import { PostType } from '../../types/post.types';
import { likePost, postPrettierTime } from '../../utils/post';

const Post = (post: PostType) => {
  const { user } = useContext(AuthContext)
  const { id: groupId } = useParams();

  const date = useMemo(() => postPrettierTime(post.date_posted), [])
  const handleLikePost = useMemo(() => function() { likePost({ user_id: user.id, post_id: post.id, liked: post.liked }) }, [post.liked]);
  const { from, via, to } = useMemo(() => post_bgs[post.post_bg] || {}, []);

  return (
    <div className='single-post md:rounded-lg'>
      <div className="p-[10px] pb-0">
        <div className="p-[10px] flex items-center justify-between">
          <div className="flex gap-[20px] items-center">
            <img className='h-[40px] aspect-square rounded-full' src={`${APIURL}/image/profile_pics/${post.profile_pic}`} alt={post.name} />
            <div className="flex flex-col">
              <div className="flex items-center gap-x-2 flex-wrap">
                <Link to={`/profile/${post.user_id}`} className="text-inherit text-sm truncate">
                  <span className="font-[500]">{post.name}</span>
                </Link>
                {
                  (post.group_id && groupId !== post.group_id) &&
                  <>
                  <span className="block w-1 h-1 rounded-full bg-white/50"></span>
                  <Link to={`/group/info/${post.group_id}`} className="truncate text-xs">
                    {post.group_name}
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
            <div className="absolute top-0 right-[140%] flex flex-col text-sm w-max bg-black-900/50 backdrop-blur-sm transition-[opacity,transform] origin-top opacity-0 scale-y-50 pointer-events-none hover:pointer-events-auto peer-focus:opacity-100 peer-focus:scale-y-100 peer-focus:pointer-events-auto shadow-lg shadow-black-900/50 border border-white/5 rounded-md">
              <Link to={`/post/${post.id}`} className='pl-2 pr-3 py-1 flex items-center gap-2 text-sm hover:bg-white/5'>
                  <span className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-white/5">
                    <ViewCarousel fontSize="small" />
                  </span>
                <span>View Post</span>
              </Link>
              <Link to={`/profile/${post.user_id}`} className='pl-2 pr-3 py-1 flex items-center gap-2 text-sm hover:bg-white/5'>
                  <span className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-white/5">
                    <PersonRounded fontSize="small" />
                  </span>
                <span>View User</span>
              </Link>
              {
                post.group_id &&
                <Link to={`/group/info/${post.group_id}`} className='pl-2 pr-3 py-1 flex items-center gap-2 text-sm hover:bg-white/5'>
                  <span className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-white/5">
                    <PeopleAltRounded fontSize="small" />
                  </span>
                  <span>View Group</span>
                </Link>
              }
              {
                post.is_yours &&
                <Link to={`/edit_post/${post.id}`} className='pl-2 pr-3 py-1 flex items-center gap-2 text-sm hover:bg-white/5'>
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
          post.post_type === 'text' ?
            <Link to={`/post/${post.id}`}>
              <p className={`rounded-[7px] mt-[5px] p-[15px] bg-gradient-to-br ${from} ${via} ${to} ${post.post_bg !== 'none' && 'aspect-square flex justify-center items-center text-center text-3xl font-bold p-4'} ${/white/i.test(post.post_bg) && 'text-black-600'}`}>{ post.post_desc }</p>
            </Link> :
            <div className="flex flex-col gap-2 p-3 pb-0">
              <p>{post.post_desc}</p>
              <Link to={`/post/${post.id}`} className='w-full h-full flex-1 block'>
                <ul className={`grid gap-4 grid-cols-2 h-full`}>
                  {
                    post.files?.slice(0, 4)?.map((file, i, arr) => (
                      <li
                        className={`relative aspect-square overflow-clip rounded-lg ${arr.length === 1 && i === 0 ? 'col-span-2' : 'col-span-1'}`}>
                        {
                          (post.files.length > 4 && i == 3) &&
                            <div className="absolute z-1 top-0 left-0 w-full h-full flex items-center justify-center bg-black-900/50 text-[3em] font-bold">
                            +<span>{ post.files.length - 4 }</span>
                            </div>
                        }
                        {
                          post.post_type === 'photo' ?
                            <img className="w-full h-full"
                              src={`${APIURL}/image/post_images/${file}`}
                              alt={post.post_desc}
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
          <button onClick={handleLikePost} className={`px-[15px] flex items-center justify-center gap-[5px] h-[35px] rounded-[18px] ${post.liked && 'liked'}`}> 
            {post.liked ? <Favorite /> : <FavoriteBorderOutlined />}
            <span>{ post.post_likes }</span>
          </button>
          <Link to={`/post/${post.id}`} className="px-[15px] flex items-center justify-center gap-[5px] h-[35px] rounded-[17.5px]">
            <TextsmsOutlined />
            <span>{ post.post_comments }</span>
          </Link>
          <button className="px-[15px] flex items-center justify-center gap-[5px] h-[35px] rounded-[17.5px]">
            <Share />
            <span>{ post.shares }</span>
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
