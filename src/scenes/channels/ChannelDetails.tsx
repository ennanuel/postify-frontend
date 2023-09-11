import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, MessageOutlined, Favorite, MoreHoriz, OpenInNew } from '@mui/icons-material'
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { IconButton } from '@mui/material';
import CreatePost from './CreatePost';
import { ChannelContext } from '../../pages/channel';

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
}

type PostType = {
  id: string;
  post_desc: string;
  channel_name: string;
  channel_id: string;
  thumbnail: string;
  picture: string;
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

  const [{ name, channel_desc, picture, cover, popularity, posts, tags, website, following }, setChannel] = useState({} as ChannelDetailsType)
  const [feed, setFeed] = useState<PostType[]>([])
  const [show, setShow] = useState(false)

  async function getChannelInfo() {
    const response = await fetch(`${APIURL}/channel/info/${id}?user_id=${user.id}`)
    if (response.status !== 200) return alert('something went wrong!');
    const res = await response.json();
    setChannel(res);
  }

  async function getChannelFeed() {
    const response = await fetch(`${APIURL}/channel/feed/${id}?user_id=${user.id}&type=single`)
    if (response.status !== 200) return alert('something went wrong!');
    const res = await response.json();
    setFeed(res);
  }

  async function followAction(type: string) {
    socket.emit('channel-action', { channel_id: id, user_id: user.id }, type)
  }


  useEffect(() => {
    getChannelFeed();
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
      <img className="h-[200px] bg-gradient-to-br from-gray-900 to-black-800" src={cover} alt="" />
      <div className="flex items-center gap-4 px-6">
        <img src={picture} alt="" className="w-[120px] aspect-square rounded-lg bg-white/5 mt-[-50px]" />
        <div className="flex-1 flex items-center justify-between gap-2">
          <div className="flex flex-1 flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-2">{ name } <CheckCircle /></h2>
            <div className="flex items-center gap-3">
              <span className="text-xs">{ popularity } Followers</span>
              <span className="text-xs">{ posts } Videos</span>
            </div>
          </div>
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
          </IconButton>
          <IconButton
            onClick={() => setShow(!show)}
            sx={{
              height: '34px',
              aspectRatio: 1,
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
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-2 p-6">
        <div className="flex items-center gap-2">
          <button className="h-[30px] px-2 rounded-md bg-white text-sm font-bold text-black-900">Popular</button>
          <button className="h-[30px] px-2 rounded-md border border-gray-400 text-gray-400 text-sm">Recent</button>
        </div>
        <div className="flex gap-4">
          <ul className="flex-[4] grid grid-cols-4 gap-4">
            {
              feed.map((post) => (
                <li key={post.id} className="relative bg-white/10 rounded-lg">
                  <img src={post.thumbnail} alt="" className="h-[200px]" />
                  <div className="absolute bottom-0 left-0 p-2 w-full flex flex-col gap-1">
                    <p className='text-xs w-full truncate'>{ post.post_desc }</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center justify-center gap-1">
                        5
                        <Favorite fontSize="inherit" />
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        5
                        <MessageOutlined fontSize='inherit' />
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={ post.picture } alt="" className="h-[20px] aspect-square rounded-full bg-black/50" />
                      <p className="text-xs">{ post.channel_name }</p>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>

          <div className="flex-1 flex h-fit flex-col gap-2 bg-gradient-to-br from-gray-500/30 to-gray-900/50 rounded-md p-3">
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
    </div>
  )
}

export default ChannelDetails
