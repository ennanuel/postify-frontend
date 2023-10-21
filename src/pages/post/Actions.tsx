import { IconButton } from "@mui/material"
import { ShareOutlined, FavoriteOutlined, FavoriteBorderOutlined, MessageOutlined } from "@mui/icons-material"
import { useContext, useMemo } from "react";
import { PostContext } from "../../context/postContext";

const Actions = () => {
    const { showForMobile, handleLikePost, showMobileComments, post: { post_likes, post_comments, shares, liked } } = useContext(PostContext);
    const showingComments = useMemo(() => showForMobile === 'comment', [showForMobile]);
    return (
         <div className={`actions flex items-center gap-3 p-2 px-4 ${showingComments ? 'lg:hidden' : 'flex'}`}>
            <IconButton sx={{ padding: '0' }}
                onClick={handleLikePost}
            >
                <span className="flex items-center justify-center gap-1 h-[34px] rounded-[17px] bg-white/5 text-white px-3 text-sm">
                    {
                        liked ?
                            <FavoriteOutlined fontSize="small" /> :
                            <FavoriteBorderOutlined fontSize="small" />
                    }
                    <span>{post_likes}</span>
                </span>
            </IconButton>
            <IconButton onClick={showMobileComments} sx={{ padding: '0' }}>
                <label htmlFor="comment" className="flex items-center justify-center gap-1 h-[34px] rounded-[17px] bg-white/5 text-white text-sm px-3">
                    <MessageOutlined fontSize="small" />
                    <span>{post_comments}</span>
                </label>
            </IconButton>
            <IconButton sx={{ padding: '0' }}>
                <span className="flex items-center justify-center gap-1 h-[34px] rounded-[17px] bg-white/5 text-white px-3 text-sm">
                    <ShareOutlined fontSize="small" />
                    <span>{shares}</span>
                </span>
            </IconButton>
        </div>
    )
}

export default Actions
