import { useState, useEffect, useContext } from 'react';
import { Favorite, FavoriteBorder, MessageOutlined } from '@mui/icons-material';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { Link } from 'react-router-dom';
import { ChannelContext } from '../../pages/channel';
import { fetchOptions } from '../../assets/data/data';

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

const ChannelFeed = () => {
  const { user, socket } = useContext(AuthContext);
  const { refresh } = useContext(ChannelContext);

  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [feed, setFeed] = useState<PostType[]>([]);

  async function getChannelsFeed() {
    const response = await fetch(`${APIURL}/channel/feed/${user.id}?user_id=${user.id}`, fetchOptions);
    if (response.status !== 200) return alert('something went wrong!');
    const res = await response.json();
    setFeed(res);
  }

  async function getChannels() {
    const response = await fetch(`${APIURL}/channel/${user.id}?type=following`, fetchOptions);
  
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();

    setChannels(res);
  }

  useEffect(() => {
    getChannelsFeed();
  }, []);

  useEffect(() => {
    getChannels()
  }, [refresh])

  useEffect(() => {
    socket.removeAllListeners('post-event')
    socket.on('post-event', ({ channel_id }) => {
      if (channels.map(elem => elem.id).includes(channel_id)) alert('new channel post available');
    })
  }, [channels, socket]);

  return (
    <div className='grid grid-cols-[1fr,300px]'>
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
          <ul className="flex-[4] grid grid-cols-4 gap-4 mt-6">
            {
              feed.map(({ id, channel_name, file, picture, post_desc, post_likes, post_comments, liked }) => (
                <li key={id}>
                  <Link to={`/short/${id}`} className="relative bg-white/10 rounded-lg h-[240px] overflow-clip block">
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
                  </Link>
                </li>
              ))
            }
          </ul>
      </div>
      <div className="p-2 px-4 rounded-md mt-4 mr-4 bg-white/5">
        <h2 className="font-bold text-lg">Following</h2>
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
      </div>
    </div>
  )
}

export default ChannelFeed
