'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setTitle } from '../../store/slice/headerSlice';
import useCategory from '@/app/api/category/useCategory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faEye,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import categoryApi from '@/app/api/category/categoryApi';
import CategoryModal from '@/app/component/CategoryModal';
import ConfirmDeleteModal from '@/app/component/ConfirmDeleteModal';
import ErrorDeleteModal from '@/app/component/ErrorDeleteModal';
import DetailModal from '@/app/component/DetailModal';
import useProducts from '@/app/api/product/useProduct';
import PopUpModal from '@/app/component/PopUpModal';

type Category = {
  id: number;
  name: string;
};

export default function Edit() {
  const dispatch = useAppDispatch();
  const { categories, mutate } = useCategory();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCategoryModalopen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPopUpModalOpen, setIsPopUpModalOpen] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState<Category | null>(null);
  const { products } = useProducts(
    categoryDetail ? { categoryId: categoryDetail.id } : {}
  );
  const [modalTitle, setModalTitle] = useState('');
  const [idToDelete, setIdToDelete] = useState(0);
  const [categoryToEdit, setCategoryToEdit] = useState({ id: 0, name: '' });

  const onDeleteCategory = (id: number) => {
    setIdToDelete(id);
    const category = categories?.find((category) => category.id === id);

    if (category?.totalRelatedProducts === 0) {
      setIsDeleteModalOpen(true);
      setIsPopUpModalOpen(false);
      setIdToDelete(id);
    } else {
      setIsSuccess(false);
      setPopupText('Kategori ini tidak dapat dihapus');
      setIsPopUpModalOpen(true);
      setIsDeleteModalOpen(false);
      setIdToDelete(0);
    }
  };

  const deleteCategory = async () => {
    try {
      await categoryApi.delete({ id: idToDelete });
      setIdToDelete(0);
      setIsDeleteModalOpen(false);
      mutate();
    } catch (e) {
      console.log('error when deleting category:', e);
    }
    setIsSuccess(true);
    setPopupText('Kategori berhasil diperbaharui');
    setIsPopUpModalOpen(true);
  };

  const handleSubmitModal = async (data: Category) => {
    try {
      if (data.id !== 0) {
        await categoryApi.update(data);
      } else {
        await categoryApi.create({ name: data.name });
      }

      mutate();
    } catch (e) {
      console.log('error when updating category:', e);
    }
    setIsSuccess(true);
    setPopupText('Kategori berhasil diperbaharui');
    setIsPopUpModalOpen(true);
    setIsCategoryModalOpen(false);
  };

  useEffect(() => {
    dispatch(setTitle('Kategori Menu'));
  }, []);

  return (
    <>
      <div className="p-2 flex flex-col items-end ">
        <button
          className="py-2 px-1  bg-green-500 hover:bg-green-600 rounded outline-none"
          onClick={() => {
            setIsCategoryModalOpen(true);
            setModalTitle('Tambah Kategori');
            setCategoryToEdit({ id: 0, name: '' });
          }}
        >
          Tambah Kategori
        </button>
        <table className="w-full border-separate mt-2 border-spacing-y-2">
          <thead>
            <tr className="bg-green-200 drop-shadow">
              <th>Id</th>
              <th>Nama Kategori</th>
              <th>Total Produk</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr
                key={category.id}
                className="w-full bg-white hover:bg-green-400 drop-shadow"
              >
                <td className="text-center">{category.id}</td>
                <td className="text-center">{category.name}</td>
                <td className="text-center">{category.totalRelatedProducts}</td>
                <td className="flex justify-center gap-1 items-center mt-0.5">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(true);
                      setCategoryDetail({
                        id: category.id,
                        name: category.name,
                      });
                    }}
                    className="px-2 py-1 my-1 bg-green-500 hover:bg-green-600 rounded outline-none"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => {
                      setIsCategoryModalOpen(true);
                      setModalTitle('Perbaharui Kategori');
                      setCategoryToEdit({
                        id: category.id,
                        name: category.name,
                      });
                    }}
                    className="px-2 py-1 my-1 bg-green-500 hover:bg-green-600 rounded outline-none"
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="px-2 py-1 my-1 bg-green-500 hover:bg-green-600 rounded outline-none"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories?.length === 0 && (
          <p className="w-full italic text-gray-400 text-center">
            Daftar kategori kosong
          </p>
        )}
      </div>

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Kategori"
      >
        <div className="w-80 h-auto p-4 mt-4 bg-white drop-shadow rounded">
          <div className="flex justify-between items-center">
            <p>Id </p>
            <p>{categoryDetail?.id}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Nama </p>
            <p>{categoryDetail?.name}</p>
          </div>
        </div>
        <table className="w-80 border-separate border-spacing-y-2 mt-2">
          <thead>
            <tr className="bg-green-200 drop-shadow">
              <th>Id</th>
              <th>Nama</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody
            className="overflow-y-auto text-center"
            style={{ scrollbarGutter: 'stable' }}
          >
            {products?.map((product) => (
              <tr
                key={product.id}
                className="bg-white hover:bg-green-400 hover:rounded drop-shadow"
              >
                <td className="p-2">{product.id}</td>
                <td className="p-2 text-center">{product.name}</td>
                <td className="p-2 text-center">Rp. {product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="w-full italic text-center text-gray-500">
          {products?.length === 0 ? 'Daftar produk kosong' : ''}
        </p>
      </DetailModal>

      <CategoryModal
        isOpen={isCategoryModalopen}
        title={modalTitle}
        onClose={() => {
          setIsCategoryModalOpen(false);
        }}
        onSubmit={handleSubmitModal}
        category={categoryToEdit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Hapus Kategori"
        subtitle="Apakah anda ingin menghapus kategori?"
        onClose={() => {
          setIsSuccess(true);
          setPopupText('Kategori berhasil dihapus');
          setIsPopUpModalOpen(true);
          setIsDeleteModalOpen(false);
        }}
        onSubmit={deleteCategory}
      />

      <PopUpModal
        isOpen={isPopUpModalOpen}
        onClose={() => setIsPopUpModalOpen(false)}
      >
        <p>
          {popupText}{' '}
          <FontAwesomeIcon icon={isSuccess ? faCircleCheck : faCircleXmark} />
        </p>
      </PopUpModal>
    </>
  );
}
