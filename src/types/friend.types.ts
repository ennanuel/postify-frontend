

export interface CustomFriendGroupInt {
    group_name: string;
    color: 'purple' | 'blue' | 'red' | 'white' | 'black';
}

export type FriendType = {
    id: string;
    profile_pic: string;
    name: string;
    mutual_pics?: string[];
    type?: 'sent' | 'friend' | 'received';
    active?: boolean;
}

export interface CustomFriendGroupValues extends CustomFriendGroupInt {
    users: string[];
}

export interface CustomFriendGroupType extends CustomFriendGroupInt {
    id: string;
    friends_count: number;
    friend_pics: string[];
    friend_names: string[];
}