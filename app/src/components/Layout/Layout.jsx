import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './styles.scss';

const Layout = ({ children }) => {
    return (
        <div className='layout'>
            <Sidebar />
            <div className='main'>
                <Header />
                {children}
            </div>
        </div>
    );
};

export default Layout;
