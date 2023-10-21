export interface PostType {
  id: string;
  name: string
  user_id: number;
  profile_pic: string;
  post_type: string;
  files: string[];
  post_bg: 'none' | 'blue' | 'red' | 'white' | 'black';
  post_desc: string;
  post_likes: number;
  post_comments: number;
  shares: number;
  liked: boolean;
  last_updated: string;
  date_posted: string;
  is_yours: boolean;
  group_name?: string;
  group_id?: string;
  views?: number;
  is_following?: boolean;
  file?: string;
  channel_id?: string;
  channel_name?: string;
  file_count?: string;
}

export interface CommentType {
  id: string;
  content: string;
  date_uploaded: string;
  user_id: string;
  name: string;
  profile_pic: string;
  likes: number;
  liked: boolean;
  comments: number;
  reply_to: string;
}

export type PostContextArgumentsType = { 
  post: PostType;
  comments: CommentType[];
  commentInFocus: CommentType;
  commentId: string | null;
  showForMobile: undefined | 'comment' | 'desc';
  handleWatch: () => void;
  handleLikePost: () => void;
  showMobileComments: () => void;
  showMobileDesc: () => void;
  hideAll: () => void;
  updateCommentId: (comment_id: string|null) => void;
  handlePostComment: (comment: string) => void;
  handleLikeComment: (comment_id: string, liked: boolean) => void;
}