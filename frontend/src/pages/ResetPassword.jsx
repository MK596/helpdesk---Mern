import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setIsLoading(true);

        try {
            await axios.put(`/api/users/reset-password/${token}`, { password });
            toast.success('Password updated successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred');
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-5 mt-lg-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card p-4 p-md-5 border-0 shadow-sm">
                        <div className="text-center mb-5">
                            <div className="bg-success bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3 text-success">
                                <FaCheckCircle className="fs-3" />
                            </div>
                            <h2 className="fw-black">Reset Password</h2>
                            <p className="text-secondary">Set your new account credentials</p>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase tracking-wider">New Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><FaLock className="text-muted" /></span>
                                    <input
                                        type='password'
                                        className='form-control bg-light border-start-0 ps-0'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Min 6 characters'
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase tracking-wider">Confirm New Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><FaLock className="text-muted" /></span>
                                    <input
                                        type='password'
                                        className='form-control bg-light border-start-0 ps-0'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='••••••••'
                                        required
                                    />
                                </div>
                            </div>

                            <button className='btn btn-primary w-100 py-3 fw-bold shadow-sm' disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
