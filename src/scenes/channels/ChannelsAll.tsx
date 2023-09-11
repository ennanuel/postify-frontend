import { useState, useEffect, useContext } from 'react'
import { Link } from "react-router-dom"
import { APIURL } from "../../assets/data";
import { AuthContext } from '../../context/authContext';
import { ChannelContext } from '../../pages/channel';

type ChannelType = {
  id: string;
  name: string;
  picture: string;
}

type Channels = {
  created: ChannelType[];
  following: ChannelType[];
}

const ChannelsAll = () => {
  const { user } = useContext(AuthContext)
  const { refresh } = useContext(ChannelContext)
  const [{ created, following }, setChannels] = useState<Channels>({created: [], following: []});

  async function getFollowingChannels() {
    const response = await fetch(`${APIURL}/channel/${user.id}?type=following`)

    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setChannels( prev => ({...prev, following: res}));
  }
  
  async function getCreatedChannels() {
    const response = await fetch(`${APIURL}/channel/${user.id}?type=created`)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setChannels(prev => ({...prev, created: res}));
  }

  useEffect(() => {
    getFollowingChannels()
    getCreatedChannels()
  }, [])

  useEffect(() => { 
    getFollowingChannels();
  }, [refresh])
  
  return (
    <div className='p-6'>
      <h2 className="font-bold text-xl">Following</h2>
      <ul className="mt-4 mb-6 gap-4 flex items-center">
        {
          following.map(({id, picture, name}) => (
            <li key={id}>
              <Link to={`/channels/info/${id}`} className="w-full flex flex-col gap-2 items-center p-2">
                <img src={picture} alt="" className="h-[80px] aspect-square rounded-full bg-white/5" />
                <p className="text-sm font-bold">{ name }</p>
              </Link>
            </li>
          ))
        }
      </ul>
      <h2 className="font-bold text-xl mt-10">Created Channels</h2>
      <ul className="mt-4 mb-6 gap-4 flex items-center">
        {
          created.map(({ id, picture, name }) => (
            <li key={id}>
              <Link to={`/channels/info/${id}`} className="w-full flex flex-col gap-2 items-center p-2">
                <img src={picture} alt="" className="h-[80px] aspect-square rounded-full bg-white/5" />
                <p className="text-sm font-bold">{ name }</p>
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default ChannelsAll
