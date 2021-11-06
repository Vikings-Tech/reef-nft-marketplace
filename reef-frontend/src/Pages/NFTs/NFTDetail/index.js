import { useContext, useEffect, useState } from "react";
import CollectionCard from "../../../Components/CollectionCard";
import Text from "../../../Components/Inputs/Text";
import TextArea from "../../../Components/Inputs/TextArea";
import { uploadFile } from "../../../config/pinata";
import Web3Context, { Web3Provider } from "../../../Context/Web3Context";
import { create } from 'ipfs-http-client'
import { pinFileToIPFS, pinJSONToIPFS, unPin } from "../../../config/axios";
import { useParams } from "react-router";
import { useAlert } from 'tr-alerts';
import { TrashIcon } from "@heroicons/react/outline"

const REQUIRED_ATTR_LIST = ["title", "description", "royalty", "image"];
const NFTDetail = ({ contractAddress, tokenId, metaData, ownerAddress, isApproved }) => {
    const [newAttributeName, setNewAttributeName] = useState("")
    const showAlert = useAlert();
    const [price, setPrice] = useState(0);
    const [valid, setValid] = useState(true);

    const { mint, createMarketItem } = useContext(Web3Context);
    const handleSetListed = async () => {
        await createMarketItem(contractAddress, tokenId, price);
    }
    const handlePriceChange = ({ target }) => {
        let { value } = target;
        value = value.replace(/[^0-9]\.+/g, "");
        if (isNaN(parseFloat(value))) {
            setValid(false);
        }
        else if (parseFloat(value) < 0.00001) {
            value = "0.00001";
            showAlert('Alert!', "Value cannot be lesser than 0.00001", 'error', 1000);
        }
        setPrice(value);

    }



    return (<div>
        <div class="md:grid md:grid-cols-3 md:gap-6">
            <CollectionCard metaData={metaData} />
            <div className="flex items-center">
                <Text
                    onChange={handlePriceChange}
                    value={price}
                    title="Sale Price"
                />
                <button
                    onClick={handleSetListed}
                    disabled={!isApproved}
                    type="button"
                    className=" mt-3 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    {/* <PhoneIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                    <span>List on Marketplace</span>
                </button>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
                <form>
                    <div class="shadow sm:rounded-md sm:overflow-hidden">
                        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                            {Object.keys(metaData).map((attribute) => {
                                if (REQUIRED_ATTR_LIST.includes(attribute)) {
                                    return (<></>)
                                }
                                if (typeof metaData[attribute] === "string") {
                                    return (<div className="flex items-center">
                                        <Text
                                            title={attribute}
                                            value={metaData[attribute]} />

                                    </div>



                                    );

                                }
                            })}
                        </div>
                    </div>

                </form>
            </div>
        </div >
    </div >);

}
export default NFTDetail
