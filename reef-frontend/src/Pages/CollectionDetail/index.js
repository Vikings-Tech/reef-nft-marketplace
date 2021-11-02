import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJSONfromHash } from '../../config/axios';
const CollectionDetail = () => {
    const { metaDataHash, contractAddress } = useParams();
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


}