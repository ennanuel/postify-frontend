import { useContext, useMemo } from 'react'
import { PostContext } from '../../context/postContext'

const PostDescription = () => {
    const { showForMobile, post: { post_type, post_desc } } = useContext(PostContext);
    const showingComments = useMemo(() => showForMobile === 'comment', [showForMobile]);
    
    return (
        <div className={`overflow-clip ${showingComments && 'lg:hidden'} ${post_type === 'text' && 'h-0'}`}>
            <p className="post-desc p-4 lg:mx-2 bg-black-900/50 lg:rounded-lg">
                {post_desc}
            </p>
        </div>
    )
}

export default PostDescription
