import { useContext, useEffect, useState } from "react";
import NFTListedCard from "../../Components/Cards/NFT/Listed";
import CollectionCard from "../../Components/CollectionCard";
import Spinner from "../../Components/Loader/Spinner";
import NFTCard from "../../Components/NFTCard";
import NFTForSaleCard from "../../Components/NFTForSaleCard";
import Tabs from "../../Components/Tabs";
import { getJSONfromHash } from "../../config/axios";
import ExplorePageContext from "../../Context/ExplorePageContext";
import Web3Context from "../../Context/Web3Context";

const ExploreCollections = () => {
    const { selectedNFTtoBuy, setSelectedNFTtoBuy } = useContext(ExplorePageContext);
    const { fetchMarketItems, fetchMyNFTs, fetchItemsCreated, startBidListening } = useContext(Web3Context);
    const [allCollections, setAllCollections] = useState(undefined);
    const [myItemsListed, setMyItemsListed] = useState(undefined);
    const [myOwnedItems, setMyOwnedItems] = useState(undefined);
    useEffect(() => {
        startBidListening();
        const fetch = async () => {
            const result = await fetchMarketItems()
            const collectionsArray = result[0];
            const auctionArray = result[1];
            const allCollectionsData = collectionsArray.map((e, index) => ({ collection: e, auction: auctionArray[index] }));

            setAllCollections(allCollectionsData);
            setMyItemsListed(await fetchItemsCreated());
            setMyOwnedItems(await fetchMyNFTs());
            setSelectedNFTtoBuy({});
        }
        fetch();

    }, [])

    return (<>
        <div className="container mx-auto px-2 lg:px-4 mt-4 mb-16">
            <Tabs tabs={["Marketplace", "Listed", "Owned"]}>
                {/*NFTs for sale*/}
                {!allCollections ? <Spinner /> :
                    <div className="grid grid-cols-3 gap-4">
                        {allCollections.map((data) => {
                            return (<NFTForSaleCard {...(data.collection)} auction={data.auction} />);
                        })}
                    </div>

                }
                {/*My LIsted Items for sale*/}
                {!myItemsListed ? <Spinner /> :
                    <div className="grid grid-cols-3 gap-4">
                        {myItemsListed.map((collection) => {
                            return (<NFTListedCard {...collection} />);
                        })}
                    </div>

                }
                {/*My Owned NFTs*/}
                {!myOwnedItems ? <Spinner /> :
                    <div className="grid grid-cols-3 gap-4">
                        {myOwnedItems.map((collection) => {
                            return (<NFTForSaleCard {...collection} />);
                        })}
                    </div>

                }
                <div>3</div>
                <div>2</div>
            </Tabs>

        </div>

    </>)
}
export default ExploreCollections;