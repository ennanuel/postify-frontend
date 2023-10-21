import { createContext, useContext, useEffect, useState } from 'react';
import { PostContextArgumentsType, CommentType, PostType } from '../types/post.types';
import { AuthContext } from './authContext';
import { useLocation, useParams } from 'react-router-dom';
import {
    submitComment,
    watchVideo,
    likePost,
    likeComment,
    getPostInfo,
    getCommentDetails,
    getComments,
    updateCommentLikes,
    updatePostLikes,
    updateComments,
    updatePostWatches
} from '../utils/post';

export const PostContext = createContext<PostContextArgumentsType>({
    post: {} as PostType, 
    comments: [],
    commentInFocus: {} as CommentType,
    commentId: null,
    showForMobile: undefined,
    handleWatch: () => null,
    updateCommentId: () => null,
    handlePostComment: () => null,
    handleLikePost: () => null,
    handleLikeComment: () => null,
    showMobileComments: () => null,
    showMobileDesc: () => null,
    hideAll: () => null
});

export function PostContextProvider({ children }: { children: JSX.Element }) {
    const { pathname } = useLocation();
    const { user, socket } = useContext(AuthContext);
    const { post_id } = useParams();
    
    const [post, setPost] = useState({} as PostType);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentInFocus, setCommentInFocus] = useState({} as CommentType);
    const [commentId, setCommentId] = useState<string | null>(null);
    const [showForMobile, setShowForMobile] = useState<'comment' | 'desc' | undefined>(undefined);

    function handlePostComment(comment: string) {
        if (comment?.length < 1) return;
        const reply = Boolean(commentId);
        submitComment({ user_id: user.id, comment, post_id, comment_id: commentId, reply });
    };
    function updateCommentId(comment_id: string | null) {
        setCommentId(comment_id);
        setShowForMobile('comment');
    };
    function handleWatch() {
        watchVideo({ user_id: user.id, post_id });
    };
    function handleLikePost() {
        likePost({ user_id: user.id, post_id, liked: post.liked });
    };
    function handleLikeComment(comment_id: string, liked: boolean) {
        likeComment({ user_id: user.id, post_id, comment_id, liked });
    };
    function showMobileComments() { setShowForMobile('comment') };
    function showMobileDesc() { setShowForMobile('desc') };
    function hideAll() { setShowForMobile(undefined) };

    useEffect(
        function() {
            const likeSocketEventHandler = updatePostLikes({ setPost, main_post_id: post_id, main_user_id: user.id });
            const commentSocketEventHandler = updateComments({ setPost, setCommentInFocus, main_post_id: post_id, main_comment_id: commentId });
            const commentLikeSocketEventHandler = updateCommentLikes({ setComments, setCommentInFocus, main_post_id: post_id, main_comment_id: commentId, main_user_id: user.id });
            
            socket.removeAllListeners('someone-liked');
            socket.removeAllListeners('someone-commented');
            socket.removeAllListeners('liked-comment');
            socket.on('someone-liked', likeSocketEventHandler);
            socket.on('someone-commented', commentSocketEventHandler);
            socket.on('liked-comment', commentLikeSocketEventHandler);

            if (!post?.views) return;
            const watchSocketEventHandler = updatePostWatches({ setPost, main_post_id: post_id });
            socket.removeAllListeners('watch-event');
            socket.on('watch-event', watchSocketEventHandler);
        }
        , [post_id, commentId]
    )

    useEffect(() => {
        const postType = /post/i.test(pathname) ? '' : 'channel';
        getPostInfo({ post_id, user_id: user.id, type: postType })
            .then(res => setPost(res as PostType))
            .catch(error => alert(error));
    }, [post_id, pathname]);

    useEffect(() => {
        getComments({ post_id, user_id: user.id, comment_id: commentId })
            .then(res => {
                setComments(res as CommentType[]);
                if (!commentId) return;
                getCommentDetails({ comment_id: commentId, user_id: user.id })
                    .then(res => setCommentInFocus(res as CommentType));
            })
            .catch(error => alert(error));
    }, [commentId, post]);

    
    return (
        <PostContext.Provider
            value={{
                post,
                comments,
                commentId,
                commentInFocus,
                showForMobile,
                updateCommentId,
                handleLikePost,
                handlePostComment,
                handleLikeComment,
                handleWatch,
                showMobileComments,
                showMobileDesc,
                hideAll
            }}
        >
            {children}
        </PostContext.Provider>
    )
}