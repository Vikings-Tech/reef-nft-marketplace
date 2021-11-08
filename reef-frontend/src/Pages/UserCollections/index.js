import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import CollectionCard from "../../Components/CollectionCard";
import EmptySection from "../../Components/EmptySection";
import Spinner from "../../Components/Loader/Spinner";
import Tabs from "../../Components/Tabs";
import { getJSONfromHash } from "../../config/axios";
import Web3Context from "../../Context/Web3Context";



const UserCollections = () => {
    const history = useHistory()
    const { getUserCollections, totalCollections, getCollections } = useContext(Web3Context);
    const [userCollections, setUserCollections] = useState(undefined);
    const [allCollections, setAllCollections] = useState(undefined);
    const [fetchedCollections, setFetchedCollections] = useState(0);
    const [totalCollectionsN, setTotalCollections] = useState(0);
    useEffect(() => {
        const getAllCollections = async () => {
            const result = parseInt((await totalCollections()).toString());
            setTotalCollections(result);
            setAllCollections((await getCollections(0, Math.min(5, result)))[0]);
            setFetchedCollections(Math.min(2, result));

        }
        getAllCollections();
        getUserCollections().then(data => setUserCollections(data));

    }, [])
    const getMoreCollections = async () => {
        setAllCollections([...allCollections, ...(await getCollections(fetchedCollections, Math.min(fetchedCollections + 5, totalCollectionsN)))]);
        setFetchedCollections(Math.min(fetchedCollections + 5, totalCollectionsN));
    }
    console.log(totalCollectionsN);
    console.log(allCollections);
    const ListOfUserCollections = () => {
        return (<div className="grid grid-cols-3 gap-4">

            {userCollections.map((collection) => {
                return (<CollectionCard metaDataHash={collection.metaDataHash} collection={collection} />);
            })}
        </div>);
    }
    const ListOfAllCollections = () => {
        return (<div><div className="grid grid-cols-3 gap-4">

            {allCollections.map((collection) => {
                return (<CollectionCard metaDataHash={collection.metaDataHash} collection={collection} />);
            })}
        </div>
            {fetchedCollections < totalCollectionsN ? <button
                onClick={getMoreCollections}
                type="button"
                className=" mx-auto mt-3 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
                {/* <PhoneIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                <span>Fetch More</span>
            </button> : <></>}

        </div>);
    }
    const onClickCreateCollection = () => {
        history.push("/createCollection")
    }

    return (<>
        <div className="container mx-auto  lg:px-8 mt-4 pb-16">
            <Tabs tabs={["Your Collections", "All Collections"]}>
                {!userCollections ? <Spinner /> :
                    userCollections?.length === 0 ?
                        <EmptySection item="collection" onClick={onClickCreateCollection} /> :
                        <ListOfUserCollections />}
                {!allCollections ? <Spinner /> :
                    allCollections?.length === 0 ?
                        <EmptySection item="collection" onClick={onClickCreateCollection} /> :
                        <ListOfAllCollections />}
            </Tabs>


        </div>

    </>)
}
export default UserCollections;