import { useState, useContext, useMemo } from 'react';
import { IconButton } from "@mui/material";
import { SendRounded, KeyboardArrowDown } from '@mui/icons-material';
import Comment from "./Comment";
import { PostContext } from "../../context/postContext";
import { AuthContext } from '../../context/authContext';

const Comments = () => {
    const { user } = useContext(AuthContext)
    const { comments, commentId, commentInFocus, showForMobile, updateCommentId, handlePostComment, handleLikeComment, hideAll } = useContext(PostContext);
    const show = useMemo(() => showForMobile === 'comment', [showForMobile])

    const [reply, setReply] = useState('');

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handlePostComment(reply);
    }

    function hideComments() {
        updateCommentId(null);
        hideAll();
    }

    return (
        <div className={`post-comments absolute z-[999999] lg:relative w-full top-0 bg-black-500 left-0 grid grid-rows-[auto,auto,1fr,auto] overflow-y-scroll h-full transition-transform ${show ? 'lg:row-span-full' : 'translate-y-[110%] lg:translate-y-0'}`}>
            <div className="flex items-center justify-end sticky top-0 py-2 px-4 border-y">
                <button
                    className={`${show ? 'flex' : 'hidden'} w-8 flex items-center justify-center`}
                    onClick={hideComments}
                >
                    <KeyboardArrowDown fontSize="small" />
                </button>
                <p className="flex-1 text-right font-bold">Comments</p>
            </div>
            <div className="flex flex-col gap-2">
                {commentId && <Comment likeComment={handleLikeComment} updateCommentId={updateCommentId} {...commentInFocus} /> }
            </div>
            <ul className="comments-container max-h-full flex flex-col gap-3 p-3">
                {
                    comments.map((comment) => (
                        <li key={comment.id}>
                            <Comment likeComment={handleLikeComment} updateCommentId={updateCommentId} {...comment} />
                        </li>
                    ))
                }
            </ul>
                
            <form className="create-comment sticky bottom-0 flex gap-2 p-2 border-t" onSubmit={handleSubmit}>
                <img className='w-[40px] h-[40px] rounded-full' src={user.profile_pic} alt={user.name} />
                <div className="textarea flex items-center gap-2 flex-1 h-[40px] rounded-[40px] px-1">
                    <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="px-2 h-full outline-none border-none text-sm flex-1"
                        id="comment"
                        type="text"
                        placeholder={commentId ? "Reply comment..." : "Post a Comment..."}
                    />
                    <IconButton
                        type="submit"
                        style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                    >
                        <SendRounded fontSize="small" />
                    </IconButton>
                </div>
            </form>
        </div>
    )
}

export default Comments
