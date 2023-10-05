import { Socket } from "socket.io-client";
import { fetchOptions } from "../assets/data/data";
import { APIURL } from "../assets/data";

export function friendAction(user_id: string, other_id: string, action: 'accept' | 'decline' | 'unfriend' | 'send', socket: Socket) { 
    socket.emit('friend-action', { user_id, other_user_id: other_id }, action);
};

export const fetchUsers = (user_id: string, type: 'received' | 'sent' | 'suggestions') => new Promise(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/friend/requests/${user_id}?type=${type}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)

export const fetchFriends = (user_id: string, type = '') => new Promise(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/friend/${user_id}?type=${type}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) return reject(res.message);
        resolve(res);
    }
)

export const fetchCustomFriendGroups = (user_id: string) => new Promise(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/friend/groups/${user_id}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) return reject(res.message);
        resolve(res);
    }
)

export const fetchCustomGroupInfo = (id: string, type = '') => new Promise(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/friend/group/${id}?type=${type}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)

export async function createCustomFriendGroups(reqBody: { user_id: string; group_name: string; users: string[]; color: 'purple' | 'blue' | 'red' | 'white' | 'black' }) {
    for (let [key, value] of Object.entries(reqBody)) {
        if(!value || value?.length < 1) return alert(`${key.replace('_', ' ')} cannot be empty!`)
    }
    const options = { ...fetchOptions, method: 'POST', body: JSON.stringify(reqBody) }
    const response = await fetch(`${APIURL}/friend/group/create`, options);
    const res = await response.json();
    alert(res.message);
}