import { useContext, useEffect, useState } from "react";
import Text from "../../Components/Inputs/Text";
import TextArea from "../../Components/Inputs/TextArea";
import { uploadFile } from "../../config/pinata";
import Web3Context, { Web3Provider } from "../../Context/Web3Context";
import { create } from 'ipfs-http-client'
import { pinFileToIPFS, pinJSONToIPFS, unPin } from "../../config/axios";
import { useHistory } from "react-router";
import CollectionCard from "./CollectionCard";
import { useAlert } from "tr-alerts";
const fs = require('fs');

const client = create('https://ipfs.infura.io:5001/api/v0')

const CreateCollection = () => {
    const showAlert = useAlert();
    const history = useHistory();
    const [cost, setCost] = useState()

    const { getCollectionCreationPrice, createCollection } = useContext(Web3Context);
    const [metaData, setMetaData] = useState({ name: "", symbol: "", title: "", description: "", image: "", file: "" });
    const handleInputChange = (field, value) => {
        const newMetaData = { ...metaData };
        newMetaData[field] = value;
        setMetaData(newMetaData);

    }
    useEffect(() => {
        const getF = async () => {
            setCost((await getCollectionCreationPrice()).toNumber());
        }
        getF();
    }, [])
    const createCollectionFromData = async () => {
        showAlert('Alert!', "Uploading File to IPFS.....", 'primary', 1000);

        const added = await pinFileToIPFS(metaData.file);
        showAlert('Alert!', "File Uploaded, uploading metadata....", 'primary', 1000);

        console.log(added);
        const { IpfsHash } = added.data;
        const newJson = {
            title: metaData.title,
            subtitle: metaData.subtitle,
            description: metaData.description,
            image: IpfsHash,
        }
        const finalHash = await pinJSONToIPFS({ ...metaData, image: IpfsHash });
        showAlert('Alert!', "Meta Data Uploaded! Please complete the transaction", 'primary', 3000);

        const txn = await createCollection(metaData.name, metaData.symbol, finalHash.data.IpfsHash, cost.toString());
        if (txn) {
            console.log(txn);
            history.push("/myCollections")

        }
        else {
            showAlert('Alert!', "Failure, reverting changed", 'danger', 3000);

            unPin(IpfsHash);
            unPin(finalHash.data.IpfsHash);
        }

        // const reader = new window.FileReader();
        // reader.readAsArrayBuffer(metaData.file);
        // reader.onloadend = async () => {
        //     console.log()
        //     const result = await uploadFile(reader.result);
        //     console.log(result);
        // }

    }
    return (<div>
        <div class="md:grid md:grid-cols-3 md:gap-6">
            <CollectionCard metaData={metaData} />

            <div class="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={e => e.preventDefault() && createCollectionFromData()}>
                    <div class="shadow sm:rounded-md sm:overflow-hidden">
                        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div class="flex">
                                <Text
                                    title="Name"
                                    value={metaData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                />
                                <Text
                                    title="Symbol"
                                    value={metaData.symbol}
                                    onChange={(e) => handleInputChange("symbol", e.target.value)}
                                />
                            </div>
                            <Text
                                title="Title"
                                value={metaData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                            />
                            <Text
                                title="Subtitle"
                                value={metaData.subtitle}
                                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                            />
                            <TextArea
                                title="Description"
                                value={metaData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                            <div class="w-full  px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Cover Photo
                                </label>
                                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div class="space-y-1 text-center">
                                        <input type="file" onChange={(e) => handleInputChange("file", e.target.files[0])} />
                                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <div class="flex text-sm text-gray-600">
                                            <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                                            </label>
                                            <p class="pl-1">or drag and drop</p>
                                        </div>
                                        <p class="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button onClick={createCollectionFromData} class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Save({cost})
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>);
}
export default CreateCollection