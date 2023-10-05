const APIURL = 'http://localhost:4000'

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', APIURL)

export const fetchOptions: RequestInit = {
    method: 'GET',
    redirect: "follow",
    credentials: "include",
    headers
};

export const cloudImgURL = 'https://res.cloudinary.com/dewej0c6m/image/upload/v1';
export const cloudVideoURL = 'https://res.cloudinary.com/dewej0c6m/video/upload/v1';

export const post_bgs = {
    none: {
        from: 'from-white/20',
        via: '',
        to: 'to-white/5',
    },
    blue: {
        from: 'from-blue-600',
        via: 'via-purple-600',
        to: 'to-red-300',
    },
    red: {
        from: 'from-red-600',
        via: 'to-orange-500',
        to: 'to-yellow-200',
    },
    white: {
        from: 'from-gray-200',
        via: '',
        to: 'to-gray-700',
    },
    black :{
        from: 'from-gray-600',
        via: '',
        to: 'to-black-900',
    }
}

export const custom_group_bgs = {
    purple: {
        from: 'from-purple-800',
        via: 'via-purple-400',
        to: 'to-blue-300',
    },
    blue: {
        from: 'from-blue-900',
        via: 'via-blue-400',
        to: 'to-blue-300',
    },
    red: {
        from: 'from-red-900',
        via: 'to-red-500',
        to: 'to-red-200',
    },
    white: {
        from: 'from-gray-200',
        via: '',
        to: 'to-gray-700',
    },
    black: {
        from: 'from-gray-600',
        via: '',
        to: 'to-black-900',
    }
}

export default APIURL;