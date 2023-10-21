import { IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const Navigations = ({ goUp, goDown }: { goUp: () => void; goDown: () => void; }) => {
    return (
        <div className="hidden lg:flex flex-col gap-2">
            <IconButton onClick={goUp} sx={{ padding: 0, margin: 0 }}>
                <span className='flex items-center justify-center text-white w-[40px] aspect-square rounded-full bg-black-900/40'><KeyboardArrowUp /></span>
            </IconButton>
            <IconButton onClick={goDown} sx={{ padding: 0, margin: 0 }}>
                <span className='flex items-center justify-center text-white w-[40px] aspect-square rounded-full bg-black-900/40'><KeyboardArrowDown /></span>
            </IconButton>
        </div>
    )
}

export default Navigations
