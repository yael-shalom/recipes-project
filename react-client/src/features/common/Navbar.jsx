import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../users/userSlice';
import { Avatar } from '@mui/material';

const Navbar = () => {
	const currentUser = useSelector((state) => state.users.currentUser)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const checkTokenExpiration = () => {
		const tokenExpiration = JSON.parse(localStorage.getItem('currentUser'))?.tokenExpiration;
		if (tokenExpiration && new Date().getTime() > tokenExpiration) {
			dispatch(logout())
			alert("Session expired. Log in again if you want.");
		}
	};

	setInterval(checkTokenExpiration, 60000);

	return (
		<>
			<nav>
				<div className="nav nav-tabs" id="nav-tab" role="tablist">
					<Link className='nav-link' to="">דף הבית</Link>
					<Link className='nav-link' to="recipes">כל המתכונים</Link>
					{currentUser && <Link className='nav-link' to="add">הוספת מתכון</Link>}
					{currentUser && <Link className='nav-link' to={"recipes/owner/" + currentUser?._id}>המתכונים שלי</Link>}

					{currentUser ? (
						<Avatar title='התנתקות' onClick={() => dispatch(logout())} sx={{ backgroundColor: "var(--primary-color)" }}>
							{currentUser.username[0].toUpperCase()}
						</Avatar>) : (
						<Avatar title='התחברות' onClick={() => { navigate('/login') }} />)}
				</div>
			</nav>
		</>
	);
}

export default Navbar;