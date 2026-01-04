import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Spinner from './Spinner';

const PrivateRoute = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) return <Spinner />;

    return user ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
