import { APIURL } from "../assets/data";
import { fetchOptions } from "../assets/data/data";
import { CommentType, PostType } from "../types/post.types";

type SetPostType = (value: React.SetStateAction<PostType>) => void;
type SetCommentType = (value: React.SetStateAction<CommentType>) => void;
type SetCommentsType = (value: React.SetStateAction<CommentType[]>) => void;

const MONTHS_IN_A_YEAR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_MS = 60000;
const ONE_HOUR_IN_MS = 3600000;
const ONE_DAY_IN_MS = 86400000;
const TWO_DAYS_IN_MS = 172800000;
const ONE_WEEK_IN_MS = 604800000;
const ONE_MONTH_IN_MS = 2592000000;
const ONE_YEAR_IN_MS = 31536000000;

export const postContent = (values: { user_id: string; post_type: 'text' | 'photo' | 'video'; post_desc: string; post_bg: 'none' | 'blue' | 'red' | 'white' | 'black'; files: File[]; group_id?: string | undefined; channel_id?: string | undefined; }) => new Promise<void>(
    async function (resolve, reject) {
        const { files, ...otherValues } = values;
        const otherValuesEntries = Object.entries(otherValues);
        const body = new FormData();
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', APIURL);
        for (let [key, value] of otherValuesEntries) { if(value) body.append(key, value) };
        for (let file of files) { body.append('files', file) };
        const options = { ...fetchOptions, method: 'POST', headers, body };
        const fetchURL = `${APIURL}/post/create`;
        const response = await fetch(fetchURL, options);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve();
    }
)

export const getPostInfo = ({ post_id, user_id, type }: {post_id: string|undefined, user_id: string, type: 'channel' | '' }) => new Promise(
    async function (resolve, reject) {
        if (!post_id) reject('post id is undefined');
        const response = await fetch(`${APIURL}/post/${post_id}?user_id=${user_id}&type=${type}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res)
    }
)

export const getComments = ({ post_id, user_id, comment_id }: { post_id: string | undefined; user_id: string; comment_id: string | null }) => new Promise(
    async function (resolve, reject) {
        const commentType = comment_id ? 'replies' : '';
        const response = await fetch(`${APIURL}/comment/${post_id}?user_id=${user_id}&type=${commentType}&comment_id=${comment_id}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)

export const getCommentDetails = ({ user_id, comment_id }: { user_id: string, comment_id: string|null }) => new Promise(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/comment/single/${comment_id}?user_id=${user_id}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res)
    }
)

export const getVideoQueue = ({ user_id, post_id, videoQueue, queueType }: { user_id: string | undefined; post_id: string | undefined; videoQueue: string[]; queueType: string }) => new Promise(
    async function (resolve, reject) {
        const currentQueue = videoQueue.join(',')
        const fetchURL = `${APIURL}/post/queue/${user_id}/${post_id}?queueType=${queueType}&currentQueue=${currentQueue}`;
        const response = await fetch(fetchURL, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res)
    }
)

export async function submitComment({ user_id, post_id, comment, comment_id, reply }: { user_id: string; post_id: string | undefined; comment: string; comment_id: string | null; reply: boolean; }) {
    const options = { ...fetchOptions, method: 'POST', body: JSON.stringify({ post_id, user_id, comment_id, comment }) };
    const URL = `${APIURL}/comment/${reply ? 'reply' : ''}`;
    await fetch(URL, options);
}

export async function watchVideo({ user_id, post_id }: { user_id: string, post_id: string | undefined }) {
    const options = {
        ...fetchOptions,
        method: "PUT",
        body: JSON.stringify({ user_id, post_id })
    }
    const response = await fetch(`${APIURL}/post/watch`, options);
    await response.json();
}

export async function likePost({ user_id, post_id, liked }: { user_id: string, post_id: string | undefined, liked: boolean }) {
    const options = { ...fetchOptions, method: 'POST', body: JSON.stringify({ user_id, post_id }) };
    const URL = `${APIURL}/post/${ liked ? 'unlike' : 'like' }`
    await fetch(URL, options);
}

export async function likeComment({ comment_id, liked, user_id, post_id }: { comment_id: string, liked: boolean, user_id: string, post_id: string|undefined } ) {
    const options = { ...fetchOptions, method: 'POST', body: JSON.stringify({ user_id, post_id, comment_id }) };
    const URL = `${APIURL}/comment/${ liked ? 'unlike' : 'like' }`
    await fetch(URL, options);
}

