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
import ExplorePageContext from "../../../Context/ExplorePageContext";
import { useHistory } from "react-router";
import { utils } from 'ethers';

const REQUIRED_ATTR_LIST = ["title", "description", "royalty"];
const BuyNFTPage = () => {
    const history = useHistory();
    const { selectedNFTtoBuy } = useContext(ExplorePageContext);
    const { buyNFT } = useContext(Web3Context);
    useEffect(() => {
        if (!selectedNFTtoBuy) {
            history.push("/explore");
        }
    }, [selectedNFTtoBuy]);
    const { metaData, tokenId, price, royalty, creator, nftContract, itemId } = selectedNFTtoBuy;
    const onClickBuyNFT = async () => {
        await buyNFT(nftContract, itemId, price);
    }


    return (<div>
        <div class="md:grid md:grid-cols-3 md:gap-6">
            <div>
                <CollectionCard metaData={metaData} />
                <div className="flex justify-around">
                    <div>
                        <div className="font-bold text-2xl my-4 text-gray-600">Price</div>
                        <div className="font-semibold text-xl">{utils.formatEther(price)} reef</div>
                    </div>
                    <div>
                        <div className="font-bold text-2xl my-4 text-gray-600">Royalty</div>
                        <div className="font-semibold text-xl">{utils.formatEther(royalty)} reef</div>

                    </div>
                </div>
                <button
                    onClick={() => { onClickBuyNFT() }}
                    class="block w-48 truncate text-md mx-auto px-4 py-2 rounded text-white  font-bold hover:text-white mt-4 hover:bg-red-800 bg-primary lg:mt-0">Buy NFT</button>



            </div>

            <div class="mt-5 md:mt-0 md:col-span-2">
                <form>
                    <div class="shadow sm:rounded-md sm:overflow-hidden">
                        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                            {Object.keys(metaData).map((attribute) => {
                                if (typeof metaData[attribute] === "string") {
                                    return (<div className="flex items-center">
                                        <Text
                                            title={attribute}
                                            value={metaData[attribute]}
                                            disabled
                                        />
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
export default BuyNFTPage
