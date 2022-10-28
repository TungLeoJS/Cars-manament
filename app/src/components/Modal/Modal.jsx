/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import noLogo from 'src/assets/images/brandLogos/no-logo.png';

import './styles.scss';

const Modal = ({
  isModalOpen,
  onClose,
  onSubmit,
  debouncedChangeHandler,
  brandDetails,
  isEdit,
  isDelete,
}) => {
  const [file, setFile] = useState(null);

  const inputNameRef = useRef({ value: '' });
  const inputDescRef = useRef({ value: '' });
  const inputStatusRef = useRef({ value: '' });
  const logoRef = useRef({ value: '' });

  useEffect(() => {
    if (brandDetails) {
      if (
        inputNameRef.current &&
        inputDescRef.current &&
        inputStatusRef.current
      ) {
        inputNameRef.current.value = brandDetails.name || '';
        inputDescRef.current.value = brandDetails.desc || '';
        inputStatusRef.current.value = brandDetails.isActive || false;
      }
    }
  }, [brandDetails]);

  const onChangeLogoFile = async (e) => {
    setFile(e.target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      logoRef.current.src = fileReader.result;
    };
  };

  const renderDeleteModal = () => {
    return (
      <>
        <div className='modal-header'>
          <div className='modal-header__title'>Delete Car Brand</div>
          <div onClick={onClose} className='modal-header__close-button'>
            <i className='fa-solid fa-xmark'></i>
          </div>
        </div>
        <div className='modal-main'>
          <div className='modal-message'>
            Are you sure want to delete brand{' '}
            <span className='brand-name-text'>{brandDetails.name}</span>?
          </div>
          <div className='modal-actions'>
            <div
              onClick={onClose}
              className='modal-actions__cancel button button--secondary'
            >
              No
            </div>
            <div
              onClick={onSubmit}
              className='modal-confirm button button--primary'
            >
              Yes
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCreateEditModal = () => {
    return (
      <>
        <div className='modal-header'>
          <div className='modal-header__left'>
            <div className='modal-header__title'>
              {isEdit ? 'Update' : 'Add'} Car Brand
            </div>
            <div className='modal-header__subtitle'>
              {isEdit ? 'Update' : 'Setup new '} car brand
            </div>
          </div>
          <div onClick={onClose} className='modal-header__close-button'>
            <i className='fa-solid fa-xmark'></i>
          </div>
        </div>
        <div className='modal-main'>
          <div className='brand-logo'>
            <div className='brand-logo__title'>Brand Logo</div>
            <div className='brand-logo__images'>
              <img
                ref={logoRef}
                src={brandDetails?.logo || noLogo}
                alt='brand-logo'
              />
              <input
                id='logo'
                name='logo'
                className='inputFile'
                type='file'
                onChange={(e) => onChangeLogoFile(e)}
              />
              <label htmlFor='logo'>Upload file</label>
            </div>
          </div>
          <div className='brand-details__title'>Brand Details</div>
          <div className='brand-details__content'>
            <div className='brand-details__name-and-status'>
              <div className='brand-details__brand-name'>
                <div className='brand-name__label'>Brand Name</div>
                <input
                  ref={inputNameRef}
                  onChange={(e) => debouncedChangeHandler(e)}
                  name='name'
                  placeholder='Input Content'
                  type='text'
                  className='brand-name__input'
                />
              </div>
              <div className='brand-details__brand-status'>
                <div className='brand-name__label'>Brand Status</div>
                <select
                  ref={inputStatusRef}
                  onChange={debouncedChangeHandler}
                  name='isActive'
                >
                  <option value={false}>Inactive</option>
                  <option value={true}>Active</option>
                </select>
              </div>
            </div>
            <div className='brand-details-description'>
              <div className='brand-details__brand-description'>
                <div className='brand-description__label'>
                  Brand Description
                </div>
                <input
                  ref={inputDescRef}
                  onChange={debouncedChangeHandler}
                  name='desc'
                  placeholder='Input Content'
                  type='text'
                  className='brand-description__input'
                />
              </div>
            </div>
          </div>
          <div className='modal-actions'>
            <div
              onClick={onClose}
              className='modal-actions__cancel button button--secondary'
            >
              Cancel
            </div>
            <div
              onClick={() => onSubmit(file)}
              className='modal-actions__create button button--primary'
            >
              {isEdit ? 'Update Brand' : 'Create Brand'}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderModal = () => {
    return (
      <div className={`modal ${isDelete && 'modal--delete'}`}>
        <div className='modal-container'>
          {isDelete ? renderDeleteModal() : renderCreateEditModal()}
        </div>
      </div>
    );
  };

  return isModalOpen && renderModal();
};

export default Modal;
