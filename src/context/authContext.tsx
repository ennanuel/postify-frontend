import { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { APIURL } from '../assets/data';

type UserType = {
    name: string;
    profilePic: string;
    id: string;
}

type ContextArgTypes = { 
    user: UserType;
    login: (user: UserType) => void;
    friend: string[];
    group: string[];
    getIds: (type: string) => void;
    socket: Socket
}

const socket = io('http://localhost:4000')

export const AuthContext = createContext<ContextArgTypes>({
    user: { name: "", profilePic: "", id: ""  }, 
    login: () => null,
    friend: [],
    group: [],
    getIds: async () => null,
    socket
});

export function AuthContextProvider ({ children } : { children: JSX.Element }) {
    const [user, setUser] = useState<UserType>({} as UserType);
    const [{ friend, group }, setIds] = useState<{ friend: string[];  group: string[] }>({ friend: [], group: [] })

    const login = ( user : UserType ) => {
        setUser(user);
    }

    async function getIds(type: string) {
        if (!['group', 'friend'].includes(type)) return;

        const response = await fetch(`${APIURL}/${type}/id/${user.id}`)
        if (response.status !== 200) alert('something went wrong');
        const res : string[] = await response.json();
        setIds( prev => ({ ...prev, [type]: res }) );
    }

    useEffect(() => {
        if (Boolean(user.id)) {
            getIds('friend');
            getIds('group');
        }
    }, [user])
    
    return (
        <AuthContext.Provider value={{ user, login, socket, friend, group, getIds }}>
            {children}
        </AuthContext.Provider>
    )
}