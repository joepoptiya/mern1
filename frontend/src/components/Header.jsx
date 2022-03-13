import { FaFlipboard, FaSignInAlt, FaSignOutAlt, FaHome, FaUser} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className='header'>
        <div className="logo">
            <Link to="/"><FaHome /> Run Book</Link>
        </div>
        <ul>
            {/* <li><Link to="/dashboard"><FaFlipboard /> Dashboard</Link></li> */}
            <li><Link to="/"><FaSignInAlt /> Dashboard</Link></li>
            <li><Link to="/login"><FaSignInAlt /> Login</Link></li>
            <li><Link to="/register"><FaUser /> Register</Link></li>
        </ul>

    </header>
  )
}

export default Header