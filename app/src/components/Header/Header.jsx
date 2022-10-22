import './styles.scss';

export const Header = () => {
    return (
        <div className='header'>
            <i className="fa-solid fa-circle-info item"></i>
            <i className="fa-regular fa-bell item"></i>
            <span className='avatar item'></span>
            <span className='username item'>Admin</span>
            <i className="fa-solid fa-angle-down item"></i>
        </div>
    )
};

export default Header;
