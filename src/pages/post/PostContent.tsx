import { useState, useMemo, useContext, useReducer, useRef, useEffect } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight, Add, Pause, PlayArrow, FastForward, Repeat } from '@mui/icons-material';
import { APIURL } from '../../assets/data';
import { post_bgs } from '../../assets/data/data';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../../context/postContext';
import { convertToVideoTimeFormat, videoHook } from '../../utils/post';
import { IconButton } from '@mui/material';

const Video = videoHook();
const videoState = Video.getState();
const videoReducer = Video.getReducer();

const PostContent = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const { post } = useContext(PostContext);
    const [index, setIndex] = useState(0);
    const [{ isPlaying, duration, seekTime, currentTime, percentageWatched, repeat }, setVideo] = useReducer(videoReducer, videoState);

    const { from, via, to } = useMemo(() => post_bgs[post.post_bg] || {}, [post]);
    const { timeElapsed, timeLeft } = useMemo(() => { 
        const timeElapsed = convertToVideoTimeFormat(currentTime);
        const timeLeft = convertToVideoTimeFormat(duration - currentTime);
        return { timeElapsed, timeLeft };
    }, [duration, currentTime]);
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => { 
        const value = Number(e.target.value);
        setVideo({ type: 'SETSEEK', seekTime: value });
    };
    function handleTimeUpdate() {
        const videoCurrentTime = videoRef.current?.currentTime || 0;
        setVideo({ type: 'SETCURRENT', currentTime: videoCurrentTime });
    };
    function handleLoadedData() {
        const videoDuration = videoRef.current?.duration || 1;
        setVideo({ type: 'START', duration: videoDuration });
    };
    function play() {
        setVideo({ type: 'PLAY' })
        videoRef.current?.play();
    };
    function pause() { 
        setVideo({ type: 'PAUSE' })
        videoRef.current?.pause();
    };
    function handleRepeat() { setVideo({ type: 'SETREPEAT', repeat: !repeat }) };
    function forward() { setVideo({ type: 'FORWARD', timeInSeconds: 1 }) };
    function backward() { setVideo({ type: 'BACKWARD', timeInSeconds: 1 }) };
    function restart() { 
        if (!repeat) return setVideo({ type: 'PAUSE' });
        videoRef.current?.play();
        setVideo({ type: 'RESTART' });
    };

    useEffect(() => {
        if (!videoRef.current?.currentTime) return;
        videoRef.current.currentTime = seekTime
    }, [seekTime]);

    return (
        <article className="relative lg:row-span-full h-full">
            <div className="post_content left absolute left-0 top-0 lg:top-[-60px] w-full lg:h-[100vh] h-full">
                {
                    post.post_type === 'text' ?
                        <div className='relative z-[0] bg-gradient-to-br font-bold text-white text-3xl w-full h-full flex items-center justify-center md:p-4'>
                            <div className={`absolute z-[0] top-0 left-0 w-full h-full bg-gradient-to-br ${from} ${via} ${to} opacity-60`}></div>
                            <p className='relative flex items-center justify-center backdrop-blur-lg font-bold w-full max-w-[500px] min-h-[400px] md:rounded-lg p-[5%] overflow-hidden'>
                                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-tl ${from} ${via} ${to}`}></div>
                                <span className='relative z-1 text-center'>{ post.post_desc }</span>
                            </p>
                        </div> :
                        <div className="post-content relative z-[0] flex justify-center items-center h-full overflow-hidden">
                            <span className="absolute z-[2] top-3 left-3 rounded-md px-3 flex py-1 text-sm font-bold bg-black-900/60 shadow">
                                {`${index+1}/${post?.files?.length}`}
                            </span>
                            <div
                                style={{ backgroundImage: `url(${APIURL}/image/post_images/${post.files && post.files[index]})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}
                                className="content w-full h-full"
                            >
                                {
                                    post.post_type === 'video' &&
                                        <video className="absolute top-0 left-0 w-full h-full object-cover" src={`${APIURL}/video/post_videos/${post.files && post.files[index]}#t`}></video>
                                }
                                <div className="p-2 h-full w-full flex items-center justify-center bg-black-900/50 backdrop-blur-md">
                                    {
                                        post.post_type === 'photo' ?
                                            <img
                                                src={`${APIURL}/image/post_images/${post.files && post.files[index]}`}
                                                className="object-contain w-auto h-auto max-w-full max-h-full block rounded-lg" alt="post image"
                                            /> :
                                            <div className="relative">
                                                <video
                                                    ref={videoRef}
                                                    src={`${APIURL}/video/post_videos/${post.files && post.files[index]}`} className="object-contain w-auto h-auto max-w-full max-h-full block rounded-lg"
                                                    controls={false}
                                                    autoPlay={true}
                                                    onLoadedData={handleLoadedData}
                                                    onTimeUpdate={handleTimeUpdate}
                                                    onEnded={restart}
                                                />
                                                <div className="absolute bottom-0 left-0 w-[calc(100%-20px)] m-[10px] flex flex-col gap-1 bg-black-900/50 p-2 rounded-md backdrop-blur-sm">
                                                    <div className='flex flex-col gap-1'>
                                                        <div className="relative rounded-md overflow-hidden shadow">
                                                            <div className="w-full h-2 pointer-events-none bg-black-900/50">
                                                                <div style={{ maxWidth: percentageWatched }} className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-md" />
                                                            </div>
                                                            <input type="range" value={seekTime} className="absolute top-0 left-0 w-full block opacity-0" min={0} max={duration} onChange={handleChange} />
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs font-semibold">
                                                            <span>{timeElapsed}</span>
                                                            <span>- {timeLeft}</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center justify-center gap-3'>
                                                        <IconButton onClick={backward} sx={{ padding: 0, margin: 0 }}>
                                                            <span className="flex items-center justify-center h-[30px] aspect-square rounded bg-black-900/20 rotate-180 active:bg-white active:text-black-500">
                                                                <FastForward fontSize="small" />
                                                            </span>
                                                        </IconButton>
                                                        <IconButton onClick={isPlaying ? pause : play} sx={{ padding: 0, margin: 0 }}>
                                                            <span className={`flex items-center justify-center h-[40px] aspect-square rounded ${isPlaying ? 'bg-black-500/30' : 'bg-white text-black-500'}`}>
                                                                { isPlaying ? <Pause /> : <PlayArrow /> }
                                                            </span>
                                                        </IconButton>
                                                        <IconButton onClick={forward} sx={{ padding: 0, margin: 0 }}>
                                                            <span className="flex items-center justify-center h-[30px] aspect-square rounded bg-black-900/20 active:bg-white active:text-black-500">
                                                                <FastForward fontSize="small" />
                                                            </span>
                                                        </IconButton>
                                                        <div className="flex-1 flex items-center justify-end">
                                                            <IconButton onClick={handleRepeat}>
                                                                <span className={`flex items-center justify-center h-[30px] aspect-square rounded ${repeat ? 'bg-white text-black-500' : ' bg-black-900/20'}`}>
                                                                    <Repeat fontSize="small" />
                                                                </span>
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            <button
                                onClick={() => setIndex( prev => Math.max(prev - 1, 0))}
                                className={`${index === 0 && 'opacity-0'} ${post?.files?.length <= 1 && 'hidden'} absolute top-[50%] translate-y-[-50%] py-4 px-1 rounded-[5px] left-1 md:left-3`}
                            >
                                <KeyboardArrowLeft />
                            </button>
                            <button
                                onClick={() => setIndex( prev => Math.min(prev + 1, post?.files?.length - 1))}
                                className={`${index === post?.files?.length - 1 && 'opacity-0'} ${post.post_type === 'text' && 'hidden'} absolute top-[50%] translate-y-[-50%] py-4 px-1 rounded-[5px] right-1 md:right-3`}
                            >
                                <KeyboardArrowRight />
                            </button>
                        </div>
                    }
                    <button
                        onClick={() => navigate(-1)}
                        className="close z-1 w-[40px] aspect-square rounded-full rotate-45 absolute top-[15px] left-[15px] text-xl hidden lg:flex items-center justify-center"
                    ><Add fontSize="large" /></button>
                </div>
            </article>
    )
}

export default PostContent
