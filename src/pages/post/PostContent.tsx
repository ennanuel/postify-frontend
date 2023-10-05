import { useState, useMemo } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight, Add, ZoomInOutlined, ZoomOutOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { APIURL } from '../../assets/data';
import { post_bgs } from '../../assets/data/data';
import { useNavigate } from 'react-router-dom';

type PostType = {
    id: string;
    post_desc: string;
    files: string[];
    post_type: string;
    post_bg: 'none' | 'red' | 'blue' | 'white' | 'black';
    date_posted: string;
    user_id: string;
    name: string;
    profile_pic: string;
    post_comments: number;
    post_likes: number
    shares: number
    liked: boolean;
    active: boolean;
    comment: string | null;
}

const PostContent = ({comment, ...post} : PostType) => {
    const [index, setIndex] = useState(0);
    const { from, via, to } = useMemo(() => post_bgs[post.post_bg] || {}, [post]);
    const navigate = useNavigate();

    return (
        <article className={`relative lg:row-span-full ${comment && 'hidden lg:block'} h-full`}>
            <div className="post_content lg:absolute left left-0 top-[-60px] w-full lg:h-[100vh] h-full">
                {
                    post.post_type === 'text' ?
                        <div className='relative z-[0] bg-gradient-to-br font-bold text-white text-3xl w-full h-full flex items-center justify-center md:p-4'>
                            <div className={`absolute z-[0] top-0 left-0 w-full h-full hidden md:block bg-gradient-to-br ${from} ${via} ${to} opacity-60`}></div>
                            <p className='relative flex items-center justify-center backdrop-blur-lg font-bold w-full max-w-[500px] min-h-[400px] md:rounded-lg p-[5%] overflow-hidden'>
                                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-tl ${from} ${via} ${to}`}></div>
                                <span className='relative z-1 text-center'>{ post.post_desc }</span>
                            </p>
                        </div> :
                        <div className="post-content relative z-[0] flex justify-center items-center">
                            <div
                                style={{ background: `url(${APIURL}/image/post_images/${post.files && post.files[index]})` }}
                                className="content w-full lg:h-[100vh]"
                            >
                                {
                                    post.post_type === 'video' &&
                                        <video className="absolute top-0 left-0 w-full h-full object-cover" src={`${APIURL}/video/post_videos/${post.files && post.files[index]}#t`}></video>
                                }
                                <div className="p-2 h-full w-full flex items-center overflow-scroll justify-center backdrop-blur-lg bg-black-900/50">
                                    {
                                        post.post_type === 'photo' ?
                                            <img
                                                src={`${APIURL}/image/post_images/${post.files && post.files[index]}`}
                                                className="scale-[1] object-contain h-full max-w-[80%] block rounded-lg lg:shadow-lg lg:shadow-black-900/30" alt="post image"
                                            /> :
                                            <>
                                                <video src={`${APIURL}/video/post_videos/${post.files && post.files[index]}`} className="relative z-1 h-full max-w-[80%] rounded-lg shadow-lg shadow-black-900/30 object-fit" controls={true} />
                                            </>
                                        }
                                    </div>
                                </div>
                            <button
                                onClick={() => setIndex( prev => prev - 1 < 0 ? 0 : prev - 1)}
                                className={`${index === 0 && 'opacity-60'} ${post?.files?.length <= 1 && 'hidden'} absolute top-[50%] translate-y-[-50%] py-[20px] px-[4px] rounded-[5px] left-[10px]`}
                            >
                                <KeyboardArrowLeft />
                            </button>
                            <button
                                onClick={(() => setIndex( prev => prev + 1 > post?.files?.length - 1 ? post?.files?.length - 1 : prev + 1 ))}
                                className={`${index === post?.files?.length - 1 && 'opacity-50'} ${post?.files?.length <= 1 && 'hidden'} absolute top-[50%] translate-y-[-50%] py-[20px] px-[4px] rounded-[5px] right-[10px]`}
                            >
                                <KeyboardArrowRight />
                            </button>
                        </div>
                    }
                    <button
                        onClick={() => navigate(-1)}
                        className="close z-1 w-[40px] aspect-square rounded-full rotate-45 absolute top-[15px] left-[15px] text-xl hidden lg:flex items-center justify-center"
                    ><Add fontSize="large" /></button>
                    <div className="zoom z-1 hidden lg:flex items-center absolute top-[15px] right-[15px]">
                        <IconButton className="flex items-center justify-center w-[40px] aspect-square rounded-full text-lg"><ZoomInOutlined fontSize="inherit" /></IconButton>
                        <IconButton className="flex items-center justify-center w-[40px] aspect-square rounded-full text-lg"><ZoomOutOutlined fontSize="inherit" /></IconButton>
                    </div>
                </div>
            </article>
    )
}

export default PostContent
