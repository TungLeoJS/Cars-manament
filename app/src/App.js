import {
    Routes,
    Route,
    BrowserRouter as Router,
    Outlet,
    Navigate,
} from 'react-router-dom';
import BrandList from './pages/BrandList';
import Layout from './components/Layout/Layout';
import BrandDetails from './pages/BrandDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    element={
                        <Layout>
                            <Outlet />
                        </Layout>
                    }
                >
                    <Route
                        exact
                        path='/'
                        element={<Navigate to='/brand' />}
                    ></Route>
                    <Route path='/brand' element={<BrandList />}></Route>
                    <Route path='/brand/:id' element={<BrandDetails />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
