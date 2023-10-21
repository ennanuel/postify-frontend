import { useMemo } from 'react'
import { Link } from 'react-router-dom';
import { PhotoAlbum, FavoriteOutlined, Favorite, MessageOutlined, VideoCameraBack } from '@mui/icons-material';
import { PostType } from '../../types/post.types';
import { APIURL } from '../../assets/data';

const MediaCard = ({ id, file_count, file, post_type, liked, post_likes, post_comments }: PostType) => {
    const Icon = useMemo(() => post_type === 'video' ? VideoCameraBack : PhotoAlbum, []);
    const FavoriteIcon = useMemo(() => liked ? Favorite : FavoriteOutlined, []);

    return (
        <Link to={`/post/${id}`} className="group/card w-full block aspect-square relative overflow-hidden rounded-md bg-orange-200">
            {
                post_type === 'video' ?
                    <video className="w-full aspect-square object-cover transition-transform group-hover/card:scale-[1.1]" src={`${APIURL}/video/post_videos/${file}#t`} /> :
                    <img className="w-full aspect-square object-cover transition-transform group-hover/card:scale-[1.1]" src={`${APIURL}/image/post_images/${file}`} alt="" />
            }
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center gap-2 bg-black-900/50 transition-opacity opacity-0 group-hover/card:opacity-100 backdrop-blur-sm">
                <div className="absolute z-1 top-1 right-1 flex items-center justify-center h-[26px] gap-[2px] text-black-500 font-bold px-1 rounded-lg bg-white">
                    <Icon fontSize="small" />
                    <span>{file_count}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 text-red-300 rounded-md bg-red-500/30 px-4 py-1 shadow">
                    <FavoriteIcon fontSize='large' />
                    <span>{post_likes}</span>
                </div>
                <div className="flex flex-col items-center justify-cener gap-1 text-blue-300 rounded-md bg-blue-500/30 px-4 py-1 shadow">
                    <MessageOutlined fontSize='large' />
                    <span>{post_comments}</span>
                </div>
            </div>
        </Link>
    )
}

export default MediaCard
