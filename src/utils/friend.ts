import { fetchOptions } from "../assets/data/data";
import { APIURL } from "../assets/data";
import { CustomFriendGroupValues } from "../types/friend.types";
import { UserType } from "../types/user.types";

export async function addOrRemoveFriend(values: { user_id: string; other_user_id: string; actionType: 'add' | 'remove'; }) {
    const options = { ...fetchOptions, method: 'POST', body: JSON.stringify(values) };
    const response = await fetch(`${APIURL}/friend`, options);
    const res = await response.json();
    if (response.status !== 200) return console.error(res.message);
    console.log(res.message);
}

export async function sendOrDeclineRequest(values: { user_id: string; other_user_id: string; actionType: 'add' | 'remove'; }) {
    const options = { ...fetchOptions, method: 'POST', body: JSON.stringify(values) };
    const response = await fetch(`${APIURL}/friend/request`, options);
    const res = await response.json();
    if (response.status !== 200) return console.error(res.message);
    console.log(res.message);
}

export const fetchUsers = (user_id: string, type: 'received' | 'sent' | 'suggestions') => new Promise(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/friend/requests/${user_id}?type=${type}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)

export const fetchFriends = (user_id: string, type = '') => new Promise<UserType[]>(
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

export const fetchCustomGroupInfo = (id: string, type = '') => new Promise<CustomFriendGroupValues>(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/friend/group/${id}?type=${type}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
)

export async function createOrEditCustomFriendGroups(reqBody: CustomFriendGroupValues, type = '') {
    for (let [key, value] of Object.entries(reqBody)) {
        if(!value || value?.length < 1) return alert(`${key.replace('_', ' ')} cannot be empty!`)
    }
    const options = {
        ...fetchOptions,
        method: type == 'edit' ? 'PUT' : 'POST',
        body: JSON.stringify(reqBody)
    }
    const response = await fetch(`${APIURL}/friend/group/${type === 'edit' ? 'edit' : 'create'}`, options);
    const res = await response.json();
    alert(res.message);
}

export async function deleteCustomFriendGroup(reqBody: {user_id: string, group_id: string}) {
    const options = { ...fetchOptions,  method: 'DELETE', body: JSON.stringify(reqBody) }
    const response = await fetch(`${APIURL}/friend/group/delete`, options);
    const res = await response.json();
    alert(res.message);
}

export const fetchFriendIds = (user_id: string) => new Promise<string[]>(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/friend/id/${user_id}`, fetchOptions)
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res.results || []);
    }
)