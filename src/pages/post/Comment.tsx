import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { APIURL } from '../../assets/data';
import { IconButton } from '@mui/material';
import { Favorite, Comment as CommentIcon, FavoriteBorderOutlined } from '@mui/icons-material';
import { prettierTime } from '../../utils/post';

type CommentProps = {
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
    likeComment: (id: string, liked: boolean) => void;
    updateCommentId: (comment_id: string | null) => void;
};

const Comment = ({ id, content, date_uploaded, user_id, name, profile_pic, likes, liked, comments, reply_to, likeComment, updateCommentId }: CommentProps) => {
    const timePassed = useMemo(() => prettierTime(date_uploaded), [date_uploaded]);

    return (
        <div onClick={() => !reply_to && updateCommentId(id)} className="grid grid-cols-[35px,1fr] gap-2 cursor-pointer">
            <img className="w-[35px] h-[35px] rounded-full" src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" />
            <div className="flex flex-col gap-1">
                <div className="text-sm flex flex-col rounded-md">
                    <div className="flex items-center gap-1">
                        <Link to={`/profile/${user_id}`} className="font-bold">{name}</Link>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <span className="text-xs">{timePassed} ago</span>
                    </div>
                    <p className="p-2 py-1 w-full">{ content }</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 text-xs px-2">
                        <div className="reaction flex items-center gap-1">
                            { liked ? <Favorite fontSize="inherit" /> :<FavoriteBorderOutlined fontSize="inherit" /> }
                            <span>{likes}</span>
                        </div>
                        <div className="reaction flex items-center gap-1">
                            <CommentIcon fontSize="inherit" />
                            <span>{ comments }</span>
                        </div>
                    </div>
                    <IconButton
                        sx={{ padding: 0 }}
                        onClick={() => likeComment(id, liked)}
                    >
                        <span className="w-full h-full text-white text-xs px-1">Like</span>
                    </IconButton>
                    <IconButton sx={{ padding: 0 }}>
                        <span className="w-full h-full text-xs text-white px-1">Reply</span>
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default Comment
