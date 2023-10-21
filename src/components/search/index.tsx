import { useMemo } from "react";
import { Link } from "react-router-dom";
import PeopleCard from "./PeopleCard";
import PostCard from "./PostCard";
import GroupCard from "./GroupCard";
import ChannelCard from "./ChannelCard";
import { SearchResults } from "../../types/others.types";
import { PostType } from "../../types/post.types";
import { UserType } from "../../types/user.types";
import { ChannelType } from "../../types/channel.types";
import { GroupType } from "../../types/group.types";

type Value = PostType & UserType & ChannelType & GroupType;

type SearchProps = {
    searchResults: SearchResults;
    filter: string;
    search: string;
}

const Cards = {
    people: PeopleCard,
    post: PostCard,
    group: GroupCard,
    channel: ChannelCard
}

const Search = ({ searchResults, filter, search }: SearchProps) => {
    const searchArray = useMemo(() => Object.entries(searchResults), [searchResults])
    const filterRgx = useMemo(() => new RegExp(filter, 'i'), [filter])
    return (
        <div>
            {
                searchArray
                    .filter((val) => filterRgx.test(val[0]))
                    .map(([key, values]) => {
                        const Card = Cards[key as keyof typeof Cards];
                        return (
                            values.length >= 1 &&
                            <div className="p-4 lg:px-[15%] flex flex-col gap-4 mt-4 pb-6">
                                {
                                    filter?.length < 1 &&
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className="font-bold text-xl capitalize">{key}</h3>
                                        <Link to={`/search/${search}?filter=${key}`} className="text-xs">More</Link>
                                    </div>
                                }
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {
                                        values.map(value => Card && <Card {...value as Value} />)
                                    }
                                </ul>
                            </div>
                    )})
            }
        </div>
    )
}

export default Search
