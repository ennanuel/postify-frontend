import { useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GridViewRounded, MessageRounded, NotificationsRounded } from '@mui/icons-material';
import Messages from './Messages';
import Shortcuts from './Shortcuts';
import Notifications from './Notifications';
import Profile from './Profile';
import { AuthContext } from '../../../context/authContext';

const Menus = () => {
    const { user } = useContext(AuthContext);
    const [params, setParams] = useSearchParams({menu: ''});
    const Menu = useMemo(() => { 
        const menu = params.get('menu');
        switch (menu) {
            case 'shortcut':
                return <Shortcuts close={closeMenu} />;
            case 'message':
                return <Messages close={closeMenu} />;
            case 'notification':
                return <Notifications close={closeMenu} />;
            case 'profile':
                return <Profile close={closeMenu} />;
            default:
                return null;
        }
    }, [params])

    function closeMenu() {
        setParams({ menu: '' })
    }

    function changeMenu(menu: string) { 
        if (!menu) return;
        setParams({ menu: params.get('menu') === menu ? '' : menu });
    };

    return (
        <div className="menus right flex-[2] hidden lg:flex items-center justify-end gap-2">
            <div className="flex items-center justify-end gap-4">
                <button
                    onClick={() => changeMenu('shortcut')}
                    className={`h-[40px] w-[40px] rounded-full flex items-center justify-center ${params.get('menu') === 'shortcut' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                    <GridViewRounded />
                </button>
                <button
                    onClick={() => changeMenu('message')}
                    className={`h-[40px] w-[40px] rounded-full flex items-center justify-center ${params.get('menu') === 'message' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                    <MessageRounded />
                </button>
                <button
                    onClick={() => changeMenu('notification')}
                    className={`h-[40px] w-[40px] rounded-full flex items-center justify-center ${params.get('menu') === 'notification' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                    <NotificationsRounded />
                </button>
                <button
                    onClick={() => changeMenu('profile')}
                    className={`h-[40px] w-[40px] rounded-full flex items-center justify-center ${params.get('menu') === 'profile' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                    <img src={user.profile_pic} className="w-full h-full rounded-full block" alt="" />
                </button>
            </div>
            { Menu }
        </div>
    )
}

export default Menus
