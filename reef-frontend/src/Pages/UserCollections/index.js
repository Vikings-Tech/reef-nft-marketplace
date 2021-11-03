import { useContext, useEffect, useState } from "react";
import CollectionCard from "../../Components/CollectionCard";
import { getJSONfromHash } from "../../config/axios";
import Web3Context from "../../Context/Web3Context";

const UserCollections = () => {
    const { getUserCollections } = useContext(Web3Context);
    const [allCollections, setAllCollections] = useState([]);
    useEffect(() => {

        getUserCollections().then(data => setAllCollections(data));
    }, [])

    return (<>
        <div className="container mx-auto px-2 lg:px-4 mt-4">
            <div className="w-full text-3xl text-center">Your Collections</div>
            <div className="grid grid-cols-3 gap-4">
                {allCollections.map((collection) => {
                    return (<CollectionCard metaDataHash={collection.metaDataHash} collection={collection} />);
                })}
            </div>
        </div>

    </>)
}
export default UserCollections;