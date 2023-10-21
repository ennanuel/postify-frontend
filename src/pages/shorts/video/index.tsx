import { useContext, useMemo } from 'react';
import { Add } from '@mui/icons-material';
import { APIURL } from '../../../assets/data';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../../../context/postContext';
import VideoPlayer from './VideoPlayer';
import Navigations from './Navigations';
import MobileActions from './MobileActions';

type PostContentProps = {
    goUp: () => void;
    goDown: () => void;
}

const PostContent = ({ goUp, goDown }: PostContentProps) => {
    const { post, commentId, showForMobile, showMobileComments, showMobileDesc } = useContext(PostContext);
    const hideButtons = useMemo(() => ['comment', 'desc'].includes(showForMobile || ''), [showForMobile]);
    const navigate = useNavigate();

    return (
        <article className={`relative z-1 lg:row-span-full ${commentId && 'hidden lg:block'} h-[100vh] lg:h-auto`}>
            <div className="bg-black-900 flex items-center justify-center lg:absolute left left-0 top-[-60px] w-full lg:h-[100vh] h-full overflow-clip">
                <video
                    className="absolute z-[0] top-0 left-0 w-full h-full object-cover opacity-50 blur-sm"
                    src={`${APIURL}/video/post_videos/${post.file}#t`}
                ></video>
                <VideoPlayer videoSrc={`${APIURL}/video/post_videos/${post.file}`} />
                <div className="absolute z-1 top-[50%] right-3 translate-y-[-50%] flex flex-col gap-2">
                    <Navigations goUp={goUp} goDown={goDown} />
                    <MobileActions
                        liked={post.liked}
                        post_likes={post.post_likes}
                        post_comments={post.post_comments}
                        shares={post.shares}
                        hideButtons={hideButtons}
                        showMobileDesc={showMobileDesc}
                        showMobileComments={showMobileComments}
                    />
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="close z-1 w-[40px] absolute z-1 aspect-square rounded-full rotate-45 top-3 left-3 text-xl hidden lg:flex items-center justify-center"
                >
                    <Add fontSize="large" />
                </button>
            </div>
        </article>
    )
}

export default PostContent
