import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BackButton = ({ url = '/' }) => {
    return (
        <Link to={url} className='btn btn-reverse btn-sm mb-4 inline-flex items-center gap-2'>
            <FaArrowCircleLeft /> Back
        </Link>
    );
};

export default BackButton;
