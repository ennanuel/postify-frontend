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

export const GroupContext = createContext<GroupType>({} as GroupType);

const Group = () => {
    const { user: { id: user_id } } = useContext(AuthContext)
    const { id } = useParams()
    const [groupInfo, setGroupInfo] = useState<GroupType>({} as GroupType);

    const fetchGroupInfo = async () => {
        const response = await fetch(`${APIURL}/group/info/${id}`)
        if (response.status !== 200) return alert('something went wrong')
        const res = await response.json();
        setGroupInfo({ ...res, owner: res.creator === user_id });
    }

    useEffect(() => { fetchGroupInfo() }, [])

    return (
        <div className="group w-full min-h-[100vh]">
            <GroupContext.Provider value={groupInfo}>
                <DetailsHeader />
                <div className="px-[13%]">
                    <Outlet />
                </div>
            </GroupContext.Provider>
        </div>
    )
}

export default Group;