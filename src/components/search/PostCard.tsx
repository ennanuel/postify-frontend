import { Favorite, MessageRounded, ShareRounded } from "@mui/icons-material";
import { APIURL } from "../../assets/data";
import { Link } from "react-router-dom";
import { PostType } from "../../types/post.types";

const PostCard = ({ id, user_id, post_desc, files, post_type, profile_pic, name, post_likes, post_comments, shares, date_posted }: PostType) => {
    return (
        <div className="flex flex-col border border-white/5">
            <div className="flex items-center gap-2 p-2 border-b border-white/5">
                <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" className="w-[30px] h-[30px] rounded-full bg-white/5" />
                <div className="flex flex-col flex-1">
                    <Link to={`/profile/${user_id}`} className='text-sm'>{name}</Link>
                    <p className="text-xs">20 mins</p>
                </div>
                <Link to={`/post/${id}`} className="px-3 py-1 rounded-[17px] bg-white text-black-900 text-sm font-semibold">View Post</Link>
            </div>
            <p className="text-sm p-2">{post_desc}</p>
            <div className="flex items-center gap-2 text-sm p-2 border-t border-white/5">
                <div className="flex-1 flex gap-2 items-center border-r border-white/5">
                    <span className="flex items-center justify-center gap-1 px-2 py-[4px] rounded-[15px] bg-white/5">
                        <Favorite fontSize="small" />
                        <span>{post_likes}</span>
                    </span>
                    <span className="flex items-center justify-center gap-1 px-2 py-[4px] rounded-[15px] bg-white/5">
                        <MessageRounded fontSize="small" />
                        <span>{post_comments}</span>
                    </span>
                    <span className="flex items-center justify-center gap-1 px-2 py-[4px] rounded-[15px] bg-white/5">
                        <ShareRounded fontSize="small" />
                        <span>{shares}</span>
                    </span>
                </div>
                {
                    post_type !== 'text' &&
                    <span className="px-2 py-[2px] rounded-[10px] bg-blue-700/20 text-blue-400 gap-1 font-semibold">
                        {files?.length > 3 ? '3+ pics' : files?.length + ` pic ${files?.length > 1 ? 's' : ''}`}
                    </span>
                }
            </div>
        </div>
    )
}

export default PostCard
