import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import CollectionCard from "../../Components/CollectionCard";
import EmptySection from "../../Components/EmptySection";
import Spinner from "../../Components/Loader/Spinner";
import { getJSONfromHash } from "../../config/axios";
import Web3Context from "../../Context/Web3Context";



const UserCollections = () => {
    const history = useHistory()
    const { getUserCollections } = useContext(Web3Context);
    const [allCollections, setAllCollections] = useState(undefined);
    useEffect(() => {

        getUserCollections().then(data => setAllCollections(data));
    }, [])
    const ListOfCollections = () => {
        return (<div className="grid grid-cols-3 gap-4">

            {allCollections.map((collection) => {
                return (<CollectionCard metaDataHash={collection.metaDataHash} collection={collection} />);
            })}
        </div>);
    }
    const onClickCreateCollection = () => {
        history.push("/createCollection")
    }

    return (<>
        <div className="container mx-auto  lg:px-8 mt-4">
            <div className="w-full my-16 text-5xl font-semibold text-center">Your Collections</div>
            {!allCollections ? <Spinner /> :
                allCollections?.length === 0 ?
                    <EmptySection item="collection" onClick={onClickCreateCollection} /> :
                    <ListOfCollections />}

        </div>

    </>)
}
export default UserCollections;