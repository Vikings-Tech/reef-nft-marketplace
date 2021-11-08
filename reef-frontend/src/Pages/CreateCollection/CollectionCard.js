import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJSONfromHash } from "../../config/axios";

const CollectionCard = ({ metaData, currentMetaData }) => {
    return (<div class="w-96 mx-auto h-64 m-8 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
        <div className="relative h-64">
            {metaData.file && <img class=" absolute top-0 left-0 object-center object-cover h-64 w-full" src={URL.createObjectURL(metaData.file)} alt="photo" />}
            <div className="absolute w-full h-full top-0 left-0 rounded-lg bg-black opacity-40"></div>
            <div className="absolute flex items-center justify-between flex-col w-full h-full top-0 left-0 py-6 px-4 rounded-lg">
                <div className="flex flex-col items-center">

                    <p class="text-2xl text-white font-bold mb-2">{currentMetaData?.title || metaData?.title}</p>
                    <p class="text-md text-gray-200 font-normal">{currentMetaData?.subtitle || metaData?.subtitle}</p>
                </div>
            </div >
        </div>
    </div >);
}
export default CollectionCard