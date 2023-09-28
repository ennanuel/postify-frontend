import { Add, PeopleAltOutlined } from '@mui/icons-material'
import React from 'react'

const Notifications = ({ close }: {close: () => void }) => {
    return (
        <div className="menu fixed bottom-3 right-3 flex flex-col h-[calc(100vh_-_90px)] w-[300px] bg-black-900 z-[999] rounded-lg shadow-lg shadow-black-900/40">
            <div className="flex items-center justify-between gap-4 p-4">
                <h3 className="font-bold">Notifications</h3>
                <button onClick={close} className="flex items-center justify-center rotate-45">
                    <Add />
                </button>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5">
                    <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-white/5">
                        <PeopleAltOutlined />
                    </div>
                    <p className="flex-1 text-sm truncate"><span className="font-bold">Nnanna</span> commented on your post</p>
                </div>
            </div>
        </div>
    )
}

export default Notifications
