import { ChannelType } from './channel.types';
import { FriendType } from './friend.types';
import { GroupType } from './group.types';
import { PostType } from './post.types'
import { UserType } from './user.types';

export type SearchResults = {
    people: UserType[];
    post: PostType[];
    group: GroupType[];
    channel: ChannelType[];
    friend: FriendType[];
}