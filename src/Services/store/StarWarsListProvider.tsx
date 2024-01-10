import React, {
    useState,
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    ReactNode,
    useEffect,
} from "react";
import { gql, useQuery } from "@apollo/client";

export type StarWarsListContextProps = {
    data: any;
    pageSize: number;
    setPageSize: Dispatch<SetStateAction<number>>;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    totalPages: number;
    startCursor:string
    endCursor:string
    afterCursor:any
    setAfterCursor: Dispatch<SetStateAction<string>>;
};

export const initialListView: StarWarsListContextProps = {
    data: null,
    pageSize: 10,
    setPageSize: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    totalPages: 1,
    startCursor:"",
    endCursor:"",
    afterCursor:null,
    setAfterCursor: () => {},
};

const ListViewContext =
    createContext<StarWarsListContextProps>(initialListView);

interface StarWarsContextProviderProps {
    children: ReactNode;
}

const StarWarsListProvider: React.FC<StarWarsContextProviderProps> = ({
    children,
}) => {
    const [startCursor, setStartCursor] = useState<string>(initialListView.startCursor);
    const [endCursor, setEndCursor] = useState<string>(initialListView.endCursor);
    const [afterCursor, setAfterCursor] = useState<string>(initialListView.afterCursor);
    const [pageSize, setPageSize] = useState<number>(initialListView.pageSize);
    const [currentPage, setCurrentPage] = useState<number>(
        initialListView.currentPage
    );
    const [totalPages, setTotalPages] = useState<number>(
        initialListView.totalPages
    );
    const [data, setData] = useState<any>(initialListView.data);


    const GET_ALL_PEOPLE = gql`
        query AllPeople{
            allPeople {
                pageInfo {
                    hasPreviousPage
                    startCursor
                    endCursor
                    hasNextPage
                }
                totalCount
                people {
                    name
                    birthYear
                    eyeColor
                    gender
                    hairColor
                    height
                    mass
                    skinColor
                }
            }
        }
    `;

    const {
        loading,
        error,
        data: queryData,
    } = useQuery(GET_ALL_PEOPLE);


    useEffect(() => {
        if (!loading && !error && queryData) {
            setData(queryData.allPeople.people);
            setStartCursor(queryData.allPeople.pageInfo.startCursor)
            setEndCursor(queryData.allPeople.pageInfo.endCursor)
            setTotalPages(Math.ceil(queryData.allPeople.totalCount / pageSize));
        }
    }, [loading, error, queryData]);

    return (
        <ListViewContext.Provider
            value={{
                data,
                pageSize,
                setPageSize,
                currentPage,
                setCurrentPage,
                totalPages,
                startCursor,
                endCursor,
                afterCursor,
                setAfterCursor
            }}
        >
            {children}
        </ListViewContext.Provider>
    );
};

const useStarWars = (): StarWarsListContextProps => useContext(ListViewContext);

export { StarWarsListProvider, useStarWars };
