import { createContext, useState } from 'react';

type UserType = {
    name: string;
    profilePic: string;
    id: string;
}

type ContextArgTypes = { 
    user: UserType;
    login: ( user : UserType ) => void;
}

export const AuthContext = createContext<ContextArgTypes>({
     user: { name: "", profilePic: "", id: "" }, 
     login: ( user ) => null 
});

export function AuthContextProvider ({ children } : { children: JSX.Element }) {
    const [user, setUser] = useState<UserType>({} as UserType);

    const login = ( user : UserType ) => {
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    )
}