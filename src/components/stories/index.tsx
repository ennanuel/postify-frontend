import { useContext, useState, useEffect, useMemo } from 'react';
import { AddAPhoto } from '@mui/icons-material';
import { AuthContext } from "../../context/authContext"
import { Link } from 'react-router-dom';
import { CreateStory } from '../../scenes/story';
import { APIURL } from '../../assets/data';
import './stories.scss'
import { fetchOptions, post_bgs } from '../../assets/data/data';

type StoryType = {
  id: string;
  user_id: string;
  name: string;
  profile_pic: string;
  file: string;
  story_type: 'text' | 'photo' | 'video';
  story_bg: 'none' | 'red' | 'blue' | 'black' | 'white';
  story_desc: string;
  seen: number;
  stories: number;
  is_yours: boolean;
}

const Stories = () => {
  const { user, socket, friend } = useContext(AuthContext);
  const [show, setShow] = useState(false)
  const [stories, setStories] = useState<StoryType[]>([])

  async function fetchStories() {
    const response = await fetch(`${APIURL}/story/${user.id}`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();
    setStories(res);
  }

  useEffect(() => { 
    fetchStories();
    socket.on('story-event', ({ user_id }) => {
      if (friend.includes(user_id) || user_id == user.id) fetchStories();
    })
  }, [friend, socket])

  return (
    <div className="stories-container">
      <CreateStory show={show} setShow={setShow} />
      <div className="stories w-full">
        <div className="relative min-w-[120px] rounded-lg overflow-clip shadow-lg shadow-black-900/50" onClick={() => setShow(true)}>
          <img src={user.profile_pic} alt={user.name} className="w-full h-full object-cover" />
          <div className="bottom absolute bottom-0 left-0 w-full h-[70px] bg-gray-800 flex flex-col items-center gap-1">
            <button className="mt-[-15px]"><AddAPhoto /></button>
            <span>Add Story</span>
          </div>
        </div>
        {
          stories.sort((a) => a.is_yours ? -1 : 1).map((story) => {
            const { from, via, to } = post_bgs[story.story_bg] || {};
            return (
              <Link
                to={`/story/${story.user_id}?seen=${story.seen}`}
                className={`relative min-w-[120px] rounded-lg bg-gradient-to-br ${from} ${via} ${to} shadow-lg shadow-black-900/50`}
                style={{ background: story.story_type === 'photo' ? `url(${APIURL}/image/stories/${story.file})` : '' }}
                key={story.id}
              >
                {
                  story.story_type === 'video' ?
                    <video src={`${APIURL}/video/stories/${story.file}#t`} className="absolute top-0 left-0 w-full h-full object-cover" /> :
                    <p className="p-4 text-[.6em] text-center absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black-900/30">
                      <span className="text-white/40">{story.story_desc}</span>
                    </p>
                }
                <div className="relative z-1 flex flex-col items-start justify-end p-2 w-full h-full">
                  <img src={`${APIURL}/image/profile_pics/${story.profile_pic}`} className="w-[50px] aspect-square rounded-full object-cover shadow-md shadow-black-900/50" />
                  <span className="text-sm">{story.is_yours ? 'Your Story' : story.name}</span>
                </div>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default Stories

