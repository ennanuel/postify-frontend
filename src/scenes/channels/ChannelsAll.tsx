import { useState, useEffect, useContext } from 'react'
import { Link } from "react-router-dom"
import { APIURL } from "../../assets/data";
import { AuthContext } from '../../context/authContext';
import { ChannelContext } from '../../pages/channel';
import { fetchOptions } from '../../assets/data/data';
import { ChannelCard } from '../../components/cards';

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
    const response = await fetch(`${APIURL}/channel/${user.id}?type=following`, fetchOptions)

    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setChannels( prev => ({...prev, following: res}));
  }
  
  async function getCreatedChannels() {
    const response = await fetch(`${APIURL}/channel/${user.id}?type=created`, fetchOptions)

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
    <div className='p-4 lg:p-6'>
      <h2 className="font-bold text-xl">Following</h2>
      <ul className="mt-4 mb-6 gap-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {
          following.map(({id, picture, name}) => (
            <li key={id}>
              <ChannelCard id={id} picture={picture} name={name} />
            </li>
          ))
        }
      </ul>
      <h2 className="font-bold text-xl mt-10">Created Channels</h2>
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
  )
}

export default ChannelsAll
