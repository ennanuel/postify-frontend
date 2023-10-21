import { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Add, MoreHoriz, OpenInNew } from '@mui/icons-material';
import { VideoCard } from '../../components/cards';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { IconButton } from '@mui/material';
import CreatePost from './CreatePost';
import { ChannelContext } from '../../pages/channel';
import { followAction, getChannelInfo, getChannelsFeed } from '../../utils/channel';
import { ChannelDetailsType } from '../../types/channel.types';
import { VideoCardProps } from '../../types/channel.types';

const ChannelDetails = () => {
  const { id } = useParams()

  const { refresh } = useContext(ChannelContext);
  const { user, socket } = useContext(AuthContext);

  const [{ name, channel_desc, picture, cover, popularity, posts, tags, website, following, owner }, setChannel] = useState({} as ChannelDetailsType)
  const [feed, setFeed] = useState<VideoCardProps[]>([])
  const [show, setShow] = useState(false)

  function followChannel() {
    followAction({ user_id: user.id, channel_id: id })
      .catch(error => console.error(error));
  }
  function unfollowChannel() {
    followAction({ user_id: user.id, channel_id: id, unfollow: true })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    getChannelsFeed(id, 'single')
      .then(res => setFeed(res as VideoCardProps[]))
      .catch(error => alert(error));

    socket.removeAllListeners('post-event')
    socket.on('post-event', ({ channel_id } : { channel_id: string }) => {
      if (channel_id == id) alert('someone posted something');
    })
  }, [id])

  useEffect(() => {
    getChannelInfo({user_id: user.id, channel_id: id, infoType: 'full'})
      .then(res => setChannel(res as ChannelDetailsType))
      .catch(error => alert(error))
  }, [refresh, id])

  return (
    <div className="relative lg:col-span-2">
      <CreatePost show={show} setShow={setShow} />
      <img className="h-[200px] w-full bg-gradient-to-br from-gray-900 to-black-800" src={`${APIURL}/image/covers/${cover}`} alt="" />
      <section className="flex items-center gap-4 px-6">
        <img src={`${APIURL}/image/profile_pics/${picture}`} alt="" className="w-[120px] aspect-square rounded-lg bg-white/5 mt-[-50px] shadow-lg shadow-black-900/50" />
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="flex flex-1 flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="truncate">{name}</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs">{popularity} Followers</span>
              <span className="text-xs">{posts} Videos</span>
            </div>
          </div>
          <div className="flex justify-start items-center gap-2">
            {
              !owner ?
                <IconButton
                  onClick={following ? unfollowChannel : followChannel}
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
      </section>
      <section className="flex flex-col-reverse md:flex-row items-start justify-start gap-4 p-4">
        <article className="flex flex-col gap-4 flex-1">
          <h3 className="font-bold text-lg">Videos</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {feed.map((video) => <VideoCard {...video} />)}
          </ul>
        </article>

        <article className="w-full md:w-[300px] flex flex-col gap-2 bg-gradient-to-br from-gray-500/30 to-gray-900/50 rounded-md p-3 md:sticky md:top-[110px] lg:top-[70px]">
          <h3 className="font-bold text-lg">About</h3>
          <p className='text-sm'>{channel_desc}</p>
          <ul className="mt-1 pt-3 border-t border-white/50 flex items-center gap-2 flex-wrap">
            {
              tags?.map((tag, i) => <li key={i} className="px-2 py-[3px] border border-white/50 text-xs rounded-[12px]">{tag}</li>)
            }
          </ul>
          <a href={website || '#'} target="_blank" className="mt-1 w-full flex items-center justify-center gap-1 px-2 h-[30px] rounded-md bg-white text-black-900 text-sm">
            <span>Visit website</span>
            <OpenInNew fontSize='inherit' />
          </a>
        </article>
      </section>
    </div>
  )
}

export default ChannelDetails
