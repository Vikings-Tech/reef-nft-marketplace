import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getJSONfromHash } from "../../config/axios";
import ExplorePageContext from "../../Context/ExplorePageContext";
import Web3Context from "../../Context/Web3Context";
import { utils } from "ethers";
import Text from "../Inputs/Text";

const NFTForSaleCard = (props) => {
    const { metaData = {}, tokenId, nftContract, price, royalty, creator, isAuction, itemId, auction } = props
    const { selectedNFTtoBuy, setSelectedNFTtoBuy } = useContext(ExplorePageContext);
    const history = useHistory()
    const { tokenURI, createAuctionBid } = useContext(Web3Context);
    const [currentMetaData, setCurrentMetaData] = useState({});
    const [nftData, setNftData] = useState();
    const [bid, setBid] = useState(0);
    const [timeLeft, setTimeLeft] = useState(new Date());
    console.log(props);
    const calculateTimeLeft = (endTime) => {
        let currDate = Date.now();
        console.log(endTime);
        const actualDate = new Date(parseInt(endTime) * 1000);
        console.log(actualDate);
        console.log(currDate);
        setTimeLeft(new Date(actualDate - currDate))
    };
    useEffect(() => {
        if (auction?.timeEnding) {
            const timer = setTimeout(() => {
                calculateTimeLeft(auction.timeEnding.toString());
            }, 1000);
        }
    });

    useEffect(() => {
        const fetchMetaData = async () => {
            const nftData = {
                ...props
            }
            nftData["tokenURI"] = await tokenURI(tokenId, nftContract);
            nftData["metaData"] = (await getJSONfromHash(nftData.tokenURI)).data;
            setNftData(nftData);
            setCurrentMetaData(nftData.metaData);
            calculateTimeLeft(auction.timeEnding.toString());
        }
        fetchMetaData();

    }, [tokenId]);
    const handleClick = () => {
        console.log('ehdfsa');
        setSelectedNFTtoBuy(nftData);
        history.push("/explore/detail");
    }
    const handlePlace = async () => {
        await createAuctionBid(itemId, bid);
    }

    return (<div class="w-96  bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
        <div>
            <img class="object-center object-cover h-64 w-full" src={currentMetaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${currentMetaData?.image}` : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80" || metaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${metaData?.image}` : metaData?.file instanceof File ? URL.createObjectURL(metaData?.file) : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"} alt="photo" />
        </div >
        <div onClick={handleClick} class="h-48 text-center py-8 sm:py-6">
            <p class="text-xl text-gray-700 font-bold mb-2">{currentMetaData?.title || metaData?.title}</p>
            <p class="text-base text-gray-400 font-normal">{currentMetaData?.subtitle || metaData?.subtitle}</p>
            <p class="text-base text-gray-400 font-normal">Sale Type: {isAuction ? "Auction" : "Direct Buy"}</p>
            <p class="text-base text-gray-400 font-normal">Price: {utils.formatEther(price)} reef</p>
            <p class="text-base text-gray-400 font-normal">Royalty: {utils.formatEther(royalty)} reef</p>

        </div>
        {isAuction &&
            <>
                <div class="text-center py-8 sm:py-6 px-2">
                    <p class="text-base text-gray-400 font-normal">Highest Bid: {utils.formatEther(auction.highestBid)}</p>
                    <p class="text-base text-gray-400 font-normal truncate">Highest Bidder: {utils.formatEther(auction.highestBidder)}</p>
                    <p class="text-base text-gray-400 font-normal">Time Left: {Math.floor(timeLeft / 86400000)} Days, {timeLeft.getHours()} Hours, {timeLeft.getMinutes()} Minutes, {timeLeft.getSeconds()} Seconds.</p>

                </div>
                <div className="flex py-8 sm:py-6 px-2">
                    <Text
                        title="Bid"
                        value={bid}
                        onChange={(e) => setBid(e.target.value)} />
                    <button
                        className=" mt-3 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        onClick={handlePlace}>Place Bid</button>
                </div>
            </>
        }
    </div >);
}
export default NFTForSaleCard