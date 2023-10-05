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
    logout: () => void;
    friend: string[];
    group: string[];
    getIds: (type: string) => void;
    socket: Socket
}

const socket = io('http://localhost:4000')

export const AuthContext = createContext<ContextArgTypes>({
    user: { name: "", profile_pic: "", id: ""  }, 
    login: () => null,
    logout: () => null,
    friend: [],
    group: [],
    getIds: async () => null,
    socket
});

export function AuthContextProvider({ children }: { children: JSX.Element }) {
    const [user, setUser] = useState<UserType>({} as UserType);
    const navigate = useNavigate()
    const [{ friend, group }, setIds] = useState<{ friend: string[];  group: string[] }>({ friend: [], group: [] })

    async function login() {
        const response = await fetch(`${APIURL}/auth`, fetchOptions)
        const { profile_pic, name, id, message } = await response.json()
        if (response.status !== 200) return alert(message);
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

    function logout() {
        setUser({} as UserType);
        navigate('/')
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
        <AuthContext.Provider value={{ user, login, logout, socket, friend, group, getIds }}>
            {children}
        </AuthContext.Provider>
    )
}