import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import CollectionCard from '../../Components/CollectionCard';
import EmptySection from '../../Components/EmptySection';
import Spinner from '../../Components/Loader/Spinner';
import NFTCard from '../../Components/NFTCard';
import { getJSONfromHash } from '../../config/axios';
import Web3Context from '../../Context/Web3Context';
import NFTDetail from '../NFTs/NFTDetail';
import DetailBanner from './DetailBanner';


const CollectionDetail = () => {
    console.log("HEre");
    const history = useHistory();
    const { totalSupply, balanceOf, tokenOfOwnerByIndex, tokenURI, isApprovedForAll } = useContext(Web3Context)
    const { metaDataHash, contractAddress, ownerAddress } = useParams();
    const [currentMetaData, setCurrentMetaData] = useState({});
    const [totalNFTs, setTotalNFTs] = useState(-1);
    const [NFTDetails, setNFTDetails] = useState(undefined)
    const [selectedNFT, setSelectedNFT] = useState();
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        const fetchNFTs = async () => {
            const response = parseInt((await balanceOf(ownerAddress, contractAddress)).toString());
            setTotalNFTs(response);
            console.log(response);


        }
        const checkApproval = async () => {
            setIsApproved(await isApprovedForAll(ownerAddress, contractAddress));
        }
        if (contractAddress) {
            checkApproval();
            fetchNFTs();
        }
    }, [contractAddress])
    useEffect(() => {
        const fetchMetaData = async () => {
            if (metaDataHash) {
                const response = await getJSONfromHash(metaDataHash)
                setCurrentMetaData(response.data);
                console.log(response.data);
            }
        }
        fetchMetaData();
    }, [metaDataHash]);
    useEffect(() => {
        const fetchNFTData = async () => {
            if (totalNFTs < 0) {
                return;
            }
            let nfts = [];
            for (var i = 0; i < totalNFTs; i++) {
                const nftData = {
                    ownerAddress: ownerAddress,
                    contractAddress: contractAddress,
                    tokenId: parseInt((await tokenOfOwnerByIndex(ownerAddress, i, contractAddress)).toString()),
                }
                nftData["tokenURI"] = await tokenURI(nftData.tokenId, contractAddress);
                nftData["metaData"] = (await getJSONfromHash(nftData.tokenURI)).data;
                nfts.push(nftData);
            }
            console.log(nfts.map(e => e.toString()));
            setNFTDetails(nfts);
        }

        fetchNFTData();
    }, [totalNFTs]);
    useEffect(() => {


    }, [contractAddress])
    return (<div>
        <div class="">
            <DetailBanner metaData={currentMetaData} isApproved={isApproved} setIsApproved={setIsApproved} />

            <div class="">
                <div className="flex my-8 justify-around items-center">
                    <h1 className="text-5xl text-gray-700 font-bold text-center">Your NFTs</h1>

                </div>
                {selectedNFT ? <NFTDetail {...selectedNFT} isApproved={isApproved} /> : <></>}


                {NFTDetails === undefined ?
                    <Spinner /> :
                    NFTDetails.length <= 0 ?
                        <EmptySection item="NFT" onClick={() => history.push(`/${contractAddress}/${metaDataHash}/${ownerAddress}/mint`)} /> :
                        <>    <div className="my-8 max-w-6xl mx-auto grid grid-cols-3 gap-4">{NFTDetails.map(nftData => {
                            return (<div onClick={() => setSelectedNFT(nftData)}><NFTCard {...nftData} /></div>)
                        })}</div>
                            <div class="px-4 py-3  text-center sm:px-6">
                                <Link to={`/${contractAddress}/${metaDataHash}/${ownerAddress}/mint`} class="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Create New NFT +
                                </Link>
                            </div></>}




            </div>
        </div>
    </div>)

}
export default CollectionDetail;