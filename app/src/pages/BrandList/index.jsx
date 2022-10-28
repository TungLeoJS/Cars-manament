import React, { useState, useEffect, useCallback, useRef } from 'react';
import { publicRequest } from 'src/api/publicRequest';
import Backdrop from 'components/Backdrop/Backdrop';
import debounce from 'lodash/debounce';
import Modal from 'components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import noLogo from 'src/assets/images/brandLogos/no-logo.png';
import LoadingSpinner from 'components/LoadingSpinner';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from 'src/firebase';
import { uuidv4 } from '@firebase/util';

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
  const observerItem = useRef(null);
  const observerImage = useRef(null);

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
        const { list, isNextPageExist, lastIndexId } = data;

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
      observerItem.current = null;
      observerImage.current = null;
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

  const uploadFile = async (file, imageUrl, id) => {
    try {
      if (!file) {
        return;
      }
      const storage = getStorage(app);
      const imageId = id || uuidv4();
      const imageStorageRef = imageUrl
        ? ref(storage, imageUrl)
        : ref(storage, imageId);
      const downloadImageRef = ref(storage, imageStorageRef);
      const uploadTask = await uploadBytes(imageStorageRef, file);
      const downloadUrl = await getDownloadURL(downloadImageRef, (url) => {
        return url;
      });

      if (uploadTask && downloadUrl) {
        return downloadUrl;
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteFile = (imageUrl) => {
    try {
      if (!imageUrl) {
        return;
      }

      const storage = getStorage(app);
      const imageStorageRef = ref(storage, imageUrl);
      deleteObject(imageStorageRef);
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (file) => {
    try {
      setIsLoading(true);
      const { name, isActive, desc, logo, _id } = brandDetails;
      const brandData = {
        logo,
        name,
        isActive,
        desc,
      };
      let list = [...brandList];
      if (isEdit) {
        const idx = list.findIndex((item) => item._id === _id);
        const downloadUrl = await uploadFile(
          file,
          list[idx].logo,
          list[idx]._id
        );
        const result = await publicRequest.put(`/brand/${brandDetails._id}`, {
          ...brandData,
          logo: downloadUrl,
        });
        if (result.status === 200) {
          const { data } = result;

          if (idx !== -1) {
            list[idx] = data;
          }
        }
      } else if (isDelete) {
        const result = await publicRequest.delete(`/brand/${brandDetails._id}`);
        if (result.status === 200) {
          deleteFile(brandDetails?.logo);
          const newList = list.filter((item) => item._id !== brandDetails._id);
          list = [...newList];
        }
      } else {
        const downloadUrl = await uploadFile(file);
        const result = await publicRequest.post('/brand', {
          ...brandData,
          logo: downloadUrl,
        });
        if (result.status === 201) {
          const { data } = result;
          list.push(data);
        }
      }

      setBrandList(list);
      setBrandDetails(null);
      setIsModalOpen(false);
      setIsEdit(false);
      setIsDelete(false);
      setIsLoading(false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadMore = async (entries) => {
    if (isFetchMore) {
      return;
    }

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
  };

  const observerEvent = (node, callback, observe, threshold) => {
    if (observe.current && node?.tagName !== 'IMG') {
      observe.current.disconnect();
    }

    observe.current = new IntersectionObserver(
      async (entries) => callback(entries),
      threshold
    );

    if (node) {
      observe.current.observe(node);
    }
  };

  const lazyLoadImage = (entries) => {
    const element = entries[0];

    if (element.isIntersecting && element.target.dataset.src) {
      element.target.src = element.target.dataset.src;
      element.target.removeAttribute('data-src');
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
                className='brand-list__main__item'
                key={item._id}
                ref={
                  brandList.length - 1 === index
                    ? (e) =>
                        observerEvent(e, onLoadMore, observerItem, {
                          rootMargin: '0px 0px -160px 0px',
                        })
                    : null
                }
              >
                <div className='item-select'>
                  <input type='radio' />
                  <div className='item__logo'>
                    <img
                      ref={(e) =>
                        observerEvent(e, lazyLoadImage, observerImage, {
                          rootMargin: '0px 0px 160px 0px',
                        })
                      }
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
                      <span>{item.model?.length || 0} Models</span>
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
      />
    </>
  );
};

export default BrandList;
