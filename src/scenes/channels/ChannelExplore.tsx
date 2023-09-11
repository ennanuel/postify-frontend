import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Favorite, MessageOutlined } from '@mui/icons-material'
import { AuthContext } from '../../context/authContext'
import { APIURL } from '../../assets/data'

type ChannelType = {
  id: string;
  name: string;
  picture: string;
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

const ChannelExplore = () => {
  const { user, socket } = useContext(AuthContext);
  const [channels, setChannels] = useState<ChannelType[]>([])
  const [feed, setFeed] = useState<PostType[]>([])

  async function getExploreChannels() {
    const response = await fetch(`${APIURL}/channel/${user.id}?type=explore`)
    if (response.status !== 200) return alert('something went wrong!')
    const res = await response.json();
    setChannels(res);
  }

  async function getChannelsFeed() {
    const response = await fetch(`${APIURL}/channel/feed/${user.id}?user_id=${user.id}&type=explore`)
    if (response.status !== 200) return alert('something went wrong!');
    const res = await response.json();
    setFeed(res);
  }

  useEffect(() => {
    getExploreChannels();
    getChannelsFeed();
  }, [])

  useEffect(() => { 
    socket.on('post-event', ({ channel_id }) => {
      if (channels.map(elem => elem.id).includes(channel_id)) alert('new channel post available');
    })
  }, [channels])

  return (
    <div className='p-6'>
      <h2 className="font-bold text-xl">Top Channels</h2>
      <ul className="mt-4 mb-6 gap-4 flex items-center">
        {
          channels.map(({ id, name, picture }) => (
            <li key={id}>
              <Link to={`/channels/info/${id}`} className="flex flex-col gap-2 items-center p-2">
                <img src={picture} alt="" className="h-[80px] aspect-square rounded-full bg-white/5" />
                <p className="text-sm font-bold">{ name }</p>
              </Link>
            </li>
          ))
          }
      </ul>

      <h2 className="font-bold text-xl">Videos</h2>
      <div className="flex items-center gap-3 mt-2">
        <button className="px-2 h-[30px] rounded-[5px] text-sm font-semibold bg-gray-300 border border-gray-300 text-black-800">
          Popular
        </button>
        <button className="px-2 h-[30px] rounded-[5px] text-sm font-normal border border-gray-400 text-gray-400">
          Recent
        </button>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-4">
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
    </div>
  )
}

export default ChannelExplore
