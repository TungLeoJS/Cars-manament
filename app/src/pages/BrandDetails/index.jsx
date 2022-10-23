import { useEffect } from 'react';
import { publicRequest } from 'api/publicRequest';
import { useParams, useNavigate } from 'react-router-dom';
import Backdrop from 'components/Backdrop/Backdrop';
import { useState } from 'react';
import noLogo from 'assets/images/brandLogos/no-logo.png'

import './style.scss';

const BrandDetails = () => {
    const [details, setDetails] = useState({
        logo: '',
        desc: '',
        name: '',
        isActive: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const { id } = params;
        getBrandDetails(id);
    }, []);

    const getBrandDetails = async (id) => {
        // const params = useParams();
        try {
            setIsLoading(true);
            const result = await publicRequest.get(`/brand/${id}`);
            if (result) {
                const { data } = result;
                setDetails(data);
            }
        } catch (err) {
            navigate('/brand');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='brand-details'>
            <div className='brand-details__header'>
                <i
                    className='fa-solid fa-angle-left'
                    onClick={() => navigate('/brand')}
                ></i>
                <div className='brand-details__breadcrumbs bold'>
                    Brand Details
                </div>
            </div>
            <div className='brand-details__main'>
                <div className='brand-details__logo'>
                    <div className='logo__title bold'>Brand Logo</div>
                    <div className='logo__image'>
                        <img src={details.logo || noLogo} alt='brand-logo' />
                    </div>
                </div>
                <div className='brand-details__info'>
                    <div className='info__title bold'>Brand Details</div>
                    <div className='info__name-and-status'>
                        <div className='info__name'>
                            <div className='name__title'>Brand Name</div>
                            <div className='name__text bold'>
                                {details.name || ''}
                            </div>
                        </div>
                        <div className='info__status'>
                            <div className='status__title'>Brand Status</div>
                            <div className={`status__text status__text--${details.isActive ? 'active' : 'inactive'}`}>
                                <input type='radio' defaultChecked />
                                <span>
                                    {details.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='info__desc'>
                        <div className='desc__title'>Brand Description</div>
                        <div className='desc__text bold'>
                            {details.desc || ''}
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Backdrop />}
        </div>
    );
};

export default BrandDetails;
