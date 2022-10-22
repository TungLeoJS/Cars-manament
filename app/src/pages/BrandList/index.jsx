import brandLogo from 'assets/images/brandLogos/toyota.png';
import { useState, useEffect, useCallback } from 'react';
import { publicRequest } from 'api/publicRequest';
import Backdrop from '../../components/Backdrop/Backdrop';
import debounce from 'lodash.debounce';
import { useRef } from 'react';
import Modal from '../../components/Modal/Modal';

import './styles.scss';

const BrandList = () => {
    const [brandList, setBrandList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (searchText) => {
        try {
            setIsLoading(true);
            const list = await publicRequest.get('/brand', {
                params: { name: searchText },
            });
            if (list) {
                const { data } = list;
                setBrandList(data);
                setSearchText('');
            }
        } catch (err) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const onChangeHandler = (e) => {
        if (e) {
            setSearchText(e.target.value);
        }
    };

    const debouncedChangeHandler = useCallback(
        debounce(onChangeHandler, 300),
        []
    );

    const onSearchHandler = async (e) => {
        e.preventDefault();
        fetchData(searchText);
        inputRef.current.value = '';
    };

    const onOpenModal = () => {
        setIsModalOpen(true);
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
    };

    const onCreateBrand = async (data) => {
        try {
            setIsLoading(true);
            const { name, status, desc, logo } = data;
            const brandData = {
                logo,
                name,
                isActive: status === 'true' ? true : false,
                desc,
            };
            await publicRequest.post('/brand', brandData);
            await fetchData();
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='brand-list'>
                <div className='brand-list__header'>
                    <div className='header__left'>
                        <div className='header__left__title'>
                            CAR BRANDS LIST
                        </div>
                        <form id='filter-form' className='header__left__filter'>
                            <i className='fa-solid fa-angle-down icon'></i>
                            <select form='filter-form'>
                                <option>View All</option>
                                <option>View All</option>
                                <option>View All</option>
                                <option>View All</option>
                            </select>
                        </form>
                        <form
                            onSubmit={onSearchHandler}
                            className='header__left__search-input'
                        >
                            <i className='fa-solid fa-magnifying-glass'></i>
                            <input
                                ref={inputRef}
                                onChange={debouncedChangeHandler}
                                placeholder='Search car brand'
                            ></input>
                        </form>
                    </div>
                    <button
                        onClick={onOpenModal}
                        className='brand-list__add button button--primary'
                    >
                        <i className='fa-solid fa-plus'></i>
                        Add Brand
                    </button>
                </div>
                <div className='brand-list__main'>
                    {brandList.length > 0 &&
                        brandList.map((item) => (
                            <div
                                className='brand-list__main__item'
                                key={item._id}
                            >
                                <div className='item-select'>
                                    <input type='radio' />
                                    <img src={brandLogo} alt='' />
                                </div>
                                <div className='item-details'>
                                    <div className='item-details__info'>
                                        <span className='item-details__info__brand-name'>
                                            {item.name}
                                        </span>
                                        <div className='item-details__info__description'>
                                            <span>{item.desc || '--'}</span>
                                            <span>
                                                {item.model?.length} Models
                                            </span>
                                        </div>
                                    </div>
                                    <div className='item-details__updated-time'>
                                        <div className='item-details__updated-time__text'>
                                            Last update
                                        </div>
                                        <div className='item-details__date-time'>
                                            {item.updatedAt
                                                ? formatDate(item.updatedAt)
                                                : '--'}
                                        </div>
                                    </div>
                                    <div
                                        className={`item-details__status item-details__status--${
                                            item.isActive
                                                ? 'active'
                                                : 'inactive'
                                        }`}
                                    >
                                        <span className='item-details__status-signal'></span>
                                        <span>
                                            {item.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className='item-view-details button button--secondary'>
                                    View Details
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {isLoading && <Backdrop />}
            <Modal
                isModalOpen={isModalOpen}
                onClose={onCloseModal}
                onCreateBrand={onCreateBrand}
            />
        </>
    );
};

export default BrandList;
