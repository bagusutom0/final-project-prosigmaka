'use client';

import { useEffect, useState } from 'react';
import ListOrder from '../component/ListOrder';
import ListProduct from '../component/ListProduct';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTitle } from '../store/slice/headerSlice';
import PopUpModal from '../component/PopUpModal';
import { setPayClicked } from '../store/slice/orderSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function Order() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { payClicked } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(setTitle('Dapur Emmak'));

    if (payClicked) {
      setIsModalOpen(true);
      dispatch(setPayClicked(false));
    }
  }, [payClicked]);

  return (
    <div className="flex flex-col w-full h-full">
      <main className="grid grid-cols-3 gap-2 p-2">
        <div className="col-span-2 h-full">
          <ListProduct />
        </div>
        <div className="h-full">
          <ListOrder />
        </div>
      </main>
      <PopUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>
          Pesanan Kosong <FontAwesomeIcon icon={faCircleXmark} />
        </p>
      </PopUpModal>
    </div>
  );
}
