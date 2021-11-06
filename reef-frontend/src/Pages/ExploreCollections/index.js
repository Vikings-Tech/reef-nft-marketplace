import { useContext, useEffect, useState } from "react";
import CollectionCard from "../../Components/CollectionCard";
import NFTCard from "../../Components/NFTCard";
import NFTForSaleCard from "../../Components/NFTForSaleCard";
import { getJSONfromHash } from "../../config/axios";
import Web3Context from "../../Context/Web3Context";

const ExploreCollections = () => {
    const { fetchMarketItems } = useContext(Web3Context);
    const [allCollections, setAllCollections] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            setAllCollections(await fetchMarketItems());
        }
        fetch();

    }, [])

    return (<>
        <div className="container mx-auto px-2 lg:px-4 mt-4">
            <div className="w-full text-3xl text-center">NFTs to Buy</div>
            <div className="grid grid-cols-3 gap-4">
                {allCollections.map((collection) => {
                    return (<NFTForSaleCard {...collection} />);
                })}
            </div>
        </div>

    </>)
}
export default ExploreCollections;