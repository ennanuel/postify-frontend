import { APIURL } from "../assets/data"
import { fetchOptions } from "../assets/data/data"
import { GroupInfo, GroupType } from "../types/group.types";
import { FriendType } from "../types/friend.types";
import { PostType } from "../types/post.types";
import { UserType } from "../types/user.types";

export const getGroupInfo = ({ group_id, user_id, fetchType }: { group_id: string | undefined; user_id: string; fetchType?: 'full' }) => new Promise<GroupInfo>(
    async function (resolve, reject) { 
        const response = await fetch(`${APIURL}/group/info/${group_id}?user_id=${user_id}&type=${fetchType}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) return reject(res.message);
        resolve(res)
    }
)

export const getFriendsToInvite = (group_id: string, user_id: string) => new Promise<FriendType[]>(async (resolve, reject) => {
    const response = await fetch(`${APIURL}/group/friends/${group_id}?user_id=${user_id}`, fetchOptions);
    const res = await response.json();
    if (response.status !== 200) reject(res.message);
    resolve(res);
});

export const fetchGroupMembers = ({ group_id, user_id, fetchType }: { group_id: string | undefined; user_id: string; fetchType?: 'invites'; }) => new Promise<UserType[]>(
    async function(resolve, reject) {
        const response = await fetch(`${APIURL}/group/members/${group_id}/${user_id}?type=${fetchType}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) return reject(res.message);
        resolve(res);
    }
)

export const fetchGroups = ({ user_id, fetchType }: { user_id: string; fetchType?: 'invites' | 'created' | 'joined' | 'single'; }) => new Promise<GroupType[]>(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/group/${user_id}?fetchType=${fetchType}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)

export const fetchGroupIds = (user_id: string) => new Promise<string[]>(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/group/id/${user_id}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res.results || []);
    }
)

export const fetchGroupPosts = ({ group_or_user_id, user_id, postType }: { group_or_user_id: string | undefined; user_id?: string; postType?: 'all' | 'photo' | 'video'; }) => new Promise<PostType[]>(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/group/posts/${group_or_user_id}?user_id=${user_id}&type=${postType}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)
export async function addOrRemoveMember({ user_id, group_id, actionType }: { user_id: string; group_id: string | undefined; actionType: 'add' | 'remove'; }) {
    const options = { ...fetchOptions, method: 'PUT', body: JSON.stringify({ user_id, group_id, actionType }) };
    const response = await fetch(`${APIURL}/group/member`, options);
    const res = await response.json();
    if (response.status !== 200) return res.message;
    return;
}

export async function inviteOrRejectInvite(reqBody: { group_id: string; user_id: string; actionType: 'add' | 'remove' }) { 
    const options = { ...fetchOptions, method: 'PUT', body: JSON.stringify(reqBody) };
    const response = await fetch(`${APIURL}/group/invite`, options);
    const res = await response.json();
    alert(res.message);
}

export const submitGroupValues = (values: { user_id: string; group_id?: string; name: string; group_desc: string; prev_pic?: string; prev_cover?: string; tags: string[]; profile_pic: File | undefined; cover: File | undefined; editGroup?: boolean }) => new Promise<void>(
    async function (resolve, reject) {
        const { tags, editGroup, ...otherValues } = values;
        const submitType = editGroup ? 'edit' : 'create';
        const method = editGroup ? 'PUT' : 'POST';
        const formData = new FormData();
        const headers = new Headers();

        for(let [key, value] of Object.entries(otherValues)) {
            if ((!value || value?.length < 1) && /(group_desc|name|user_id|group_id)/.test(key)) {
                return alert(`'${key.toUpperCase()}' field cannot be empty`)
            } else if(value) {
                formData.append(key, value);
            }
        }
        tags.forEach( tag => formData.append('tags[]', tag) )
        headers.append('Access-Control-Allow-Origin', APIURL)
            
        const options = { ...fetchOptions, method, body: formData, headers }

        const response = await fetch(`${APIURL}/group/${submitType}`, options);
        const res = await response.json()
        if (response.status !== 200) reject(res.message)
        resolve()
    }
)

export const deleteGroup = ({ user_id, group_id }: { user_id: string; group_id: string | undefined; }) => new Promise<void>(
    async function (resolve, reject) {
        const options = { ...fetchOptions, method: "DELETE", body: JSON.stringify({ user_id, group_id }) };
        const response = await fetch(`${APIURL}/group/delete`, options);
        const { message } = await response.json();
        if (response.status !== 200) reject(message);
        resolve();
    }
)