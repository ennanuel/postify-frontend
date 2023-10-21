import { Socket } from "socket.io-client";

export interface UserType {
    id: string;
    name: string;
    profile_pic: string;
    bio?: string;
    hide?: boolean;
    active?: boolean;
    is_owner?: boolean;
    is_user?: boolean;
    is_friend?: boolean;
    is_sent_request?: boolean;
    is_received_request?: boolean;
    is_group_owner?: boolean;
    is_invited?: boolean;
}

export type  ContextArgumentTypes = { 
    user: UserType;
    logUserIn: () => void;
    logout: () => void;
    friend: string[];
    group: string[];
    getIds: (type: string) => void;
    socket: Socket
}