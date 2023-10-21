import { useContext, useMemo } from 'react'
import { PostContext } from '../../context/postContext'
import { KeyboardArrowDown } from '@mui/icons-material';

const PostDescription = () => {
    const { showForMobile, post: { post_desc }, hideAll } = useContext(PostContext);
    const show = useMemo(() => showForMobile === 'desc' || (showForMobile !== 'comment' && window.innerWidth > 1024), [showForMobile, window.innerWidth]);

    return (
        <div className={`post-desc absolute z-[2] lg:relative p-2 bottom-0 left-0 w-full origin-bottom transition-[transform,opacity] ${!show && 'lg:hidden scale-y-75 opacity-0 lg:opacity-100 lg:scale-y-100 pointer-events-none'}`}>
            <div className="p-2 rounded-lg bg-black-500 shadow-lg shadow-black-900/50 min-h-[150px] lg:min-h-fit flex flex-col gap-2">
                <div className="flex lg:hidden items-center justify-between gap-4">
                    <h2 className="font-bold text-lg">Description</h2>
                    <button onClick={hideAll} className=" flex items-center justify-center">
                        <KeyboardArrowDown />
                    </button>
                </div>
                <p className="flex-1">
                    {post_desc}
                </p>
            </div>
        </div>
    )
}

export default PostDescription
