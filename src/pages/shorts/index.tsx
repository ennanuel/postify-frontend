import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChannelDetails from './ChannelDetails';
import Video from './video';
import Actions from './Actions';
import PostDescription from './PostDescription';
import Comments from './Comments';
import { PostContextProvider } from '../../context/postContext';
import { AuthContext } from '../../context/authContext';
import { getVideoQueue } from '../../utils/post';
import './shorts.scss';

const Shorts = () => {
    const navigate = useNavigate();
    const { post_id, queue_type } = useParams();
    const { user } = useContext(AuthContext);

    const [videoQueue, setVideoQueue] = useState<string[]>([post_id || '']);
    const [index, setIndex] = useState(0);
    const [waitingForNextPosts, setWaitingForNextPosts] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);

    function goUp() {
        if (index <= 0) return;
        setIndex(index - 1);
    };
    function goDown() { 
        const nextPostsLength = videoQueue.length - 1;
        if (index >= nextPostsLength && noMorePosts) return;
        if (index >= nextPostsLength && !noMorePosts) return setWaitingForNextPosts(true);
        setIndex(index + 1);
    };    
    function updateNextPosts(res: any) {
        const result = res as string[];
        if (result.length < 1) return setNoMorePosts(true);
        setVideoQueue(prev => [...prev, ...result.filter(id => !prev.includes(id))]);
        if (waitingForNextPosts) setIndex(index + 1);
    }

    useEffect(() => {
        const queueType = queue_type || '';
        const videoQueueLengthMinusOne = videoQueue.length - 2;
        if (noMorePosts || index < videoQueueLengthMinusOne) return;
        getVideoQueue({ user_id: user.id, post_id, videoQueue, queueType })
            .then(updateNextPosts)
            .catch(error => alert(error));
    }, [index]);

    useEffect(() => { 
        const nextPost = videoQueue[index];
        if (!nextPost) return;
        setWaitingForNextPosts(false);
        navigate(`/short/${nextPost}/${queue_type}`)
    }, [index])

    return (
        <PostContextProvider>
            <div className="post grid grid-cols-1 lg:grid-cols-[1fr,400px] grid-rows-[repeat(4,auto),1fr] lg:grid-rows-[repeat(3,auto),1fr] lg:h-[calc(100vh-60px)] lg:h-[100vh] fixed lg:relative top-0 w-full z-[9999] md:overflow-clip">
                <ChannelDetails />
                <Video goUp={goUp} goDown={goDown} />
                <PostDescription />
                <Actions />
                <Comments />
            </div>
        </PostContextProvider>
    )
}

export default Shorts
