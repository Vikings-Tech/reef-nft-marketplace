import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollectionCard from '../../Components/CollectionCard';
import NFTCard from '../../Components/NFTCard';
import { getJSONfromHash } from '../../config/axios';
import Web3Context from '../../Context/Web3Context';
import DetailBanner from './DetailBanner';


const CollectionDetail = () => {
    console.log("HEre");
    const { totalSupply, balanceOf, tokenOfOwnerByIndex, tokenURI } = useContext(Web3Context)
    const { metaDataHash, contractAddress, ownerAddress } = useParams();
    const [currentMetaData, setCurrentMetaData] = useState({});
    const [totalNFTs, setTotalNFTs] = useState(0);
    const [NFTDetails, setNFTDetails] = useState([])
    useEffect(() => {
        const fetchNFTs = async () => {
            //BalancOf->10
            //tokenOfOwnerBYinDex-> 0-9
            //tokenURI
            if (contractAddress) {
                const response = parseInt((await balanceOf(ownerAddress, contractAddress)).toString());
                setTotalNFTs(response);
                console.log(response);

            }
        }
        fetchNFTs();
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
            let nfts = [];
            for (var i = 0; i < totalNFTs; i++) {
                nfts.push(await tokenURI(parseInt((await tokenOfOwnerByIndex(ownerAddress, i, contractAddress)).toString()), contractAddress));
            }
            console.log(nfts.map(e => e.toString()));
            setNFTDetails(nfts);
        }
        fetchNFTData();
    }, [totalNFTs]);
    return (<div>
        <div class="">
            <DetailBanner metaData={currentMetaData} />

            <div class="">
                <div className="flex my-8 justify-around items-center">
                    <h1 className="text-5xl text-gray-700 font-bold text-center">Your NFTs</h1>

                </div>
                <div className="my-8 max-w-6xl mx-auto grid grid-cols-3 gap-4">

                    {NFTDetails.map(hash => {
                        return (<NFTCard metaDataHash={hash} />)
                    })}
                </div>
                <div class="px-4 py-3  text-center sm:px-6">
                    <Link to={`/${contractAddress}/${metaDataHash}/${ownerAddress}/mint`} class="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Create New NFT +
                    </Link>
                </div>


            </div>
        </div>
    </div>)

}
export default CollectionDetail;