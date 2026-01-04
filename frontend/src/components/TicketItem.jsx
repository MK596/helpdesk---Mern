import { Link } from 'react-router-dom';
import { FaChevronRight, FaRegCalendarAlt, FaHashtag } from 'react-icons/fa';

function TicketItem({ ticket }) {
    const statusClass = {
        'Open': 'bg-primary',
        'In Progress': 'bg-warning text-dark',
        'Resolved': 'bg-success',
        'Closed': 'bg-danger'
    }[ticket.status] || 'bg-secondary';

    return (
        <Link to={`/ticket/${ticket._id}`} className="text-decoration-none group">
            <div className="card p-2 px-3 border-0 shadow-sm hover-translate mb-1">
                <div className="row align-items-center g-2">
                    <div className="col-8">
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <span className={`status-badge text-white ${statusClass}`} style={{ fontSize: '8px' }}>{ticket.status}</span>
                            <span className="small text-muted" style={{ fontSize: '10px' }}>
                                <FaHashtag size={8} /> {ticket._id.slice(-6).toUpperCase()}
                            </span>
                        </div>
                        <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '300px' }}>{ticket.title}</h6>
                    </div>

                    <div className="col-4">
                        <div className="d-flex align-items-center justify-content-end gap-3">
                            <div className="text-end d-none d-md-block">
                                <span className={`fw-bold small ${ticket.priority === 'High' ? 'text-danger' : ticket.priority === 'Medium' ? 'text-warning' : 'text-success'}`} style={{ fontSize: '10px' }}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <FaChevronRight className="text-muted opacity-25 group-hover-translate" size={12} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default TicketItem;
