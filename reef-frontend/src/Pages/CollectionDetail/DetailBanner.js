import { MailIcon, PhoneIcon } from "@heroicons/react/outline"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router";
import Text from "../../Components/Inputs/Text";
import Web3Context from "../../Context/Web3Context"
import { useAlert } from "tr-alerts";

export default function DetailBanner({ metaData, isApproved, setIsApproved }) {
    const showAlert = useAlert();

    const { setApprovalForAll, isApprovedForAll, createMarketItem } = useContext(Web3Context);
    const { metaDataHash, contractAddress, ownerAddress } = useParams();
    const onClickApproval = async () => {
        setIsApproved(await setApprovalForAll(true, contractAddress));
    }

    return (
        <div className=" mt-12 h-96 max-w-5xl mx-auto rounded-lg shadow-md">
            <div className="relative">
                <img className="h-96 w-full object-cover rounded-lg " src={`https://ipfs.infura.io/ipfs/${metaData?.image}`} alt="" />
                <div className="absolute w-full h-full top-0 left-0 rounded-lg bg-black opacity-40"></div>
                <div className="absolute flex items-center justify-between flex-col w-full h-full top-0 left-0 py-6 px-4 rounded-lg">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-white truncate">{metaData.title}</h1>
                        <h1 className="text-xl mt-4 font-semibold text-white truncate">{metaData.subtitle}</h1>
                        <h1 className="text-lg mt-4 text-white truncate">{metaData.description}</h1>
                    </div>

                    <div className="mt-6 flex flex-col justify-stretch space-y-12 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={onClickApproval}
                            type="button"
                            className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            <MailIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                            <span>{isApproved ? "Authorized" : "Authorise"}</span>
                        </button>

                    </div>
                </div>
            </div>

        </div>
    )
}