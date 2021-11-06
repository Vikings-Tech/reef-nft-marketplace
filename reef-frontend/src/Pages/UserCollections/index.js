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
            setAllCollections(await getCollections(0, Math.max(20, result)));
            setFetchedCollections(Math.max(20, result));
        }
        getAllCollections();
        getUserCollections().then(data => setUserCollections(data));

    }, [])
    const ListOfCollections = () => {
        return (<div className="grid grid-cols-3 gap-4">

            {userCollections.map((collection) => {
                return (<CollectionCard metaDataHash={collection.metaDataHash} collection={collection} />);
            })}
        </div>);
    }
    const onClickCreateCollection = () => {
        history.push("/createCollection")
    }

    return (<>
        <div className="container mx-auto  lg:px-8 mt-4">
            <Tabs tabs={["Your Collections", "All Collections"]}>
                {!userCollections ? <Spinner /> :
                    userCollections?.length === 0 ?
                        <EmptySection item="collection" onClick={onClickCreateCollection} /> :
                        <ListOfCollections />}
                {!allCollections ? <Spinner /> :
                    allCollections?.length === 0 ?
                        <EmptySection item="collection" onClick={onClickCreateCollection} /> :
                        <ListOfCollections />}
            </Tabs>


        </div>

    </>)
}
export default UserCollections;