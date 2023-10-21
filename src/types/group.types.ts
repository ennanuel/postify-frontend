import { UserType } from "./user.types";

export interface GroupType {
    id: string;
    name: string;
    group_desc?: string;
    picture: string;
    cover?: string;
    member_pics?: string[];
    is_member?: boolean;
    owner?: boolean;
    invite?: boolean;
    members?: number;
}

export interface GroupInfo extends GroupType {
    creator: string;
    members: number;
    tags: string[];
    photos: string[];
    date_created: string;
}

export interface GroupCardProp extends GroupType {
    joinGroup?: () => void;
    rejectInvite?: () => void;
};

interface GroupValueTypes {
    name: string;
    group_desc: string;
    tags: string[];
    profile_pic: File | undefined;
    cover: File | undefined;
};

export interface CreateGroupValues extends GroupValueTypes {
    invites: string[];
}

export interface EditGroupValues extends GroupValueTypes {
    prev_pic: string | undefined;
    prev_cover: string | undefined;
}

export interface MemberProps extends UserType {
    removeMember?: () => void;
    removeInvite?: () => void;
}