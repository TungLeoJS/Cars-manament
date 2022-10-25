import React, { useState, useEffect, useCallback, useRef } from 'react';
import { publicRequest } from 'api/publicRequest';
import Backdrop from '../../components/Backdrop/Backdrop';
import debounce from 'lodash.debounce';
import Modal from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import noLogo from 'assets/images/brandLogos/no-logo.png';
import LoadingSpinner from 'components/LoadingSpinner';

import './styles.scss';

const BrandList = () => {
  const [brandList, setBrandList] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [brandDetails, setBrandDetails] = useState(null);
  const [isNextPageExist, setIsNextPageExist] = useState(null);

  const [pageSettings, setPageSettings] = useState({
    lastIndexId: -1,
    limit: 5,
  });
  const [isFetchMore, setIsFetchMore] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const observe = useRef(null);

  const loadBrandList = async (params = {}) => {
    try {
      const start = performance.now();
      setIsLoading(true);
      const {
        filters = {
          searchText,
          ...pageSettings,
        },
        isLoadMore,
      } = params;

      const result = await publicRequest.get('/brand', {
        params: { ...filters },
      });
      if (result) {
        const { data } = result;
        const prevList = isLoadMore ? brandList : [];
        const { list, isNextPageExist } = data;
        const lastIndex = isNextPageExist
          ? list.length - 1
          : brandList.length - 1;
        const lastIndexId = isNextPageExist
          ? list[lastIndex]._id
          : brandList[lastIndex]._id;

        setBrandList([...prevList, ...list]);
        setPageSettings({
          ...pageSettings,
          lastIndexId,
        });
        setIsNextPageExist(isNextPageExist);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }

      const end = performance.now();
      console.log(`Call to fetchData take ${end - start} milliseconds`);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrandList();
    return () => {
      observe.current = null;
      inputRef.current = null;
    };
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

  const debouncedChangeHandler = useCallback(debounce(onChangeHandler, 300), [
    brandDetails,
  ]);

  const onSearchHandler = async (e) => {
    e.preventDefault();
    loadBrandList();
    setSearchText(null);
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
      let list = [...brandList];
      if (isEdit) {
        const result = await publicRequest.put(
          `/brand/${brandDetails._id}`,
          brandData
        );
        if (result.status === 200) {
          const { data } = result;
          const idx = list.findIndex((item) => item._id === data._id);
          if (idx !== -1) {
            list[idx] = data;
          }
        }
      } else if (isDelete) {
        const result = await publicRequest.delete(`/brand/${brandDetails._id}`);
        if (result.status === 200) {
          const newList = list.filter((item) => item._id !== brandDetails._id);
          list = [...newList];
        }
      } else {
        const result = await publicRequest.post('/brand', brandData);
        if (result.status === 201) {
          const { data } = result;
          list.push(data);
        }
      }

      setBrandList(list);
      setBrandDetails(null);
      setIsModalOpen(false);
      setIsEdit(false);
      setIsLoading(false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const lastIndexRef = (node) => {
    if (isFetchMore) {
      return;
    }

    if (observe.current) {
      observe.current.disconnect();
    }

    observe.current = new IntersectionObserver(
      async (entries) => {
        const observed = entries[0];

        const shouldLoadMore = observed.isIntersecting && isNextPageExist;

        if (shouldLoadMore) {
          setIsFetchMore(true);
          await loadBrandList({ isLoadMore: true });
          setTimeout(() => {
            setIsFetchMore(false);
          }, 1000);
        }
        return;
      },
      { rootMargin: '0px 0px -160px 0px' }
    );

    if (node) {
      observe.current.observe(node);
    }
  };

  const imagesObserveRef = (node) => {
    if (node) {
      const observed = new IntersectionObserver(
        (entries) => {
          const element = entries[0];

          if (element.isIntersecting) {
            element.target.src = element.target.dataset.src;
            element.target.removeAttribute('data-src');
          }
        },
        { rootMargin: '0px 0px 160px 0px' }
      );

      observed.observe(node);
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
            brandList.map((item, index) => (
              <div
                data-id={item._id}
                className='brand-list__main__item'
                key={item._id}
                ref={brandList.length - 1 === index ? lastIndexRef : null}
              >
                <div className='item-select'>
                  <input type='radio' />
                  <div className='item__logo'>
                    <img
                      ref={imagesObserveRef}
                      src={noLogo}
                      data-src={item.logo || noLogo}
                      alt='brand-logo'
                    />
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
        {isFetchMore && <LoadingSpinner />}
      </div>
      {isLoading && !isFetchMore && <Backdrop />}
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
