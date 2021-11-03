import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollectionCard from '../../Components/CollectionCard';
import NFTCard from '../../Components/NFTCard';
import { getJSONfromHash } from '../../config/axios';
import Web3Context from '../../Context/Web3Context';

const CollectionDetail = () => {
    const { totalSupply, tokenOfOwnerByIndex, tokenURI } = useContext(Web3Context)
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
                const response = parseInt((await totalSupply(contractAddress)).toString());
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
            for (var i = 1; i <= totalNFTs; i++) {
                nfts.push(await tokenURI(i, contractAddress));
            }
            console.log(nfts.map(e => e.toString()));
            setNFTDetails(nfts);
        }
        fetchNFTData();
    }, [totalNFTs]);
    return (<div>
        <div class="md:grid md:grid-cols-3 md:gap-6">
            <CollectionCard metaData={currentMetaData} />

            <div class="mt-5 md:mt-0 md:col-span-2">
                <div className="flex justify-between items-center">
                    <h1>Your NFTs</h1>
                    <div class="px-4 py-3  text-right sm:px-6">
                        <Link to={`/${contractAddress}/${metaDataHash}/${ownerAddress}/mint`} class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Create New NFT +
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">

                    {NFTDetails.map(hash => {
                        return (<NFTCard metaDataHash={hash} />)
                    })}
                </div>


            </div>
        </div>
    </div>)

}
export default CollectionDetail;