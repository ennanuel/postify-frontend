import { createContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { APIURL } from '../assets/data';
import { fetchOptions } from '../assets/data/data';

type UserType = {
    name: string;
    profile_pic: string;
    id: string;
}
 
type ContextArgTypes = { 
    user: UserType;
    login: () => void;
    friend: string[];
    group: string[];
    getIds: (type: string) => void;
    socket: Socket
}

const socket = io('http://localhost:4000')

export const AuthContext = createContext<ContextArgTypes>({
    user: { name: "", profile_pic: "", id: ""  }, 
    login: () => null,
    friend: [],
    group: [],
    getIds: async () => null,
    socket
});

export function AuthContextProvider({ children }: { children: JSX.Element }) {
    const [user, setUser] = useState<UserType>({} as UserType);
    const [{ friend, group }, setIds] = useState<{ friend: string[];  group: string[] }>({ friend: [], group: [] })

    async function login() {
        const response = await fetch(`${APIURL}/auth`, fetchOptions)
        if (response.status !== 200) return alert('something went wrong');
        const { profile_pic, name, id } = await response.json()

        if (!id) return;
        setUser({ id, name, profile_pic: `${APIURL}/image/profile_pics/${profile_pic}` })
    }

    async function getIds(type: string) {
        if (!['group', 'friend'].includes(type)) return;
        const response = await fetch(`${APIURL}/${type}/id/${user.id}`, fetchOptions)
        if (response.status !== 200) alert('something went wrong');
        const res : { results: string[] } = await response.json();
        setIds( prev => ({ ...prev, [type]: res?.results || [] }) );
    }

    useEffect(() => {
        if (Boolean(user.id)) {
            getIds('friend');
            getIds('group');
        }
    }, [user])

    useLayoutEffect(() => {
        login()
    }, [])
    
    return (
        <AuthContext.Provider value={{ user, login, socket, friend, group, getIds }}>
            {children}
        </AuthContext.Provider>
    )
}