export function updatePostWatches({ setPost, main_post_id }: { setPost: SetPostType;  main_post_id: string|undefined }) {
    function updatePost({ post_id, views }: { post_id: string; views: number }) {
        if (main_post_id !== post_id) return;
        setPost( post => ({ ...post, views }));
    }
    return updatePost;
}

export function updatePostLikes({ setPost, main_post_id, main_user_id }: { setPost: SetPostType; main_post_id: string | undefined; main_user_id: string }) {
    function updatePost({ post_id, post_likes, liked, user_id }: { post_id: string; post_likes: number; liked: boolean; user_id: string, type: string }) {
        if (main_post_id !== post_id) return;
        setPost((post) => ({
            ...post,
            post_likes,
            liked: (main_user_id == user_id ? liked : post.liked)
        }))
    };
    return updatePost
}

export function updateComments({ setPost, setCommentInFocus, main_post_id, main_comment_id }: { setPost: SetPostType; setCommentInFocus: SetCommentType; main_post_id: string|undefined; main_comment_id: string|null; }) {
    function updatePostAndComments({ post_id, post_comments, comment_id, replies }: { post_id: string; comment_id: string; post_comments: number; replies: number; }) {
        if (main_post_id !== post_id) return;
        setPost( post => ({ ...post, post_comments }) )
        if (main_comment_id != comment_id) return;
        setCommentInFocus( comment => ({ ...comment, post_comments: replies }) )
    };
    return updatePostAndComments;
}

export function updateCommentLikes({ setComments, setCommentInFocus, main_post_id, main_comment_id, main_user_id }: { setComments: SetCommentsType; setCommentInFocus: SetCommentType; main_post_id: string|undefined, main_comment_id: string|null; main_user_id: string; }) {
    function updateCommentAndPost({ user_id, post_id, comment_id, likes, liked }: { user_id: string; post_id: string; comment_id: string; likes: number; liked: boolean; }) {
        function commentOrPostSetter(comment: CommentType) {
            return comment.id === comment_id ? { ...comment, likes, liked: user_id === main_user_id ? liked : comment.liked } : comment
        };
        if (main_post_id !== post_id) return;
        setComments(comments => comments.map(commentOrPostSetter));
        if (main_comment_id === comment_id) setCommentInFocus(commentOrPostSetter);
    }
    return updateCommentAndPost;
}

export function prettierTime(date: string) {
    const previousTime = new Date(date);
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - previousTime.getTime();

    function createTimeFormat(divisor: number, format: string) {
        const time = Math.floor(timeDiff / divisor);
        const timeFormat = `${time} ${format}`;
        return timeFormat;
    };

    if (timeDiff <= ONE_MINUTE_IN_MS) return createTimeFormat(ONE_SECOND_IN_MS, 'sec');
    else if (timeDiff <= ONE_HOUR_IN_MS && timeDiff > ONE_MINUTE_IN_MS) return createTimeFormat(ONE_MINUTE_IN_MS, 'min');
    else if (timeDiff <= ONE_DAY_IN_MS && timeDiff > ONE_HOUR_IN_MS) return createTimeFormat(ONE_HOUR_IN_MS, 'hr');
    else if (timeDiff <= ONE_WEEK_IN_MS && timeDiff > ONE_DAY_IN_MS) return createTimeFormat(ONE_DAY_IN_MS, 'day');
    else if (timeDiff <= ONE_MONTH_IN_MS && timeDiff > ONE_WEEK_IN_MS) return createTimeFormat(ONE_WEEK_IN_MS, 'wk');
    else if (timeDiff <= ONE_YEAR_IN_MS && timeDiff > ONE_MONTH_IN_MS) return createTimeFormat(ONE_MONTH_IN_MS, 'mon');
    else return createTimeFormat(ONE_YEAR_IN_MS, 'yr');
}

