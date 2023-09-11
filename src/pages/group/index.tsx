import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useParams } from "react-router-dom";
import DetailsHeader from './DetailHeader';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import './group.scss';

type GroupType = {
    id: string;
    name: string;
    cover: string;
    member_pics: string[];
    owner: boolean;
}

type GroupContextType = {
    group: GroupType;
    refreshPost: boolean;
    refreshDet: boolean;
}

export const GroupContext = createContext<GroupContextType>({ group: {} as GroupType, refreshPost: false, refreshDet: false });

const Group = () => {
    const { user, socket, getIds } = useContext(AuthContext)
    const { id } = useParams()

    const [groupInfo, setGroupInfo] = useState<GroupType>({} as GroupType);
    const [refreshPost, setRefreshPost] = useState<boolean>(false)
    const [refreshDet, setRefreshDet] = useState<boolean>(false)

    const fetchGroupInfo = async () => {
        const response = await fetch(`${APIURL}/group/info/${id}?user_id=${user.id}`)
        if (response.status !== 200) return alert('something went wrong')
        const res = await response.json();
        setGroupInfo(res);
    }

    useEffect(() => {
        fetchGroupInfo();
    }, [id])

    useEffect(() => {
        socket.on('group-event', ({ group_id, user_id }) => {
            if (group_id === id) {
                fetchGroupInfo();
                setRefreshDet(!refreshDet)
            };
            if (user_id === user.id) {
                getIds('group');
            }
        })

        socket.on('post-event', ({ group_id }) => {
            if (group_id === id) {
                setRefreshPost(!refreshPost)
            }
        })
    }, [socket, refreshPost, refreshDet])

    return (
        <div className="group w-full min-h-[100vh]">
            <GroupContext.Provider value={{ group: groupInfo, refreshDet, refreshPost }}>
                <DetailsHeader />
                <div className="px-[13%]">
                    <Outlet />
                </div>
            </GroupContext.Provider>
        </div>
    )
}

export default Group;