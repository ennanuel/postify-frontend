import { IconButton } from "@mui/material";
import { MessageOutlined, SendRounded, Favorite, KeyboardArrowLeft } from '@mui/icons-material';
import Comment from "./Comment";
import { APIURL } from '../../assets/data';

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
        <div className={`post-comments grid grid-rows-[auto,auto,1fr,auto] overflow-y-scroll h-full ${comment && 'row-span-full'}`}>
            <div className="flex items-center justify-end sticky top-0 py-2 px-4 border-y">
                {
                    comment &&
                    <button className="w-8 flex items-center justify-center" onClick={() => setComment(null)}>
                        <KeyboardArrowLeft fontSize="small" />
                    </button>
                }
                <p className="flex-1 text-right font-bold">Comments</p>
            </div>
            <div className="flex flex-col gap-2">
                {
                    comment &&
                        <div className="grid grid-cols-[40px,1fr] gap-2 border-b px-4 py-2">
                            <div>
                                <img className="w-full aspect-square rounded-full bg-white" src={`${APIURL}/image/profile_pics/${commentDetails.profile_pic}`} alt="" />
                            </div>
                                <div className="flex flex-col gap-2">
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
                }
            </div>
            <ul className="comments-container max-h-full flex flex-col gap-3 p-3">
                {
                    comments.map((comment) => (
                        <li key={comment.id}>
                            <Comment likeComment={likeComment} setComment={setComment} {...comment} />
                        </li>
                    ))
                }
            </ul>
                
            <form className="create-comment sticky bottom-0 flex gap-2 p-2 border-t" onSubmit={handleSubmit}>
                <img className='w-[40px] h-[40px] rounded-full' src={user.profile_pic} alt={user.name} />
                <div className="textarea flex items-center gap-2 flex-1 h-[40px] rounded-[40px] px-1">
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="px-2 h-full outline-none border-none text-sm flex-1"
                        id="comment"
                        type="text"
                        placeholder={comment ? "Reply comment..." : "Post a Comment..."}
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
