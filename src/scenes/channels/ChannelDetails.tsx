import { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, MessageOutlined, Favorite, MoreHoriz, OpenInNew, FavoriteBorder } from '@mui/icons-material'
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { IconButton } from '@mui/material';
import CreatePost from './CreatePost';
import { ChannelContext } from '../../pages/channel';
import { fetchOptions } from '../../assets/data/data';

type ChannelDetailsType = {
  id: string;
  name: string;
  channel_desc: string;
  picture: string;
  cover: string;
  popularity: number;
  posts: number;
  tags: string[];
  website: string;
  following: boolean;
  owner: boolean;
}

type PostType = {
  id: string;
  post_desc: string;
  channel_name: string;
  channel_id: string;
  picture: string;
  file: string;
  post_likes: number;
  post_comments: number;
  shares: number;
  liked: boolean;
  date_posted: string;
}

const ChannelDetails = () => {
  const { id } = useParams()

  const { refresh } = useContext(ChannelContext);
  const { user, socket } = useContext(AuthContext);

  const [{ name, channel_desc, picture, cover, popularity, posts, tags, website, following, owner }, setChannel] = useState({} as ChannelDetailsType)
  const [feed, setFeed] = useState<PostType[]>([])
  const [show, setShow] = useState(false)

  async function getChannelInfo() {
    const response = await fetch(`${APIURL}/channel/info/${id}?user_id=${user.id}&type=full`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong!');
    const res = await response.json();
    setChannel(res);
  }

  async function getChannelFeed() {
    const response = await fetch(`${APIURL}/channel/feed/${id}?user_id=${user.id}&type=single`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong!');
    const res = await response.json();
    setFeed(res);
  }

  async function followAction(type: string) {
    socket.emit('channel-action', { channel_id: id, user_id: user.id }, type)
  }


  useEffect(() => {
    getChannelFeed();
    socket.removeAllListeners('post-event')
    socket.on('post-event', ({ channel_id } : { channel_id: string }) => {
      if (channel_id == id) alert('someone posted something');
    })
  }, [id])

  useEffect(() => {
    getChannelInfo()
  }, [refresh, id])

  return (
    <div className="">
      <CreatePost show={show} setShow={setShow} />
      <img className="h-[200px] w-full bg-gradient-to-br from-gray-900 to-black-800" src={`${APIURL}/image/covers/${cover}`} alt="" />
      <div className="flex items-center gap-4 px-6">
        <img src={`${APIURL}/image/profile_pics/${picture}`} alt="" className="w-[120px] aspect-square rounded-lg bg-white/5 mt-[-50px] shadow-lg shadow-black-900/50" />
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="flex flex-1 flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="truncate">{name}</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs">{ popularity } Followers</span>
              <span className="text-xs">{ posts } Videos</span>
            </div>
          </div>
          <div className="flex justify-start items-center gap-2">
            {
              !owner ?
              <IconButton
                onClick={() => followAction(following ? 'unfollow' : 'follow')}
                sx={{
                  height: '34px',
                  fontSize: 'small',
                  borderRadius: '17px',
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'gray',
                  color: 'black' 
                }}
              >
                <span>{following ? 'Unfollow' : 'Follow'}</span>
              </IconButton> :
              <div className="relative">
                <IconButton
                  className="peer"
                  sx={{
                    height: '34px',
                    width: '34px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: 'black'
                    }
                  }}
                >
                  <MoreHoriz />
                </IconButton>
                <div className="absolute bottom-0 right-[110%] min-w-max flex flex-col bg-black-900/60 text-sm backdrop-blur-lg rounded-sm opacity-0 pointer-events-none overflow-hidden peer-focus:opacity-100 peer-focus:pointer-events-auto hover:pointer-events-auto">
                  <Link to={`/channels/edit/${id}`} className="py-2 px-3 hover:bg-white/5">Edit Channel</Link>
                  <button onClick={() => setShow(!show)} className="py-2 px-3 hover:bg-white/5">Post Video</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
        <div className="flex flex-col-reverse md:flex-row items-start justify-start gap-4 p-4">
          <div className="flex flex-col gap-4 flex-1">
            <h3 className="font-bold text-lg">Videos</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {
                feed.map(({ id, channel_name, file, picture, post_desc, post_likes, post_comments, liked }) => (
                  <li key={id} className="relative bg-white/10 rounded-lg h-[240px] overflow-clip">
                    <video src={`${APIURL}/video/post_videos/${file}`} className="h-full w-full object-cover" />
                    <div className="absolute bottom-0 left-0 p-2 w-full h-full flex flex-col justify-end gap-1 bg-gradient-to-b from-transparent to-black-900">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center justify-center gap-1">
                          {post_likes}
                          {liked ? <Favorite fontSize="inherit" /> : <FavoriteBorder fontSize="inherit" />}
                        </span>
                        <span className="flex items-center justify-center gap-1">
                          {post_comments}
                          <MessageOutlined fontSize='inherit' />
                        </span>
                      </div>
                      <p className='text-xs w-full truncate'>{ post_desc }</p>
                      <div className="flex items-center gap-2 w-full">
                        <img src={`${APIURL}/image/profile_pics/${picture}`} className="w-[20px] aspect-square rounded-full bg-black/50" />
                        <p className="text-xs w-full truncate">{ channel_name }</p>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>

          <div className="w-full md:w-[300px] flex flex-col gap-2 bg-gradient-to-br from-gray-500/30 to-gray-900/50 rounded-md p-3">
            <h3 className="font-bold text-lg">About</h3>
            <p className='text-sm'>{ channel_desc }</p>
            <ul className="mt-1 pt-3 border-t border-white/50 flex items-center gap-2 flex-wrap">
              {
                tags?.map( (tag, i) => <li key={i} className="px-2 py-[3px] border border-white/50 text-xs rounded-[12px]">{tag}</li> )
              }
            </ul>
            <a href={website || '#'} target="_blank" className="mt-1 w-full flex items-center justify-center gap-1 px-2 h-[30px] rounded-md bg-white text-black-900 text-sm">
              <span>Visit website</span>
              <OpenInNew fontSize='inherit' />
            </a>
          </div>
        </div>
    </div>
  )
}

export default ChannelDetails
