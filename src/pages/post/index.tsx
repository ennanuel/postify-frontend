import UserDetails from './UserDetails'
import PostContent from './PostContent'
import Actions from './Actions'
import PostDescription from './PostDescription'
import Comments from './Comments'
import { PostContextProvider } from '../../context/postContext'
import './post.scss';

const Shorts = () => (
    <PostContextProvider>
        <div className="post grid grid-cols-1 lg:grid-cols-[1fr,400px] grid-rows-[auto,1fr,auto,auto] lg:grid-rows-[repeat(3,auto),1fr] lg:h-[calc(100vh-60px)] h-[100vh] fixed lg:relative top-0 w-full z-[9999] md:overflow-clip">
            <UserDetails />
            <PostContent />
            <PostDescription />
            <Actions />
            <Comments />
        </div>
    </PostContextProvider>
)

export default Shorts
