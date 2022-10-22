import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

import './styles.scss';

const Modal = ({ isModalOpen, onClose, onCreateBrand }) => {
    const [brandData, setBrandData] = useState(null);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;

        setBrandData({ ...brandData, [name]: value });
    };

    const debouncedChangeHandler = useCallback(
        debounce(onChangeHandler, 300),
        []
    );

    const onCreate = () => {
        if (brandData) {
            onCreateBrand(brandData);
        }
        onClose();
    };

    return (
        isModalOpen && (
            <div className='modal'>
                <div className='modal-container'>
                    <div className='modal-header'>
                        <div className='modal-header__left'>
                            <div className='modal-header__title'>
                                Add Car Brand
                            </div>
                            <div className='modal-header__subtitle'>
                                Setup new car brand
                            </div>
                        </div>
                        <div
                            onClick={onClose}
                            className='modal-header__close-button'
                        >
                            <i class='fa-solid fa-xmark'></i>
                        </div>
                    </div>
                    <div className='modal-main'>
                        <div className='brand-logo'>
                            <div className='brand-logo__title'>Brand Logo</div>
                            <div className='brand-logo__add'>
                                <i class='fa-solid fa-plus'></i>
                                <span>Brand Logo</span>
                            </div>
                        </div>
                        <div className='brand-details__title'>
                            Brand Details
                        </div>
                        <div className='brand-details__content'>
                            <div className='brand-details__name-and-status'>
                                <div className='brand-details__brand-name'>
                                    <div className='brand-name__label'>
                                        Brand Name
                                    </div>
                                    <input
                                        onChange={debouncedChangeHandler}
                                        name='name'
                                        placeholder='Input Content'
                                        type='text'
                                        className='brand-name__input'
                                    />
                                </div>
                                <div className='brand-details__brand-status'>
                                    <div className='brand-name__label'>
                                        Brand Status
                                    </div>
                                    <select
                                        onChange={debouncedChangeHandler}
                                        name='status'
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className='brand-details-description'>
                                <div className='brand-details__brand-description'>
                                    <div className='brand-description__label'>
                                        Brand Description
                                    </div>
                                    <input
                                        onChange={debouncedChangeHandler}
                                        name='desc'
                                        placeholder='Input Content'
                                        type='text'
                                        className='brand-description__input'
                                    />
                                </div>
                            </div>

                            <div className='brand-actions'>
                                <div
                                    onClick={onClose}
                                    className='brand-actions__cancel button button--secondary'
                                >
                                    Cancel
                                </div>
                                <div
                                    onClick={onCreate}
                                    className='brand-actions__create button button--primary'
                                >
                                    Create Brand
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Modal;
