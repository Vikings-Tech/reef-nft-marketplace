import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getJSONfromHash } from "../../../../config/axios";
import Web3Context from "../../../../Context/Web3Context";



const NFTListedCard = (props) => {
    const { metaData = {}, tokenId, nftContract, price, royalty, creator, itemId } = props
    const history = useHistory()
    const { tokenURI, unlistItem } = useContext(Web3Context);
    const [currentMetaData, setCurrentMetaData] = useState({});
    const [nftData, setNftData] = useState();
    useEffect(() => {
        const fetchMetaData = async () => {
            const nftData = {
                ...props
            }
            nftData["tokenURI"] = await tokenURI(tokenId, nftContract);
            nftData["metaData"] = (await getJSONfromHash(nftData.tokenURI)).data;
            setNftData(nftData);
            setCurrentMetaData(nftData.metaData);
        }
        fetchMetaData();

    }, [tokenId]);
    const handleClick = async () => {
        if (await unlistItem(itemId)); {
            history.push("/")
        }
    }

    return (<div class="w-96  bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
        <div>
            <img class="object-center object-cover h-64 w-full" src={currentMetaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${currentMetaData?.image}` : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80" || metaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${metaData?.image}` : metaData?.file instanceof File ? URL.createObjectURL(metaData?.file) : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"} alt="photo" />
        </div >
        <div class="h-48 text-center py-8 sm:py-6">
            <p class="text-xl text-gray-700 font-bold mb-2">{currentMetaData?.title || metaData?.title}</p>
            <p class="text-base text-gray-400 font-normal">{currentMetaData?.description || metaData?.description}</p>
            <button
                className=" mt-3 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                onClick={handleClick}>Unlist</button>
        </div>
    </div >);
}
export default NFTListedCard