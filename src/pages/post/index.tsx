import { useState, useContext, useEffect, useMemo } from 'react'
import { 
    Add,
    FavoriteOutlined,
    KeyboardArrowLeft, 
    KeyboardArrowRight,
    MessageOutlined, 
    MoreHoriz, 
    ShareOutlined, 
    ZoomInOutlined, 
    ZoomOutOutlined,
    FavoriteBorderOutlined,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import './post.scss'
import { AuthContext } from '../../context/authContext'
import { IconButton } from '@mui/material'
import Comments from './Comments'
import { fetchOptions, post_bgs } from '../../assets/data/data'

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
}

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

const Post = () => {
    const { id } = useParams()
    const { user, socket } = useContext(AuthContext)
    const navigate = useNavigate()

    const [post, setPost] = useState({} as PostType)
    const [content, setContent] = useState('')
    const [commentDetails, setCommentDetails] = useState({} as CommentType)
    const [comments, setComments] = useState<CommentType[]>([])
    const [comment, setComment] = useState<string|null>(null)
    const [index, setIndex] = useState(0);

    const { from, via, to } = useMemo(() => post_bgs[post.post_bg] || {}, [post])

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (content.length < 1) return alert('comment cannot be empty')
        
        socket.emit('comment', {
            user_id: user.id,
            post_id: id,
            content,
            comment_id: comment || ''
        }, comment ? 'reply' : '')

        setContent('')
    }

    async function getPost() {
        const response = await fetch(`${APIURL}/post/${id}?user_id=${user.id}`, fetchOptions)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setPost(res);
    }

    async function getComments() {
        const response = await fetch(`${APIURL}/comment/${id}?user_id=${user.id}${comment ? `&type=replies&comment_id=${comment}` : ''}`, fetchOptions)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setComments(res);
    }

    async function getComment() {
        const response = await fetch(`${APIURL}/comment/single/${comment}?user_id=${user.id}`, fetchOptions)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setCommentDetails(res);
    }

    async function likePost() {
        socket.emit( 'like-post', {user_id: user.id, post_id: id}, post.liked ? 'remove' : 'add' )
    }

    async function likeComment( comment_id : string, liked: boolean ) {
        socket.emit('like-comment', { user_id: user.id, post_id: id, comment_id }, liked ? 'unlike' : 'like')
    }

    useEffect(() => {
        getPost();
    }, [])

    useEffect(() => {
        getComments();
        if (comment) {
            getComment();
        }
    }, [comment, post])

    useEffect(() => {
        socket.removeAllListeners('someone-liked');
        socket.removeAllListeners('someone-commented');
        socket.removeAllListeners('liked-comment');
        socket.on('someone-liked', ({ id, user_id, likes, type }: { id: string, user_id: string, likes: number, type: string }) => {
            setPost(
                (prev) => prev.id === id ? ({
                    ...prev,
                    post_likes: likes,
                    liked: type == 'add' ? (user.id == user_id || prev.liked) : (user.id != user_id && prev.liked)
                }) : prev
            )
        })

        socket.on('someone-commented', ({ type, post_id, comments, comment_id, replies }) => {
            if (id === post_id) {
                setPost(prev => ({ ...prev, post_comments: comments }))

                if (type == 'reply') {
                    setCommentDetails(
                        prev => prev.id === post_id && comment_id ?
                            ({ ...prev, post_comments: replies }) :
                            prev
                    )
                }
            };
        })

        socket.on('liked-comment', ({ type, user_id, post_id, comment_id, likes }) => {
            if (id === post_id) {
                setComments(prev => prev.map(
                    comment => comment.id === comment_id ?
                        {
                            ...comment,
                            likes,
                            liked: type == 'like' ?
                                (user.id === user_id || comment.liked) :
                                (comment.liked && user.id !== user_id)
                        } : comment
                ))
                setCommentDetails( prev => prev.id === comment_id ?
                    ({
                        ...prev, likes, 
                            liked: type == 'like' ?
                            (user.id === user_id || prev.liked) :
                            (prev.liked && user.id !== user_id)
                    }) : prev
                )
            }
        })
    }, [])

    return (
        <div className="post flex">
            <div className="left h-[100vh] flex-[3] relative top-[-60px] left-0">
                {
                    post.post_type === 'text' ?
                        <div className='relative z-[0] bg-gradient-to-br font-bold text-white text-3xl w-full h-full flex items-center justify-center'>
                            <div className={`absolute z-[0] top-0 left-0 w-full h-full bg-gradient-to-br ${from} ${via} ${to} opacity-60`}></div>
                            <p className='relative flex items-center justify-center backdrop-blur-lg font-bold w-full max-w-[500px] min-h-[400px] rounded-lg p-[5%] overflow-hidden'>
                                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-tl ${from} ${via} ${to}`}></div>
                                <span className='relative z-1 text-center'>{ post.post_desc }</span>
                            </p>
                        </div> :
                        <div className="post-content relative z-[0] flex justify-center items-center">
                            <div
                                style={{ background: `url(${APIURL}/image/post_images /${post.files && post.files[index]})` }}
                                className="content w-full h-[100vh]"
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
                                                className="scale-[1] object-contain h-full max-w-[80%] block rounded-lg shadow-lg shadow-black-900/30" alt="post image"
                                            /> :
                                            <>
                                                <video src={`${APIURL}/video/post_videos/${post.files && post.files[index]}`} className="relative z-1 h-full max-w-[80%] rounded-lg shadow-lg shadow-black-900/30 object-fit" controls={true} />
                                            </>
                                    }
                                </div>
                            </div>
                        <button
                            onClick={() => setIndex( prev => prev - 1 < 0 ? 0 : prev - 1)}
                            className={`${index === 0 && 'opacity-60'} absolute top-[50%] translate-y-[-50%] py-[20px] px-[4px] rounded-[5px] left-[10px]`}
                        >
                            <KeyboardArrowLeft />
                        </button>
                        <button
                            onClick={(() => setIndex( prev => prev + 1 > post?.files?.length - 1 ? post?.files?.length - 1 : prev + 1 ))}
                            className={`${index === post?.files?.length - 1 && 'opacity-50'} absolute top-[50%] translate-y-[-50%] py-[20px] px-[4px] rounded-[5px] right-[10px]`}
                        >
                            <KeyboardArrowRight />
                        </button>
                    </div>
                }
                <button
                    onClick={() => navigate(-1)}
                    className="close z-1 w-[40px] aspect-square rounded-full rotate-45 absolute top-[15px] left-[15px] text-xl flex items-center justify-center"
                ><Add fontSize="large" /></button>
                <div className="zoom z-1 flex items-center absolute top-[15px] right-[15px]">
                    <IconButton className="flex items-center justify-center w-[40px] aspect-square rounded-full text-lg"><ZoomInOutlined fontSize="inherit" /></IconButton>
                    <IconButton className="flex items-center justify-center w-[40px] aspect-square rounded-full text-lg"><ZoomOutOutlined fontSize="inherit" /></IconButton>
                </div>
            </div>
            <div className="right overflow-y-scroll overflow-x-clip flex-1 flex flex-col h-full relative p-2">
                <div className={`info flex flex-col gap-3 ${comment ? 'h-0 mb-0 border-none overflow-hidden' : 'mb-4 py-3 border-b'}`}>
                    <div className="top flex items-center justify-between gap-2">
                        <div className="user-profile flex items-center gap-[10px]">
                            <img className="h-[40px] aspect-square rounded-full" src={ post.profile_pic } alt="" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{ post.name }</span>
                                <span className="text-xs">{ post.date_posted }</span>
                            </div>
                        </div>
                        <IconButton className="more h-[35px]">
                            <MoreHoriz />
                        </IconButton>
                    </div>
                    { post.post_type !== 'text' && <p className="post-desc p-2 rounded-md">{post.post_desc}</p> }
                    
                    <div className="actions flex items-center gap-3">
                        <IconButton
                            onClick={() => likePost()}
                        >
                            {
                                post.liked ?
                                    <FavoriteOutlined /> :
                                    <FavoriteBorderOutlined />
                            }
                            <span>{post.post_likes}</span>
                        </IconButton>
                        <IconButton>
                            <label htmlFor="comment" className="flex items-center justify-between gap-1">
                                <MessageOutlined />
                                <span>{post.post_comments}</span>
                            </label>
                        </IconButton>
                        <IconButton>
                            <ShareOutlined />
                            <span>{post.shares}</span>
                        </IconButton>
                    </div>
                </div>
                <Comments
                    comment={comment}
                    setComment={setComment}
                    commentDetails={commentDetails}
                    comments={comments}
                    likeComment={likeComment}
                    content={content}
                    setContent={setContent}
                    handleSubmit={handleSubmit}
                    user={user}
                />
            </div>
        </div>
    )
}

export default Post
