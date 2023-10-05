import { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { MoreHoriz } from '@mui/icons-material'
import { AuthContext } from '../../context/authContext'
import PostContent from './PostContent'
import Actions from './Actions'
import Comments from './Comments'
import { APIURL } from '../../assets/data'
import { fetchOptions } from '../../assets/data/data'
import './post.scss'
import UserDetails from './UserDetails'

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

    const [post, setPost] = useState({} as PostType)
    const [content, setContent] = useState('')
    const [commentDetails, setCommentDetails] = useState({} as CommentType)
    const [comments, setComments] = useState<CommentType[]>([])
    const [comment, setComment] = useState<string|null>(null)

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
        <div className="post grid grid-cols-1 lg:grid-cols-[1fr,400px] grid-rows-[repeat(4,auto),1fr] lg:grid-rows-[repeat(3,auto),1fr] lg:h-[calc(100vh-60px)] h-[100vh] fixed lg:relative top-0 w-full z-[9999] md:overflow-clip">
            <UserDetails comment={comment} name={post.name} date_posted={post.date_posted} profile_pic={post.profile_pic} />
            <PostContent {...post} comment={comment} />
            {
                !comment &&
                    <p className={`post-desc p-4 lg:mx-2 bg-black-900/50 lg:rounded-lg ${post.post_type === 'text' && 'h-0 p-0 overflow-clip'}`}>
                        {post.post_desc}
                    </p>
            }
            <Actions
                comment={comment}
                likePost={likePost}
                liked={post.liked}
                post_likes={post.post_likes}
                post_comments={post.post_comments}
                shares={post.shares}
            />
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
    )
}

export default Post
