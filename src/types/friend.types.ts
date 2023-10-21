import { UserType } from "./user.types";


export interface CustomFriendGroupInt {
    group_name: string;
    color: 'purple' | 'blue' | 'red' | 'white' | 'black';
}

export interface FriendType extends UserType {
    mutual_pics: string[];
}

export interface CustomFriendGroupValues extends CustomFriendGroupInt {
    users: string[];
    group_id?: string;
    user_id?: string;
}

export interface CustomFriendGroupType extends CustomFriendGroupInt {
    id: string;
    friends_count: number;
    friend_pics: string[];
    friend_names: string[];
}