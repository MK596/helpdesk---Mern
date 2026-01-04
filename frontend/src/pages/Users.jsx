import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { FaUserShield, FaUser } from 'react-icons/fa';

function Users() {
    const { user, isLoading } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
            toast.error('Access Denied');
        }

        const fetchUsers = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get('/api/users/users', config);
                setUsers(response.data);
                setIsFetching(false);
            } catch (error) {
                toast.error('Could not fetch users');
                setIsFetching(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchUsers();
        }
    }, [user, navigate]);

    if (isLoading || isFetching) {
        return <Spinner />;
    }

    return (
        <div className='py-8'>
            <BackButton url='/admin' />
            <h1 className="text-4xl font-black text-gray-900 mb-8 mt-4">System Users</h1>

            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold'>
                            <tr>
                                <th className='px-6 py-4'>Name</th>
                                <th className='px-6 py-4'>Email</th>
                                <th className='px-6 py-4'>Role</th>
                                <th className='px-6 py-4'>Joined</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {users.map(u => (
                                <tr key={u._id} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className={`p-2 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {u.role === 'admin' ? <FaUserShield /> : <FaUser />}
                                            </div>
                                            <span className='font-bold text-gray-900'>{u.name}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 text-gray-600'>{u.email}</td>
                                    <td className='px-6 py-4'>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-sm text-gray-500'>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Users;
