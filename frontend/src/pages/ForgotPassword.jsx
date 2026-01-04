import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/api/users/forgot-password', { email });
            toast.success('Reset link "sent" to email');

            // For development purposes, show the token in a helpful way
            if (response.data.resetToken) {
                console.log('Reset Token (Dev):', response.data.resetToken);
                toast.info(`DEV MODE: Check console for reset link`);
            }
            setIsLoading(false);
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
                            <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3 text-primary">
                                <FaEnvelope className="fs-3" />
                            </div>
                            <h2 className="fw-black">Forgot Password</h2>
                            <p className="text-secondary">Enter your email to receive a reset token</p>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase tracking-wider">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-muted" /></span>
                                    <input
                                        type='email'
                                        className='form-control bg-light border-start-0 ps-0'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='name@company.com'
                                        required
                                    />
                                </div>
                            </div>

                            <button className='btn btn-primary w-100 py-3 fw-bold mb-4 shadow-sm' disabled={isLoading}>
                                {isLoading ? 'Requesting...' : 'Request Reset Token'}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="text-decoration-none small fw-bold d-flex align-items-center justify-content-center gap-2">
                                    <FaArrowLeft size={10} /> Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
