import APIURL, { fetchOptions } from "../assets/data/data";
import { UserType } from "../types/user.types";

export const register = (values: { username: string; email: string; name: string; password: string; confirm_password: string; }) => new Promise<void>(
    async function (resolve, reject) {
        const validate = validateName(values.name);
        if (validate.failed) reject(validate);
        const body = JSON.stringify(values);
        const method = "POST";
        const options = { ...fetchOptions, method, body };
        const response = await fetch(`${APIURL}/auth/register`, options);
        const res = await response.json();
        if (response.status !== 200) reject(res);
        resolve();
    }
);
export const login = ({ username, password }: { username: string; password: string; }) => new Promise<void>(
    async function (resolve, reject) {
        const options = { ...fetchOptions, method: 'POST', body: JSON.stringify({ username, password }) }
        const response = await fetch(`${APIURL}/auth/login`, options);
        const res = await response.json();
        if (response.status !== 200) reject(res);
        resolve();
    }
);
export const fetchUserDetails = () => new Promise<UserType>(
    async function(resolve, reject) {
        const response = await fetch(`${APIURL}/auth`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res);
        if (!res.id) reject('no user found');
        const profile_pic = `${APIURL}/image/profile_pics/${res.profile_pic}`;
        resolve({ ...res, profile_pic });
    }
);
export const logUserOut = () => new Promise<void>(
    async function (resolve, reject) {
        const options = { ...fetchOptions, method: 'POST' };
        const response = await fetch(`${APIURL}/auth/logout`, options);
        const result = await response.json();
        if (response.status !== 200) reject(result.message);
        resolve()
    }
);
export const deleteUser = (user_id: string) => new Promise<void>(
    async function (resolve, reject) {
        const options = { ...fetchOptions, method: 'DELETE', body: JSON.stringify({ user_id }) };
        const response = await fetch(`${APIURL}/user/delete`, options);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve();
    }
);

function validateName(name: string): { failed: boolean; key?: string; message?: string } {
    if (name.split(' ').length !== 2) return { failed: true, key: 'name', message: 'Must contain first and last name' };
    return { failed: false };
}