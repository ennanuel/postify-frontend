import { Link } from 'react-router-dom';
import { IconButton } from "@mui/material";
import { Message, MessageOutlined, SendRounded, Favorite, KeyboardArrowLeft } from '@mui/icons-material'

type CommentType = {
    id: string;
    content: string;
    date_uploaded: string;
    user_id: string;
    name: string;
    profile_pic: string;
    likes: number;
    liked: boolean;
    comments: number;
    reply_to: string;
}

type CommentPropsType = {
    comment: string|null;
    setComment: React.Dispatch<React.SetStateAction<string|null>>;
    commentDetails: CommentType;
    comments: CommentType[];
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
    likeComment: ( comment_id: string, liked: boolean) => void;
    user: {
        id: string;
        name: string;
        profile_pic: string;
    }
}

const Comments = ({ comment, setComment, commentDetails, comments, likeComment, content, setContent, handleSubmit, user } : CommentPropsType) => {
    
    return (
        <>
            <div className="flex items-center justify-end mb-3 sticky top-0">
                {
                    comment &&
                    <button className="w-8 flex items-center justify-center" onClick={() => setComment(null)}>
                        <KeyboardArrowLeft fontSize="small" />
                    </button>
                }
                <p className="flex-1 text-right font-bold">Comments</p>
            </div>
            {
                comment &&
                    <div className="flex flex-col gap-2 py-2 mb-3">
                        <div className="grid grid-cols-7 gap-2 border-b pb-3">
                            <div>
                                <img className="w-full aspect-square rounded-full bg-white" src={commentDetails.profile_pic} alt="" />
                            </div>
                                
                            <div className="col-span-6 flex flex-col gap-2">
                                <div className="flex flex-col gap-1 text-sm">
                                    <p className="font-bold">
                                        {commentDetails.name},
                                        <span className='font-normal text-xs'>{commentDetails.date_uploaded}</span>
                                    </p> 
                                    <p className="p-1 px-2 rounded-md bg-white/5">{commentDetails.content}</p>
                                </div>
                            <div className="flex items-center gap-2 text-xs">
                                    <button className='flex items-center justify-center gap-1 px-2 py-[3px] rounded-[12px] bg-white/5'>
                                        <Favorite fontSize="small" />
                                        {commentDetails.likes}
                                    </button>
                                    <button className='flex items-center justify-center gap-1 px-2 py-[3px] rounded-[12px] bg-white/5'>
                                        <MessageOutlined fontSize="small" />
                                        {commentDetails.comments}
                                    </button>
                            </div>
                        </div>
                    </div>
                 </div>
            }
                <ul className="comments-container flex-1 flex flex-col gap-3">
                    {
                        comments.map(({ id, content, date_uploaded, user_id, name, profile_pic, likes, liked, comments, reply_to }) => (
                            <div key={id}className="comment-msg flex items-start gap-2">
                                <img className="min-w-[35px] h-[35px] rounded-full border" src={profile_pic} alt="" />
                                <div className="msg flex flex-col gap-1">
                                    <div
                                        onClick={() => !reply_to && setComment(id)}
                                        className="comment-text text-sm flex flex-col p-2 rounded-md"
                                    >
                                        <Link to={`/profile/${user_id}`} className="font-bold">{ name }</Link>
                                        <p className="px-1">{ content }</p>
                                    </div>
                                    <div className="comment-actions flex items-center gap-1">
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="reaction flex items-center gap-1 px-2 h-[24px] rounded-[12px]">
                                                <Favorite fontSize="inherit" />
                                                <span>{likes}</span>
                                            </div>
                                            <div className="reaction flex items-center gap-1 px-2 h-[24px] rounded-[12px]">
                                                <Message fontSize="inherit" />
                                                <span>{ comments }</span>
                                            </div>
                                        </div>
                                        <IconButton
                                            sx={{ backgroundColor: liked ? 'rgba(225, 50, 50, 0.2)' : '', color: liked ? 'rgb(163, 2, 2)' : '' }}
                                            onClick={() => likeComment(id, liked)}
                                        >Like</IconButton>
                                        <IconButton>reply</IconButton>
                                        <span className="text-xs">{date_uploaded}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </ul>
                
            <form className="create-comment sticky bottom-0 flex gap-2 p-2 pb-0 border-t" onSubmit={handleSubmit}>
                <img className='w-[40px] rounded-full aspect-square' src={user.profile_pic} alt={user.name} />
                <div className="textarea flex items-center gap-2 flex-1 h-[40px] rounded-[40px] px-1">
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="px-2 h-full outline-none border-none text-sm flex-1"
                        id="comment"
                        type="text"
                        placeholder={comment ? "Reply comment..." : "Post a Comment..."}
                    />
                    <IconButton type="submit"><SendRounded fontSize="small" /></IconButton>
                </div>
            </form>
        </>
    )
}

export default Comments
