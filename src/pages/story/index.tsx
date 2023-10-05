import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { AddRounded, MoreHoriz, VolumeOff, SendOutlined, FavoriteBorderOutlined, ChevronLeft, ChevronRight, RemoveRedEyeRounded, KeyboardArrowLeft, } from '@mui/icons-material'
import './story.scss'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data';
import { AuthContext } from '../../context/authContext';
import { fetchOptions, post_bgs } from '../../assets/data/data';

type StoryInfoType = {
  id: string;
  story_desc: string;
  file: string;
  story_bg: 'none' | 'red' | 'blue' | 'black' | 'white';
  story_type: 'text' | 'photo' | 'video';
  story_likes: number;
  liked: boolean;
  is_yours: boolean;
  has_seen: boolean;
  views: number;
  time_posted: string;
}

type StoryType = {
  user_id: string;
  username: string;
  first_name: string;
  profile_pic: string;
  stories: string[];
  file?: string;
  seen: number;
  is_yours: boolean;
  posted: string;
}

let timeout : NodeJS.Timeout;

const Story = () => {
  const { user } = useContext(AuthContext)
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [animate, setAnimate] = useState(false)
  const [progress, setProgress] = useState('')
  
  // This contains stories the user can view
  const [stories, setStories] = useState<StoryType[]>([])

  // This is the stories the user is currently viewing
  const [activeStory, setActiveStory] = useState({} as StoryType)

  // This is the story information of the current story
  const [story, setStory] = useState({} as StoryInfoType);

  const timeUploaded = useMemo(() => { 
    const timePassed = (new Date()).getTime() - (new Date(story.time_posted)).getTime();
    return timePassed <= 60*1000 ?
      Math.floor(timePassed/1000) + ' sec' :
      timePassed <= 60 * 60 * 1000 && timePassed > 60 * 1000 ?
        Math.floor(timePassed/(1000*60)) + ' min' :
        Math.floor(timePassed/(60*60*1000)) + ' hr'
  }, [story])

  // This is sets the backgroud of the story if it is of type 'text'
  const {from, via, to} = useMemo(() => post_bgs[story.story_bg] || {}, [story])

  // prevStories is the stories the user can see before the activeStory and vice versal for nextStories
  const { nextStories, prevStories } = useMemo(() => {
    const index = stories.findIndex(story => story.user_id === id)
    const activeStory = stories[index]
    const prevStories = stories.slice(index - 2 < 0 ? 0 : index - 2, index);
    const nextStories = stories.slice(index + 1 > stories.length ? stories.length : index + 1, index + 3)

    setActiveStory({
      ...activeStory,
      seen: activeStory?.seen >= activeStory?.stories?.length
        ? activeStory?.stories?.length - 1 :
        activeStory?.seen
    })
    return { prevStories, nextStories }
  }, [stories, id])

  // The logic for navigating to the next story
  function next() {
    clearTimeout(timeout);

    if (activeStory?.seen + 1 < activeStory?.stories?.length) {
      setActiveStory({...activeStory, seen: activeStory.seen + 1})
    } else if (activeStory.seen + 1 >= activeStory?.stories?.length && nextStories?.length > 0) {
      const user_id = nextStories[0].user_id
      navigate(`/story/${user_id}`)
    } else {
      navigate('/')
    }
  }

  // The logic for navigating to the previous story
  function prev() {
    clearTimeout(timeout);

    if (activeStory.seen - 1 >= 0) {
      setActiveStory({...activeStory, seen: activeStory.seen - 1})
    } else if (activeStory.seen - 1 < 0 && prevStories.length > 0) {
      const user_id = prevStories[prevStories.length - 1].user_id
      navigate(`/story/${user_id}`)
    }
  }

  function start() { 
    clearTimeout(timeout);

    setAnimate(true)
    timeout = setTimeout(() => {
      next()
    }, 5000)
  };

  // The logic for when a person sees the story
  async function watchStory() {
    if (!activeStory.user_id || story.has_seen !== false || activeStory.is_yours) return;

    const story_id = activeStory.stories[activeStory.seen];
    const options = { ...fetchOptions, method: 'PUT', body: JSON.stringify({ user_id: user.id, story_id }) }
    const response = await fetch(`${APIURL}/story/watch`, options);
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();
    setStories(stories.map(story => story.user_id === id ? { ...story, seen: activeStory.seen } : story));
    return alert(res.message);
  }

  async function fetchStories() {
    const response = await fetch(`${APIURL}/story/${user.id}?type=more`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong');
    const res : StoryType[] = await response.json();
    setStories(res.sort((a) => a.is_yours ? -1 : 1));
  }

  async function fetchStory() {
    const index = activeStory.seen
    const response = await fetch(`${APIURL}/story/detail/${activeStory.stories[index]}?user_id=${user.id}`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();
    setStory(res);
    if (res.story_type !== 'video') start();
  }

  useEffect(() => { 
    fetchStories();
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!activeStory) return;
    fetchStory();
  }, [activeStory])

  useEffect(() => { watchStory() }, [story]);

  const handleTimeUpdate = () => { 
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    setProgress( ((currentTime / duration)).toFixed(2) )
  }

  return (
    <div className="stories-page lg:p-4 absolute top-0 left-0 w-[100vw] h-[100vh] z-[99999] overflow-clip">
      <div className="top px-[20px] py-[10px] w-full absolute top-0 left-0 hidden md:flex items-center justify-between gap-[20px]">
        <h3 className="logo text-xl font-bold">postify</h3>
        <Link to="/" className="flex items-center justify-center rotate-45 rounded-full aspect-square h-[40px]">
          <AddRounded />
        </Link>
      </div>
      <ul className="bottom h-full flex items-center justify-evenly gap-[20px]">
        {
          prevStories.map(({ user_id, username, profile_pic, posted, file }) => (
            <li
              key={user_id}
              className="story h-[250px] w-[150px] rounded-[10px] p-[10px] hidden md:flex flex-col items-center justify-center gap-[10px]"
            >
              <div className="user-profile p-[3px] rounded-full w-[80px] aspect-square">
                <img className='w-full h-full rounded-full' src={profile_pic} alt="" />
              </div>
              <p className="name">{ username }</p>
              <p className="time">{ posted }</p>
            </li>
          ))
        }
        <li className="main-story group relative w-[360px] h-full md:max-h-[720px] lg:max-h-[1240px] md:rounded-lg md:border border-white/5 overflow-clip">
          {
            story.story_type === 'text' ?
              <p className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${from} ${via} ${to}`}>
                <span className={`text-center text-3xl font-bold`}>{story.story_desc}</span>
              </p> :
              story.story_type === 'photo' ?
                <div style={{ background: `url(${APIURL}/image/stories/${story.file})` }} className='w-full h-full'>
                  <div className="w-full h-full backdrop-blur-lg flex items-center justify-center bg-black-900/50">
                    <img className="w-full" src={`${APIURL}/image/stories/${story.file}`} alt="" />
                  </div>
                </div> :
                <div className="relative z-[0] w-full h-full flex items-center justify-center">
                  <video src={`${APIURL}/video/stories/${story.file}#t`} className="absolute top-0 left-0 w-full h-full object-cover blur-lg"></video>
                  <video
                    ref={videoRef}
                    src={`${APIURL}/video/stories/${story.file}`}
                    onLoad={() => setProgress('0')}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => next()}
                    autoPlay={true}
                    controls={false}
                    className="relative w-full"
                  />
                </div>
          }
          <button onClick={prev} className="absolute top-[50%] left-0 lg:left-2 translate-y-[-50%] flex items-center justify-center h-full lg:h-[70px] w-[40%] lg:w-auto px-2 rounded-md bg-black-900/30 text-white shadow-md backdrop-blur-lg shadow-black-900/50 transition-opacity opacity-0 group-hover:lg:opacity-100"><ChevronLeft /></button>
          <button onClick={next} className="absolute top-[50%] right-0 lg:right-2 translate-y-[-50%] flex items-center justify-center h-full lg:h-[70px] w-[40%] lg:w-auto px-2 rounded-md bg-black-900/30 text-white shadow-md backdrop-blur-lg shadow-black-900/50 transition-opacity opacity-0 group-hover:lg:opacity-100"><ChevronRight /></button>
          <div className="w-full min-w-full absolute top-0 left-0 flex flex-col p-4 bg-gradient-to-b from-black-900/80 to-transparent transition-opacity">
            <div className="durations h-[4px] flex gap-[8px]">
              {
                activeStory?.stories?.map((elem) => (
                  <div key={elem} className="bg-white/20 flex-1 rounded-[2px] h-full overflow-clip">
                    {
                      elem == story.id &&
                      <div
                        style={{ transform: `scaleX(${ story.story_type === 'video' && progress})` }}
                        className={`bg-white w-full h-full origin-left scale-x-0 transition-transform ${animate && story.story_type !== 'video' ? 'animate-stretch' : ''}`}
                      />
                    }
                  </div>
                ))
              }
            </div>
            <div className="details-action flex items-center gap-[4px] mt-[10px]">
              <Link to="/" className="lg:hidden flex items-center justify-center w-2 mr-2"><KeyboardArrowLeft /></Link>
              <img className="w-[35px] aspect-square rounded-full object-cover" src={`${APIURL}/image/profile_pics/${activeStory.profile_pic}`} alt="" />
              <div className="flex-1 ml-[5px] flex flex-col">
                <p className='mb-[-2px] font-bold'>{activeStory?.username}</p>
                <div className="text-xs text-white flex items-center gap-1">
                  <span className="block w-2 aspect-square rounded-full bg-white/50"></span>
                  <span>{timeUploaded} ago</span>
                </div>
              </div>
              {story.story_type === 'video' && <button className="mute"><VolumeOff /></button>}
            </div>
          </div>
          {
            story.is_yours ?
              <div className='text-white px-4 py-2 w-full absolute bottom-0 left-0 flex flex-col gap-1 backdrop-blur-sm bg-gradient-to-t from-black-900/80 to-transparent transition-opacity group-hover:lg:opacity-0'>
                {story.story_type !== 'text' && <p>{story.story_desc}</p>}
                <div className="flex items-center justify-between gap-2">
                  <button className="flex items-center justify-center gap-1">
                    <RemoveRedEyeRounded />
                    <span>{story.views}</span>
                  </button>
                  <button className="flex items-center justify-center"><MoreHoriz /></button>
                </div>
              </div> :
              <div className="reply w-full p-[20px] absolute bottom-0 left-0 flex items-center gap-[5px]">
                <input className="flex-1 px-[15px] h-[40px] rounded-[20px] outline-none" type="text" placeholder={`Reply to ${activeStory?.first_name}'s Story`} />
                <button><FavoriteBorderOutlined /></button>
                <button><SendOutlined /></button>
              </div>
          }
        </li>
        {
          nextStories.map(({ user_id, username, profile_pic, posted, file }) => (
            <li
              key={user_id}
              className="story h-[250px] w-[150px] rounded-[10px] p-[10px] hidden md:flex flex-col items-center justify-center gap-[10px]"
            >
              <div className="user-profile p-[3px] rounded-full w-[80px] aspect-square">
                <img className='w-full h-full rounded-full' src={profile_pic} alt="" />
              </div>
              <p className="name">{ username }</p>
              <p className="time">{ posted }</p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Story
