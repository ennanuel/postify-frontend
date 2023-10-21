import { PostType } from "./post.types";

export type ChannelType = {
    id: string;
    name: string;
    picture: string;
    channel_desc: string;
}

export type ChannelDetailsType = {
    id: string;
    name: string;
    channel_desc: string;
    picture: string;
    cover: string;
    popularity: number;
    posts: number;
    tags: string[];
    website: string;
    following: boolean;
    owner: boolean;
}

export interface VideoCardProps extends PostType {
    picture: string;
    listType: 'following' | 'notfollowing' | 'single';
}

export type CreateChannelValues = {
    name: string;
    channel_desc: string;
    website: string;
    tags: string[];
    profile_pic: File|undefined;
    cover: File | undefined;
    prev_pic?: string;
    prev_cover?: string;
}