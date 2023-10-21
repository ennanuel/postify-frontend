import { useState, useEffect, useContext, useMemo } from 'react'
import { AuthContext } from '../../context/authContext';
import { ChannelContext } from '../../pages/channel';
import { ChannelCard } from '../../components/cards';
import { ChannelType } from '../../types/channel.types';
import { getChannels } from '../../utils/channel';
import { NavLink, useParams } from 'react-router-dom';

type Channels = {
  created: ChannelType[];
  following: ChannelType[];
}

const channelListKeys = ['following', 'created'];
const NAVIGATIONS = [
  { to: '/channels/list/all', text: 'All' },
  { to: '/channels/list/following', text: 'Following' },
  { to: '/channels/list/created', text: 'Created' }
];

const ChannelsAll = () => {
  const { filter } = useParams();
  const { user } = useContext(AuthContext)
  const { refresh } = useContext(ChannelContext)
  const [{ created, following }, setChannels] = useState<Channels>({ created: [], following: [] });
  
  function fetchChannel(key: string) {
    const channelKey = key as 'following' | 'created';
    getChannels(user.id, channelKey)
      .then(res => setChannels(prev => ({ ...prev, [channelKey]: res })))
      .catch(error => alert(error));
  }

  useEffect(() => {
    channelListKeys.map(fetchChannel)
  }, [refresh])
  
  return (
    <div className='p-4 lg:p-6 lg:col-span-2'>
      <ul className="flex h-[30px] md:h-[34px] gap-2 text-sm">
        {
          NAVIGATIONS.map(({ to, text }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `h-full flex items-center justify-center font-bold px-3 rounded-md ${isActive ? 'border border-white bg-white text-black-900' : 'border border-gray-400 text-gray-400 px-3 rounded-md'}`}
              >{text}</NavLink>
            </li>
          ))
        }
      </ul>
      {
        filter !== 'created' &&
          <div>
            { filter !== 'created' && <h2 className="font-bold text-3xl mt-6">Followed Channels</h2> }
            <ul className="mt-4 mb-6 gap-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 min-h-[50vh]">
              {
                following.map(({id, picture, name}) => (
                  <li key={id}>
                    <ChannelCard id={id} picture={picture} name={name} />
                  </li>
                ))
              }
            </ul>
          </div>
      }
      {
        filter !== 'following' &&
          <div>
            { filter !== 'following' && <h2 className="font-bold text-3xl mt-10">Created Channels</h2> }
            <ul className="mt-4 mb-6 gap-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {
                created.map(({ id, picture, name }) => (
                  <li key={id}>
                    <ChannelCard id={id} picture={picture} name={name} />
                  </li>
                ))
              }
            </ul>
          </div>
      }
    </div>
  )
}

export default ChannelsAll
