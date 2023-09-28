import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import {
  FavoriteOutlined,
  FavoriteBorderOutlined,
  MessageOutlined,
  ShareOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  VolumeMute,
  AddRounded
} from '@mui/icons-material';
import Comments from '../../pages/post/Comments';
import { APIURL } from '../../assets/data';
import { fetchOptions } from '../../assets/data/data';
import { AuthContext } from '../../context/authContext';
import './shorts.scss';

type PostType = {
  id: string;
  post_desc: string;
  file: string;
  date_posted: string;
  channel_id: string;
  channel_name: string;
  profile_pic: string;
  post_comments: number;
  post_likes: number;
  shares: number;
  liked: boolean;
  views: number;
  is_following: boolean;
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

const Shorts = () => {
    const { id } = useParams()
    const { user, socket } = useContext(AuthContext)
    const navigate = useNavigate()

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

  const handleWatch: React.ReactEventHandler<HTMLVideoElement> = async () => {
    const options = {
      ...fetchOptions,
      method: "PUT",
      body: JSON.stringify({ user_id: user.id, post_id: id })
    }
    const response = await fetch(`${APIURL}/post/watch`, options);
    const res = await response.json();
    if (response.status !== 200) {
      alert(res?.message);
    } else {
      socket.emit('watch-action', res)
    }
  }

  async function getPost() {
    const response = await fetch(`${APIURL}/post/${id}?user_id=${user.id}&type=channel`, fetchOptions);
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
      socket.removeAllListeners('watch-event');

      socket.on('watch-event', ({ post_id, views }) => {
        setPost(
          (prev) => prev.id === post_id ? ({ ...prev, views }) : prev
        )
      });
      
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
          setCommentDetails(prev => prev.id === comment_id ?
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
    <div className="shorts">
      <div className="left relative">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2">
          <video src={`${APIURL}/video/post_videos/${post.file}#t`} className='absolute top-0 left-0 w-full h-full object-cover blur-lg opacity-50'></video>
          <video src={`${APIURL}/video/post_videos/${post.file}`} onLoadedData={handleWatch} controls={true} className="relative h-full rounded-md shadow-lg shadow-black-900/50"></video>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center justify-center h-[40px] aspect-square rounded-full rotate-45 bg-white/10 absolute z-1 top-2 left-2">
          <AddRounded />
        </button>
        <div className="navigate-shorts absolute z-1">
          <button className="btn"><KeyboardArrowUp /></button>
          <button className="btn"><KeyboardArrowDown /></button>
        </div>
        <button className="btn mute absolute z-1">
          <VolumeMute />
        </button>
      </div>
      <div className="right">
        <div className="info">
          <div className="user">
            <img src={`${APIURL}/image/profile_pics/${post.profile_pic}`} alt="" />
            <Link to={`/channel/info/${post.channel_id}`} className="user-info">
              <p className="name">{ post.channel_name }</p>
              <p className="date">{ post.date_posted }</p>
            </Link>
            { !post.is_following && <button>Follow</button> }
            
          </div>
          <p className="desc">{post.post_desc}</p>
        </div>
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

export default Shorts
