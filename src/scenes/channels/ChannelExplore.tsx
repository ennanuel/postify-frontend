import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { APIURL } from '../../assets/data'
import { fetchOptions } from '../../assets/data/data'
import { ChannelCard, VideoCard } from '../../components/cards'

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
  file: string;
  picture: string;
  post_likes: number;
  post_comments: number;
  shares: number;
  liked: boolean;
  date_posted: string;
}

const ChannelExplore = () => {
  const { user } = useContext(AuthContext);
  const [channels, setChannels] = useState<ChannelType[]>([])
  const [feed, setFeed] = useState<PostType[]>([])

  async function getExploreChannels() {
    const response = await fetch(`${APIURL}/channel/${user.id}?type=explore`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong!')
    const res = await response.json();
    setChannels(res);
  }

  async function getChannelsFeed() {
    const response = await fetch(`${APIURL}/channel/feed/${user.id}?user_id=${user.id}&type=explore`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong!');
    const res = await response.json();
    setFeed(res);
  }

  useEffect(() => {
    getExploreChannels();
    getChannelsFeed();
  }, [])

  useEffect(() => { 
    // socket.on('', ({ channel_id }) => {
    //   if (channels.map(elem => elem.id).includes(channel_id)) alert('new channel post available');
    // })
  }, [channels])

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[1fr,300px]'>
      <div className="p-4">
        <h2 className="font-bold text-xl">Videos</h2>
        <div className="flex items-center gap-3 mt-2">
          <button className="px-2 h-[30px] rounded-[5px] text-sm font-semibold bg-gray-300 border border-gray-300 text-black-800">
            Popular
          </button>
          <button className="px-2 h-[30px] rounded-[5px] text-sm font-normal border border-gray-400 text-gray-400">
            Recent
          </button>
        </div>
          <ul className="flex-[4] grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {
              feed.map(video => <li key={video.id}><VideoCard {...video} /></li>)
            }
          </ul>
      </div>
      <div className="p-2 px-4 rounded-md mt-4 lg:mr-4 lg:bg-white/5">
        <h2 className="font-bold text-lg">Top Channels</h2>
        <ul className="mt-4 mb-6 gap-4 grid grid-cols-2">
          {
            channels.map(channel => (
              <li key={channel.id}>
                <ChannelCard {...channel} />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default ChannelExplore
