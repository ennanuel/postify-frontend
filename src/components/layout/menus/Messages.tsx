import { Add } from '@mui/icons-material'

const Messages = ({ close }: { close: () => void }) => {
    return (
        <div className="menu fixed bottom-3 right-3 flex flex-col h-[50vh] w-[300px] z-[999] rounded-lg shadow-lg shadow-black-900/40">
            <div className="flex items-center justify-between gap-4 p-4">
                <h3 className="font-bold">Messages</h3>
                <button onClick={close} className="flex items-center justify-center rotate-45">
                    <Add />
                </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-scroll overflow-x-clip">
                <div className="flex items-center gap-4 px-3 py-2 hover:bg-white/5">
                    <div className="relative">
                        <img src="" alt="" className="w-[40px] aspect-square rounded-full" />
                        <div className="absolute bottom-0 right-0 w-2 aspect-square rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <p className="text-sm font-semibold">Nnanna Ezema</p>
                        <p className="text-xs opacity-70">yo do you have the...</p>
                    </div>
                    <p className="text-xs opacity-70">2h</p>
                </div>
            </div>
        </div>
    )
}

export default Messages
