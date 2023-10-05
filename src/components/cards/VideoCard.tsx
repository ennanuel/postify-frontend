import { FavoriteBorder, Favorite, MessageOutlined } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { APIURL } from "../../assets/data";

type VideoCardProps = {
    id: string;
    post_desc: string;
    channel_name: string;
    channel_id: string;
    file: string;
    picture: string;
    post_likes: number;
    post_comments: number;
    shares: number;
    liked: boolean;
    date_posted: string;
}

const VideoCard = ({ id, file, post_likes, post_comments, post_desc, picture, channel_name, liked }: VideoCardProps) => {
    return (
        <Link to={`/short/${id}`} className="relative bg-white/10 rounded-lg h-[240px] overflow-clip block">
            <video src={`${APIURL}/video/post_videos/${file}`} className="h-full w-full object-cover" />
            <div className="absolute bottom-0 left-0 p-2 w-full h-full flex flex-col justify-end gap-1 bg-gradient-to-b from-transparent to-black-900">
                <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center justify-center gap-1">
                    {post_likes}
                    {liked ? <Favorite fontSize="inherit" /> : <FavoriteBorder fontSize="inherit" />}
                </span>
                      <span className="flex items-center justify-center gap-1">
                        {post_comments}
                        <MessageOutlined fontSize='inherit' />
                      </span>
                    </div>
                    <p className='text-xs w-full truncate'>{ post_desc }</p>
                    <div className="flex items-center gap-2 w-full">
                      <img src={`${APIURL}/image/profile_pics/${picture}`} className="w-[20px] aspect-square rounded-full bg-black/50" />
                      <p className="text-xs w-full truncate">{ channel_name }</p>
                    </div>
            </div>
        </Link>
    )
}

export default VideoCard
