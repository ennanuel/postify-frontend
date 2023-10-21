import { useState, useEffect, useContext } from 'react';
import { ChannelCard, VideoCard } from '../../components/cards';
import { AuthContext } from '../../context/authContext';
import { ChannelContext } from '../../pages/channel';
import { VideoCardProps, ChannelType } from '../../types/channel.types';
import { getChannels, getChannelsFeed } from '../../utils/channel';

const ChannelFeed = () => {
  const { user, socket } = useContext(AuthContext);
  const { refresh } = useContext(ChannelContext);

  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [feed, setFeed] = useState<VideoCardProps[]>([]);

  useEffect(() => {
    getChannelsFeed(user.id, 'following')
      .then(res => setFeed(res as VideoCardProps[]))
      .catch(error => alert(error));
}, []);

  useEffect(() => {
    getChannels(user.id, 'following')
      .then(res => setChannels(res as ChannelType[]))
      .catch(error => alert(error))
  }, [refresh])

  useEffect(() => {
    socket.removeAllListeners('post-event')
    socket.on('post-event', ({ channel_id }) => {
      if (channels.map(elem => elem.id).includes(channel_id)) alert('new channel post available');
    })
  }, [channels, socket]);

  return (
    <>
      <article className="p-4">
        <h2 className="font-bold text-3xl">Videos</h2>
        <div className="flex items-center gap-3 mt-2">
          <button className="px-2 h-[30px] rounded-[5px] text-sm font-semibold bg-gray-300 border border-gray-300 text-black-800">
            Popular
          </button>
          <button className="px-2 h-[30px] rounded-[5px] text-sm font-normal border border-gray-400 text-gray-400">
            Recent
          </button>
        </div>
          <ul className="flex-[4] grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {
              feed.map(video => <li key={video.id}><VideoCard {...video} /></li>)
            }
          </ul>
      </article>
      <article className="p-2 px-4 rounded-t-xl lg:rounded-md mt-2 lg:mr-4 bg-white/5 lg:h-[calc(100vh-80px)] lg:sticky top-[70px] lg:shadow-lg shadow-black-900/50">
        <h2 className="font-bold text-2xl mt-4 lg:mt-0">Followed Channels</h2>
        <ul className="mt-4 mb-6 gap-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2">
          {
            channels.map(channel => (
              <li key={channel.id}>
                <ChannelCard {...channel} />
              </li>
            ))
          }
        </ul>
      </article>
    </>
  )
}

export default ChannelFeed
