import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { FaPaperPlane, FaUser, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';

function NewTicket() {
    const { user } = useContext(AuthContext);
    const [name] = useState(user.name);
    const [email] = useState(user.email);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Low');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post(
                '/api/tickets',
                { title, description, priority },
                config
            );

            setIsLoading(false);
            toast.success('Ticket submitted');
            navigate('/tickets');
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Error occurred');
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="mb-3">
                        <BackButton url='/' />
                    </div>

                    <div className="text-center mb-4">
                        <h4 className="fw-bold mb-1">Create Support Request</h4>
                        <p className="small text-secondary">Briefly explain your issue for quick assistance.</p>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-header bg-light border-bottom p-3">
                            <div className="row g-2">
                                <div className="col-6">
                                    <div className="small fw-bold text-muted text-uppercase" style={{ fontSize: '9px' }}>Requester</div>
                                    <div className="small fw-bold d-flex align-items-center gap-1"><FaUser size={10} /> {name}</div>
                                </div>
                                <div className="col-6 text-end">
                                    <div className="small fw-bold text-muted text-uppercase" style={{ fontSize: '9px' }}>Email Handle</div>
                                    <div className="small fw-bold text-primary d-flex align-items-center gap-1 justify-content-end"><FaEnvelope size={10} /> {email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-3">
                            <form onSubmit={onSubmit}>
                                <div className="row g-3 mb-3">
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>Ticket Title</label>
                                        <input
                                            type='text'
                                            name='title'
                                            id='title'
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="form-control form-control-sm bg-light"
                                            placeholder='e.g., Cannot access billing panel'
                                            required
                                        />
                                    </div>

                                    <div className="col-12 text-center">
                                        <label className="form-label small fw-bold text-uppercase text-muted d-block" style={{ fontSize: '9px' }}>Priority Level</label>
                                        <div className="btn-group btn-group-sm w-100" role="group">
                                            {['Low', 'Medium', 'High'].map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    className={`btn btn-sm ${priority === p ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                    onClick={() => setPriority(p)}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>Description</label>
                                        <textarea
                                            name='description'
                                            id='description'
                                            rows='4'
                                            className='form-control form-control-sm bg-light'
                                            placeholder='Detailed explanation...'
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <button className='btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2'>
                                    <FaPaperPlane size={12} /> SUBMIT TICKET
                                </button>

                                <div className="mt-3 text-center">
                                    <p className="text-muted" style={{ fontSize: '10px' }}>
                                        <FaExclamationCircle className="me-1" />
                                        Expected response within 2-4 business hours.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewTicket;
