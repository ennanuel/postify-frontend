import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyboardArrowLeft, SearchRounded } from '@mui/icons-material';
import { Search as SearchResults } from '../../components';
import { AuthContext } from '../../context/authContext';
import './search.scss';
import { SearchResults as SearchResultsType } from '../../types/others.types';
import { fetchSearchValues } from '../../utils';

const navLinks = ['all', 'people', 'post', 'group', 'channel'];

const Search = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { q } = useParams();
    const [params, setParams] = useSearchParams();
    const paramsFilter = useMemo(() => params.get('filter') || '', [params]);

    const [search, setSearch] = useState<string>(q || '');
    const [searchResults, setSearchResults] = useState<SearchResultsType>({ people: [], post: [], group: [], channel: [], friend: [] });

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        if (!search || search.length < 1) return;
        e.preventDefault();
        navigate(`/search/${search}?filter=${params.get('filter')}`)
    };

    function resolveSearchValues(values: SearchResultsType) {
        for (let [key, value] of Object.entries(values)) {
            if (!navLinks.includes(key)) continue;
            setSearchResults(prev => ({ ...prev, [key]: value }));
        }
    };

    useEffect(() => {
        if (!q) return;
        const filter = (paramsFilter != 'all' && navLinks.includes(paramsFilter)) ? paramsFilter : '';
        fetchSearchValues({ user_id: user.id, query: q, filter })
            .then(resolveSearchValues)
            .catch(error => alert(error));
    }, [q])

    return (
        <section className="search-page min-h-[calc(100vh-60px)]">
            <div className="flex flex-col lg:flex-row-reverse justify-between gap-2 flex-wrap sticky top-[50px] md:top-[90px] lg:top-[60px] lg:px-[15%] border-b border-white/5">
                <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2 px-2 pt-4 pb-0 pr-3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        className="flex-1 h-[40px] px-3 outline-none border-none rounded-[20px] bg-white/5 shadow shadow-black-900/50" placeholder="Search"
                    />
                    <button className="flex items-center justify-center h-[40px] w-[40px] rounded-full bg-white/10 shadow shadow-black-900/50">
                        <SearchRounded />
                    </button>
                </form>
                <div className="lg:flex-[2] w-full overflow-x-scroll lg:overflow-clip">
                    <ul className="flex items-center gap-2">
                        {
                            navLinks.map((navLink, i) => (
                                <li
                                    key={i}
                                    onClick={() => setParams({ filter: navLink === 'all' ? '' : navLink })}
                                    className={`search-link relative min-w-[80px] h-[40px] md:h-[50px] px-3 flex items-center justify-center capitalize cursor-pointer ${(params.get('filter') === navLink || (!navLinks.includes(params.get('filter') || '') && i === 0)) && 'active-search-link'}`}
                                >{navLink}</li>
                            ))
                        }
                        
                    </ul>
                </div>
            </div>
            <SearchResults
                searchResults={searchResults}
                filter={/people|post|group|channel/.test(paramsFilter) ? paramsFilter :  ''}
                search={search}
            />
        </section>
    )
}

export default Search
