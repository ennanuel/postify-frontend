import { IconButton } from '@mui/material';
import { Favorite, FavoriteBorderOutlined, CommentOutlined, Share, InfoOutlined } from '@mui/icons-material';

type MobileActionsProps = {
    liked: boolean;
    post_likes: number;
    post_comments: number;
    shares: number;
    hideButtons: boolean;
    showMobileDesc: () => void;
    showMobileComments: () => void;
}

const MobileActions = ({ liked, post_likes, post_comments, shares, hideButtons, showMobileDesc, showMobileComments }: MobileActionsProps) => {
    return (
        <div className={`lg:hidden flex flex-col justify-center gap-3 transition-opacity ${hideButtons && 'opacity-0 pointer-events-none'}`}>
            <span className='flex flex-col text-white justify-center items-center gap-1'>
                <IconButton sx={{ padding: 0, margin: 0 }}>
                    <span className='flex text-white items-center justify-center w-[40px] aspect-square rounded-full bg-black-900/40'>{liked ? <Favorite /> : <FavoriteBorderOutlined />}</span>
                </IconButton>
                <span className="text-sm">{post_likes}</span>
            </span>
            <span className='flex flex-col text-white justify-center items-center gap-1'>
                <IconButton sx={{ padding: 0, margin: 0 }} onClick={showMobileComments}>
                    <span className='flex text-white items-center justify-center w-[40px] aspect-square rounded-full bg-black-900/40'><CommentOutlined /></span>
                </IconButton>
                <span className="text-sm">{post_comments}</span>
            </span>
            <span className='flex flex-col text-white justify-center items-center gap-1'>
                <IconButton sx={{ padding: 0, margin: 0 }}>
                    <span className='flex text-white items-center justify-center w-[40px] aspect-square rounded-full bg-black-900/40'><Share /></span>
                </IconButton>
                <span className="text-sm">{shares}</span>
            </span>
            <IconButton sx={{ padding: 0, margin: 0 }} onClick={showMobileDesc}>
                <span className='flex items-center justify-center text-white w-[40px] aspect-square rounded-full bg-black-900/40'><InfoOutlined /></span>
            </IconButton>
        </div>
    )
}

export default MobileActions
