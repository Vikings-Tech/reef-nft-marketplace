const CollectionCard = ({ metaData = {} }) => {
    return (<div class="w-96  bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
        <div>
            <img class="object-center object-cover h-64 w-full" src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80" alt="photo" />
        </div>
        <div class="h-32 text-center py-8 sm:py-6">
            <p class="text-xl text-gray-700 font-bold mb-2">{metaData.title}</p>
            <p class="text-base text-gray-400 font-normal">{metaData.subtitle}</p>
        </div>
    </div>);
}
export default CollectionCard