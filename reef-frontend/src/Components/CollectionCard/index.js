import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJSONfromHash } from "../../config/axios";

const CollectionCard = ({ metaData, metaDataHash, collection }) => {
    const [currentMetaData, setCurrentMetaData] = useState({});
    useEffect(() => {
        const fetchMetaData = async () => {
            if (metaDataHash) {
                const response = await getJSONfromHash(metaDataHash)
                setCurrentMetaData(response.data);
            }
        }
        fetchMetaData();
    }, [metaDataHash]);
    useEffect(() => {
        // if (metaData) {
        //     setCurrentMetaData(metaData);
        // }
    }, [metaData])
    return (<Link to={`/${collection?.contractAddress}/${collection?.metaDataHash}/${collection?.creator}`} class="w-96 mx-auto h-64 m-8 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
        <div className="relative h-64">
            <img class=" absolute top-0 left-0 object-center object-cover h-64 w-full" src={currentMetaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${currentMetaData?.image}` : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80" || metaData?.image?.length > 0 ? `https://ipfs.infura.io/ipfs/${metaData?.image}` : metaData?.file instanceof File ? URL.createObjectURL(metaData?.file) : "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"} alt="photo" />
            <div className="absolute w-full h-full top-0 left-0 rounded-lg bg-black opacity-40"></div>
            <div className="absolute flex items-center justify-between flex-col w-full h-full top-0 left-0 py-6 px-4 rounded-lg">
                <div className="flex flex-col items-center">

                    <p class="text-2xl text-white font-bold mb-2">{currentMetaData?.title || metaData?.title}</p>
                    <p class="text-md text-gray-200 font-normal">{currentMetaData?.subtitle || metaData?.subtitle}</p>
                </div>
            </div >
        </div>
    </Link >);
}
export default CollectionCard