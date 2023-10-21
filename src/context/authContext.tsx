import { createContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ContextArgumentTypes, UserType } from '../types/user.types';
import { fetchUserDetails } from '../utils/auth';
import { fetchFriendIds } from '../utils/friend';
import { fetchGroupIds } from '../utils/group';

const socket = io('http://localhost:4000');

const FETCH_ID_TYPES = [
    { key: 'friend', fetchIds: fetchFriendIds },
    { key: 'group', fetchIds: fetchGroupIds }
]

export const AuthContext = createContext<ContextArgumentTypes>({
    user: { name: "", profile_pic: "", id: ""  }, 
    logUserIn: () => null,
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

    function logUserIn() {
        fetchUserDetails()
            .then(res => setUser(res))
            .catch(error => alert(error.message));
    };
    function getIds() {
        for (let { key, fetchIds } of FETCH_ID_TYPES) {
            fetchIds(user.id)
                .then((res) => setIds(prev => ({ ...prev, [key]: res })))
                .catch(error => console.error(error));
        }
    };
    function logout() {
        setUser({} as UserType);
        navigate('/')
    };

    useEffect(() => {
        if (Boolean(user.id)) getIds();
    }, [user])

    useLayoutEffect(() => {
        logUserIn();
    }, [])
    
    return (
        <AuthContext.Provider value={{ user, logUserIn, logout, socket, friend, group, getIds }}>
            {children}
        </AuthContext.Provider>
    )
}