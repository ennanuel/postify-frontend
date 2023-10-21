import APIURL, { fetchOptions } from "../assets/data/data";
import { ChannelType, VideoCardProps } from "../types/channel.types";

const KEYS_TO_IGNORE = /[website|profile_pic|cover|prev_cover|prev_profile]/;

export const getChannels = (user_id: string, type?: 'following'|'created') => new Promise<ChannelType[]>(
    async function(resolve, reject) {
        const response = await fetch(`${APIURL}/channel/${user_id}?type=${type}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)

export const getChannelInfo = ({ user_id, channel_id, infoType }: {user_id: string|undefined, channel_id: string|undefined, infoType?: 'full'}) => new Promise(
    async function(resolve, reject) {
        const response = await fetch(`${APIURL}/channel/info/${channel_id}?user_id=${user_id}&type=${infoType}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) return alert('something went wrong!');
        if (!res) reject('Channel does not exist');
        resolve(res);
    }
)

export const getChannelsFeed = (user_or_channel_id: string|undefined, listType: 'following' | 'notfollowing' | 'single') => new Promise(
    async function (resolve, reject) {
        function addListTypeToObj(video: VideoCardProps) { return { ...video, listType } };
        const fetchURL = `${APIURL}/channel/feed/${user_or_channel_id}?user_id=${user_or_channel_id}&type=${listType}`;
        const response = await fetch(fetchURL, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        if (!res) reject('nothing was found');
        const videos = (res as VideoCardProps[]).map(addListTypeToObj);
        resolve(videos);
    }
)

export async function followAction({ user_id, channel_id, unfollow }: { user_id: string; channel_id: string | undefined; unfollow?: boolean }) {
    const options = { ...fetchOptions, method: 'PUT', body: JSON.stringify({ user_id, channel_id }) };
    const fetchURL = `${APIURL}/channel/${unfollow ? 'unfollow' : 'follow'}`;
    const response = await fetch(fetchURL, options);
    const res = await response.json();
    if (response.status !== 200) return res.message;
    return;
}

export async function createChannel(values: { user_id: string; channel_desc: string; name: string; tags: string[]; website: string; profile_pic: File|undefined; cover: File|undefined }) {
        const { tags, ...otherValues } = values;
        const formData = new FormData();
        const headers = new Headers();

        for(let [key, value] of Object.entries(otherValues)) {
            if (!value || value?.length < 1 && key !== 'website') {
                return alert(`'${key.toUpperCase()}' field cannot be empty`)
            } else {
                formData.append(key, value);
            }
        }
        tags.forEach( tag => formData.append('tags[]', tag) )
        headers.append('Access-Control-Allow-Origin', APIURL)
        
        const options = { ...fetchOptions, method: "POST", body: formData, headers }

        const response = await fetch(`${APIURL}/channel/create`, options);
        const res = await response.json()
        return alert(res.message)
}

type EditChannelParams = { channel_id: string | undefined, user_id: string | undefined, name: string; channel_desc: string; tags: string[]; website: string; prev_cover: string | undefined; prev_pic: string | undefined; profile_pic: File | undefined; cover: File | undefined };

export async function editChannel(values: EditChannelParams) {
    const { tags, ...otherValues } = values
    const formData = new FormData();
    const headers = new Headers();
    for(let [key, value] of Object.entries(otherValues)) {
        if ((!value || value?.length < 1) && !KEYS_TO_IGNORE.test(key)) {
            return alert(`'${key.toUpperCase()}' field cannot be empty`);
        } else if(value) formData.append(key, value);
    }
    tags.forEach( tag => formData.append('tags[]', tag) )
    headers.append('Access-Control-Allow-Origin', APIURL)
    const options = { ...fetchOptions, method: "PUT", body: formData, headers }
    const response = await fetch(`${APIURL}/channel/edit`, options);
    const res = await response.json()
    alert(res.message)
    return response.status
};
        
export async function deleteChannel({ user_id, channel_id }: { user_id: string | undefined; channel_id: string | undefined }) {
    const options = { ...fetchOptions, method: "DELETE", body: JSON.stringify({ user_id, channel_id }) };
    const response = await fetch(`${APIURL}/channel/delete`, options);
    const { message } = await response.json();
    alert(message);
    return response.status;
}