import { useContext, useEffect, useState } from "react";
import CollectionCard from "../../../Components/CollectionCard";
import Text from "../../../Components/Inputs/Text";
import TextArea from "../../../Components/Inputs/TextArea";
import { uploadFile } from "../../../config/pinata";
import Web3Context, { Web3Provider } from "../../../Context/Web3Context";
import { create } from 'ipfs-http-client'
import { pinFileToIPFS, pinJSONToIPFS, unPin } from "../../../config/axios";
import { useHistory, useParams } from "react-router";
import { useAlert } from 'tr-alerts';
import { TrashIcon } from "@heroicons/react/outline"
import Select from "../../../Components/Inputs/Select";

const REQUIRED_ATTR_LIST = ["title", "description", "royalty", "image"];
const SALE_TYPE = ["Fixed Price", "Auction"];
const NFTDetail = ({ contractAddress, tokenId, metaData, ownerAddress, isApproved }) => {
    const [newAttributeName, setNewAttributeName] = useState("")
    const showAlert = useAlert();
    const history = useHistory();
    const [price, setPrice] = useState(0);
    const [valid, setValid] = useState(true);
    const [noDays, setNoDays] = useState(1);
    const [type, setType] = useState(SALE_TYPE[0]);

    const { mint, createMarketItem, createMarketAuction } = useContext(Web3Context);
    const handleSetListed = async () => {
        if (!isApproved) {
            showAlert('Alert!', "Approve the Collections first to make transactions", 'error', 2000);
            return;
        }
        if (type === SALE_TYPE[0]) {
            await createMarketItem(contractAddress, tokenId, price);
            history.push("/");
        }
        else if (type === SALE_TYPE[1]) {
            await createMarketAuction(contractAddress, tokenId, price, noDays);
            history.push("/");
        }
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
    const handleDayChange = ({ target }) => {
        let { value } = target;
        value = value.replace(/[^0-9]+/g, "");
        if (parseInt(value) < 0) {
            value = 1;
            showAlert('Alert!', "Days Should be greater than 0", 'error', 1000);
        }
        setNoDays(value);

    }
    const FixedPriceForm = () => {
        return (<>
            <Text
                onChange={handlePriceChange}
                value={price}
                title="Sale Price"
            />
        </>);
    }
    const AuctionForm = () => {
        return (<>
            <Text
                onChange={handlePriceChange}
                value={price}
                title="Initial Bid"
            />
            <Text
                onChange={handleDayChange}
                value={noDays}
                title="Number of Days" />
        </>)
    }



    return (<div>
        <div class="md:grid md:grid-cols-2 md:gap-6">
            <div>
                <CollectionCard metaData={metaData} />
                <div className="flex flex-col">
                    <Select label={"Sale Type"} values={SALE_TYPE} value={type} setValue={setType} />
                    {type === SALE_TYPE[0] ? <FixedPriceForm /> : <AuctionForm />}
                    <button
                        onClick={handleSetListed}
                        type="button"
                        className=" mt-3 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                        {/* <PhoneIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                        <span>List on Marketplace</span>
                    </button>
                </div>
            </div>
            <div class="mt-5 md:mt-0">
                <form>
                    <div class="shadow sm:rounded-md sm:overflow-hidden">
                        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                            {Object.keys(metaData).map((attribute) => {
                                console.log(attribute);

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
