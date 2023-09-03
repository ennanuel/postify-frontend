import { useState, useContext, useEffect } from 'react'
import { 
    Add, 
    Favorite, 
    FavoriteOutlined,
    KeyboardArrowLeft, 
    KeyboardArrowRight,
    Message, 
    MessageOutlined, 
    MoreHoriz, 
    ShareOutlined, 
    ZoomInOutlined, 
    ZoomOutOutlined,
    SendRounded,
    FavoriteBorderOutlined,
} from '@mui/icons-material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import './post.scss'
import { AuthContext } from '../../context/authContext'
import { IconButton } from '@mui/material'

type PostType = {
    id: string;
    post_desc: string;
    post_type: string;
    post_bg: string;
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
    comments: number;
}

const Post = () => {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const [content, setContent] = useState('')
    const [commentDetails, setCommentDetails] = useState({} as CommentType)
    const [comments, setComments] = useState<CommentType[]>([])
    const [comment, setComment] = useState<string|null>(null)
    const [post, setPost] = useState({} as PostType)

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (content.length < 1) return alert('comment cannot be empty')
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ user_id: user.id, post_id: id, content, type: comment && 'reply', comment_id: comment || '' }),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response = await fetch(`${APIURL}/comment/add`, requestOptions)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        return alert(res.message)
    }

    async function getPost() {
        const response = await fetch(`${APIURL}/post/${id}?user_id=${user.id}`)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setPost(res);
    }

    async function getComments() {
        const response = await fetch(`${APIURL}/comment/${id}${comment ? `?type=replies&comment_id=${comment}` : ''}`)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setComments(res);
    }

    async function getComment() {
        const response = await fetch(`${APIURL}/comment/single/${comment}`)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setCommentDetails(res);
    }

    async function likePost() {
        const requestOptions = {
            method: post.liked ? "DELETE" : "POST",
            body: JSON.stringify({ user_id: user.id, post_id: id }),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response = await fetch(`${APIURL}/post/${post.liked ? 'unlike' : 'like'}`, requestOptions);
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setContent('')
        return alert(res.message)
    }

    useEffect(() => {
        getPost();
    }, [])

    useEffect(() => {
        getComments();
        if (comment) {
            getComment();
        }
    }, [comment])

    return (
        <div className="post flex">
            <div className="left h-[100vh] flex-[3] relative top-[-60px] left-0">
                <button
                    onClick={() => navigate(-1)}
                    className="close w-[40px] aspect-square rounded-full rotate-45 absolute top-[15px] left-[15px] text-xl flex items-center justify-center"
                ><Add fontSize="large" /></button>
                <div className="zoom flex items-center absolute top-[15px] right-[15px]">
                    <IconButton className="flex items-center justify-center w-[40px] aspect-square rounded-full text-lg"><ZoomInOutlined fontSize="inherit" /></IconButton>
                    <IconButton className="flex items-center justify-center w-[40px] aspect-square rounded-full text-lg"><ZoomOutOutlined fontSize="inherit" /></IconButton>
                </div>
                <div className="post-content flex justify-center items-center">
                    <button
                        className="absolute top-[50%] translate-y-[-50%] py-[20px] px-[4px] rounded-[5px] left-[10px]"
                    >
                        <KeyboardArrowLeft />
                    </button>
                    <button
                        className="absolute top-[50%] translate-y-[-50%] py-[20px] px-[4px] rounded-[5px] right-[10px]"
                    >
                        <KeyboardArrowRight />
                    </button>
                    <div className="content min-w-[50%] h-[100vh]"></div>
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
                    <p className="post-desc p-2 rounded-md">{post.post_desc}</p>
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
                                <div><img className="w-full aspect-square rounded-full bg-white" src={commentDetails.profile_pic} alt="" /></div>
                                
                                <div className="col-span-6 flex flex-col gap-2">
                                    <div className="flex flex-col gap-1 text-sm">
                                        <p className="font-bold">{commentDetails.name}, <span className='font-normal text-xs'>{commentDetails.date_uploaded}</span></p> 
                                        <p className="p-1 px-2 rounded-md bg-white/5">{commentDetails.content}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <button className='flex items-center justify-center gap-1 px-2 py-[3px] rounded-[12px] bg-white/5'><Favorite fontSize="small" />{commentDetails.likes}</button>
                                        <button className='flex items-center justify-center gap-1 px-2 py-[3px] rounded-[12px] bg-white/5'><MessageOutlined fontSize="small" />{commentDetails.comments}</button>
                                    </div>
                                </div> 
                            </div>
                            <p className='font-bold text-right'>Replies</p>
                        </div>
                }
                <ul className="comments-container flex-1 flex flex-col gap-3">
                    {
                        comments.map(({ id, content, date_uploaded, user_id, name, profile_pic, likes, comments }) => (
                            <div key={id} onClick={() => setComment(id)} className="comment-msg flex items-start gap-2">
                                <img className="min-w-[35px] h-[35px] rounded-full border" src={profile_pic} alt="" />
                                <div className="msg flex flex-col gap-1">
                                    <div className="comment-text text-sm flex flex-col p-2 rounded-md">
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
                                        <IconButton>Like</IconButton>
                                        <IconButton>reply</IconButton>
                                        <span className="text-xs">{date_uploaded}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </ul>
                
                <form className="create-comment sticky bottom-0 flex gap-2 p-2 pb-0 border-t" onSubmit={handleSubmit}>
                    <img className='w-[40px] rounded-full aspect-square' src={user.profilePic} alt={user.name} />
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
            </div>
        </div>
    )
}

export default Post
