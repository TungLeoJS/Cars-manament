import Header from 'components/Header/Header';
import Sidebar from 'components/Sidebar/Sidebar';
import React from 'react';

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
