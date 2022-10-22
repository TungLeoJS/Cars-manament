import { Link } from 'react-router-dom';
import ucarLogo from 'assets/images/brandLogos/UCARS-logo.png'

import './styles.scss';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar__header'>
                <img src={ucarLogo} alt='' />
                <i className='fa-solid fa-bars icon'></i>
            </div>
            <div className='sidebar__container'>
                <Link to='brand' className='sidebar__item'>
                    <i className='fa-solid fa-car-side icon'></i>
                    <span>Car brands</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