export function postPrettierTime(date: string) {
    const previousTime = new Date(date);
    const currentTime = new Date();
    const previousTimeYear = previousTime.getFullYear();
    const currentTimeYear = currentTime.getFullYear();
    const previousTimeMonthIndex = previousTime.getMonth();
    const previousTimeDay = previousTime.getDay();
    const timeDiff = currentTime.getTime() - previousTime.getTime();

    function createTimeFormat(divisor: number, format: string) {
        const time = Math.floor(timeDiff / divisor);
        const timeFormat = `${time} ${format}`;
        return timeFormat;
    };

    if (timeDiff <= ONE_HOUR_IN_MS) return createTimeFormat(ONE_MINUTE_IN_MS, 'mins ago');
    else if (timeDiff <= ONE_DAY_IN_MS && timeDiff > ONE_HOUR_IN_MS) return createTimeFormat(ONE_HOUR_IN_MS, 'hrs ago');
    else if (timeDiff <= TWO_DAYS_IN_MS && timeDiff > ONE_DAY_IN_MS) return 'Yesterday';
    else if (timeDiff >= TWO_DAYS_IN_MS && previousTimeYear <= currentTimeYear) return `${MONTHS_IN_A_YEAR[previousTimeMonthIndex]} ${previousTimeDay}`;
    else return `${MONTHS_IN_A_YEAR[previousTimeMonthIndex]} ${previousTimeDay}, ${previousTimeYear}`;
}

const getTimeFormat = (time: number, showZero?: boolean) => Math.floor(time) > 10 || !showZero ? String(Math.floor(time)) : '0' + String(Math.floor(time));
export function convertToVideoTimeFormat(time: number) {
    const timeinMilliseconds = time * 1000;
    const timeInSec = timeinMilliseconds / ONE_SECOND_IN_MS;
    const timeInMin = timeinMilliseconds / ONE_MINUTE_IN_MS;
    const timeInHr = timeinMilliseconds / ONE_HOUR_IN_MS;
    const greaterThanAnHour = timeInHr >= 1;
    const hourFormat = getTimeFormat(timeInHr);
    const minuteFormat = getTimeFormat(timeInMin, greaterThanAnHour);
    const secondFormat = getTimeFormat(timeInSec, true);
    if (greaterThanAnHour) return `${hourFormat}:${minuteFormat}:${secondFormat}`;
    return `${minuteFormat}:${secondFormat}`;
}

interface StateType { isPlaying: boolean; duration: number; currentTime: number; seekTime: number; percentageWatched: string; repeat: boolean; };
interface ReducerActionsType { [key: string]: StateType; };
export function videoHook() {
    const originalState: StateType = {
        isPlaying: false,
        duration: 0,
        currentTime: 0,
        seekTime: 0,
        percentageWatched: '0%',
        repeat: false,
    };
    const getPercentage = (numerator: number, denominator: number) => `${(100 * (numerator / denominator)).toFixed(4)}%`;
    function reducer(state: StateType, action: { type: string; seekTime?: number; duration?: number; currentTime?: number; timeInSeconds?: number; repeat?: boolean; }): StateType {
        const { seekTime, duration, currentTime, type, timeInSeconds, repeat } = action;
        const actionType = type.toLowerCase();
        const reducerActions: ReducerActionsType = {
            play: { ...state, isPlaying: true },
            pause: { ...state, isPlaying: false },
            setcurrent: { ...state, currentTime: currentTime || 0, percentageWatched: getPercentage(currentTime || 1, state.duration) },
            setseek: {
                ...state,
                seekTime: seekTime || 0,
                percentageWatched: getPercentage(seekTime || 0, state.duration)
            },
            start: {
                ...state,
                isPlaying: true,
                duration: duration || 1,
                percentageWatched: getPercentage(state.currentTime, duration || 1)
            },
            setrepeat: { ...state, repeat: repeat || false },
            forward: {
                ...state,
                seekTime: Math.min(state.currentTime + (timeInSeconds || 0), state.duration),
                percentageWatched: getPercentage(Math.min(state.currentTime + (timeInSeconds || 0), state.duration), state.duration)
            },
            backward: {
                ...state,
                seekTime: Math.max(state.currentTime - (timeInSeconds || 0), 0),
                percentageWatched: getPercentage(Math.max(state.currentTime - (timeInSeconds || 0), 0), state.duration)
            },
            reset: originalState
        };
        const reducerAction = reducerActions[actionType as keyof typeof reducerActions];
        if (!reducerAction) return state;
        return reducerAction;
    };

    return {
        getState: () => originalState,
        getReducer: () => reducer
    }
}