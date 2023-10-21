import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { ChannelType } from '../../types/channel.types';
import { fetchSearchValues } from '../../utils';
import { AuthContext } from '../../context/authContext';
import { ChannelCard } from '../../components/cards';

const SearchChannel = () => {
    const { user } = useContext(AuthContext)
    const { query } = useParams();
    const [channels, setChannels] = useState<ChannelType[]>([]);

    useEffect(() => { 
        if (!query) return;
        fetchSearchValues({ user_id: user.id, query, filter: 'channel' })
            .then(res => setChannels(res.channel))
            .catch(error => alert(error));
    }, [query])

    return (
        <section className="p-4 lg:row-span-2">
            <h2 className='text-2xl font-bold'>Search Result</h2>
            <ul className='mt-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {
                    channels.map((channel, i) => (
                        <li key={i}><ChannelCard {...channel} /></li>
                    ))
                }
            </ul>
        </section>
    )
}

export default SearchChannel
