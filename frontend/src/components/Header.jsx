import { FaSignInAlt, FaSignOutAlt, FaUser, FaLock, FaLifeRing } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2 text-primary" to="/">
                    <FaLifeRing className="fs-4" />
                    <span>HELPDESK</span>
                </Link>

                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <li className="nav-item">
                                        <Link className="nav-link d-flex align-items-center gap-2 fw-semibold px-3" to="/admin">
                                            <FaLock /> Admin
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <Link className="nav-link d-flex align-items-center gap-2 fw-semibold px-3" to="/profile">
                                        <FaUser /> Profile
                                    </Link>
                                </li>
                                <li className="nav-item ms-lg-2">
                                    <button className="btn btn-outline-danger d-flex align-items-center gap-2 w-100 justify-content-center" onClick={onLogout}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link d-flex align-items-center gap-2 fw-semibold px-3" to="/login">
                                        <FaSignInAlt /> Login
                                    </Link>
                                </li>
                                <li className="nav-item ms-lg-2">
                                    <Link className="btn btn-primary d-flex align-items-center gap-2 w-100 justify-content-center shadow-sm" to="/register">
                                        <FaUser /> Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
