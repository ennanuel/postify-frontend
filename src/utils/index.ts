import APIURL, { fetchOptions } from "../assets/data/data";
import { SearchResults } from "../types/others.types";

export const convertFileToBase64 = (file: File) => new Promise<string>(
    function (resolve, reject) {
        try {
            if (file.size > 1024 * 1024 * 3) reject('file size too big!');
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = () => {
                const result = String(fileReader.result);
                resolve(result);
            };
        } catch (error) {
            reject(error);
        }
    }
)

export const fetchSearchValues = ({ query, user_id, filter }: { query: string; user_id: string; filter: string; }) => new Promise<SearchResults>(
    async function (resolve, reject) {
        const response = await fetch(`${APIURL}/search/${query}?user_id=${user_id}?type=${filter}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) reject(res.message);
        resolve(res);
    }
);