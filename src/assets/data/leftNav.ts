import { channel_icon, friend_icon1, group_icon, group_icon1, message_icon1, settings_icon, videos_icon } from "../images";

const leftNav = [
    {
        title: null,
        items: [
            {
                name: 'Friends',
                icon: friend_icon1,
                link: '',
                to: '/friends/all'
            },
            {
                name: 'Groups',
                icon: group_icon1,
                link: '',
                to: '/groups/posts'
            },
    ]},
    {
        title: "Your Shortcuts",
        items: [
            {
                name: 'My Groups',
                icon: group_icon,
                link: '',
                to: '/groups/list'
            },
            {
                name: 'Messages',
                icon: message_icon1,
                link: '',
                to: '/message'
            },
            {
                name: 'Channels',
                icon: channel_icon,
                link: '',
                to: '/channels/feed'
            },
            {
                name: 'Videos',
                icon: videos_icon,
                link: '',
                to: '/short/abc'
            },
            {
                name: 'Settings',
                icon: settings_icon,
                link: '',
                to: '/settings'
            }
        ]
    },
]


export default leftNav;