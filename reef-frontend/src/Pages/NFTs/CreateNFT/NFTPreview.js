const NFTPreview = (props) => {
    const { file, title = "", description = "" } = props

    return (<div class="mx-auto w-96 h-64 m-8 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
        <div className="relative h-64">
            <img class=" absolute top-0 left-0 object-center object-cover h-64 w-full" src={file && URL.createObjectURL(file)} alt="photo" />
            <div className="absolute w-full h-full top-0 left-0 rounded-lg bg-black opacity-40"></div>
            <div className="absolute flex items-center justify-between flex-col w-full h-full top-0 left-0 py-6 px-4 rounded-lg">
                <div className="flex flex-col items-center">

                    <p class="text-2xl text-white font-bold text-center mb-2">{title}</p>
                    <p class="text-md text-gray-200 text-center font-normal">{description}</p>
                </div>
            </div >
        </div>
    </div >);
}
export default NFTPreview