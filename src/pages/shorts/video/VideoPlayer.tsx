import { useEffect, useRef, useReducer } from 'react';
import { PauseSharp, PlayArrow } from '@mui/icons-material';
import { videoHook } from '../../../utils/post';

const Video = videoHook();
const videoState = Video.getState();
const videoReducer = Video.getReducer();

const VideoPlayer = ({ videoSrc }: { videoSrc: string; }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [{ isPlaying, duration, seekTime, currentTime, percentageWatched }, setVideo] = useReducer(videoReducer, videoState);

    const handleSeek: React.ChangeEventHandler<HTMLInputElement> = (e) => { 
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
    function restart() { 
        setVideo({ type: 'RESTART' });
        videoRef.current?.play();
    };

    useEffect(() => {
        if (!videoRef.current?.currentTime) return;
        videoRef.current.currentTime = currentTime;
    }, [currentTime]);

    return (
        <div className="relative lg:h-[calc(100%-20px)] overflow-hidden lg:rounded-lg w-full md:w-auto max-w-[480px]">
            <video
                ref={videoRef}
                src={videoSrc}
                className="relative lg:h-full max-w-[480px] w-full lg:w-auto shadow-lg shadow-black-900/30 object-fit"
                autoPlay={true}
                controls={false}
                onLoadedData={handleLoadedData}
                onTimeUpdate={handleTimeUpdate}
                onEnded={restart}
            />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <button
                    onClick={() => isPlaying ? pause() : play()}
                    className={`w-full h-full bg-black-900/50 flex items-center justify-center transition-[opacity,transform] ${isPlaying && 'opacity-0 lg:hover:opacity-100 scale-[120%] lg:scale-100'}`}
                >
                    <span className='flex items-center justify-center w-[60px] aspect-square rounded-full bg-black-900/40 text-white backdrop-blur-sm'>
                        {
                            isPlaying ?
                                <PauseSharp fontSize="large" /> :
                                <PlayArrow fontSize="large" />
                        }
                    </span>
                </button>
                <div className="w-full md:p-2 absolute bottom-0 left-0 flex flex-col gap-6 items-end justify-end">
                    <div className="relative bg-black-900/50 backdrop-blur-sm w-full h-2 md:rounded-lg overflow-hidden md:shadow shadow-black-900/20">
                        <div
                            style={{ width: percentageWatched }}
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-600 origin-left absolute top-0 left-0 pointer-events md:rounded-md"
                        />
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            value={seekTime}
                            onChange={handleSeek}
                            className="h-full w-full relative bg-blue-700 block opacity-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
