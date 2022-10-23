import React, { useState, useEffect, useCallback, useRef } from 'react';
import { publicRequest } from 'api/publicRequest';
import Backdrop from '../../components/Backdrop/Backdrop';
import debounce from 'lodash.debounce';
import Modal from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import noLogo from 'assets/images/brandLogos/no-logo.png';

import './styles.scss';

const BrandList = () => {
  const [brandList, setBrandList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [brandDetails, setBrandDetails] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

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
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (e.target.name === 'search') {
      setSearchText(value);
    }
    setBrandDetails({ ...brandDetails, [name]: value });
  };

  const onChangeLogo = (downloadUrl) => {
    const { name, value } = downloadUrl;
    setBrandDetails({ ...brandDetails, [name]: value });
  };

  const debouncedChangeHandler = useCallback(
    () => debounce(onChangeHandler, 300),
    [brandDetails]
  );

  const onSearchHandler = async (e) => {
    e.preventDefault();
    fetchData(searchText);
    inputRef.current.value = '';
  };

  const onCloseModal = () => {
    setBrandDetails(null);
    setIsModalOpen(false);
    setIsEdit(false);
    setIsDelete(false);
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const { name, isActive, desc, logo } = brandDetails;
      const brandData = {
        logo,
        name,
        isActive,
        desc,
      };
      if (isEdit) {
        await publicRequest.put(`/brand/${brandDetails._id}`, brandData);
      } else if (isDelete) {
        await publicRequest.delete(`/brand/${brandDetails._id}`);
      } else {
        await publicRequest.post('/brand', brandData);
      }
      await fetchData();

      setBrandDetails(null);
      setIsModalOpen(false);
      setIsEdit(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const onOpenModal = (id, type) => {
    const brandDetails = brandList.find((item) => item._id === id);

    if (brandDetails) {
      setBrandDetails(brandDetails);
      setIsModalOpen(true);
      type === 'edit' ? setIsEdit(true) : setIsDelete(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const goToDetails = (id) => {
    if (id) {
      navigate(`/brand/${id}`);
    }
  };

  return (
    <>
      <div className='brand-list'>
        <div className='brand-list__header'>
          <div className='header__left'>
            <div className='header__left__title'>CAR BRANDS LIST</div>
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
                name='search'
                ref={inputRef}
                onChange={debouncedChangeHandler}
                placeholder='Search car brand'
              ></input>
            </form>
          </div>
          <button
            onClick={() => onOpenModal()}
            className='brand-list__add button button--primary'
          >
            <i className='fa-solid fa-plus'></i>
            Add Brand
          </button>
        </div>
        <div className='brand-list__main'>
          {brandList.length > 0 &&
            brandList.map((item) => (
              <div className='brand-list__main__item' key={item._id}>
                <div className='item-select'>
                  <input type='radio' />
                  <div className='item__logo'>
                    <img src={item.logo || noLogo} alt='brand-logo' />
                  </div>
                </div>
                <div className='item-details'>
                  <div className='item-details__info'>
                    <span className='item-details__info__brand-name'>
                      {item.name}
                    </span>
                    <div className='item-details__info__description'>
                      <span>{item.desc || '--'}</span>
                      <span>{item.model?.length} Models</span>
                    </div>
                  </div>
                  <div className='item-details__updated-time'>
                    <div className='item-details__updated-time__text'>
                      Last update
                    </div>
                    <div className='item-details__date-time'>
                      {item.updatedAt ? formatDate(item.updatedAt) : '--'}
                    </div>
                  </div>
                  <div
                    className={`item-details__status item-details__status--${
                      item.isActive ? 'active' : 'inactive'
                    }`}
                  >
                    <span className='item-details__status-signal'></span>
                    <span>{item.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div
                  onClick={() => goToDetails(item._id)}
                  className='item-view-details button button--secondary'
                >
                  View Details
                </div>
                <div
                  onClick={() => onOpenModal(item._id, 'edit')}
                  className='item-edit button button--primary'
                >
                  Edit
                </div>
                <div
                  onClick={() => onOpenModal(item._id, 'delete')}
                  className='item-delete button button--delete'
                >
                  Delete
                </div>
              </div>
            ))}
        </div>
      </div>
      {isLoading && <Backdrop />}
      <Modal
        isModalOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        isEdit={isEdit}
        isDelete={isDelete}
        brandDetails={brandDetails}
        debouncedChangeHandler={debouncedChangeHandler}
        onChangeLogo={onChangeLogo}
      />
    </>
  );
};

export default BrandList;
