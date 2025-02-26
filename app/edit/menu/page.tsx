'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setTitle } from '../../store/slice/headerSlice';
import useProducts from '@/app/api/product/useProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faEye,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import productApi from '@/app/api/product/productApi';
import useTransaction from '@/app/api/transaction/useTransaction';
import ProductModal from '@/app/component/ProductModal';
import ConfirmDeleteModal from '@/app/component/ConfirmDeleteModal';
import ErrorDeleteModal from '@/app/component/ErrorDeleteModal';
import useCategory from '@/app/api/category/useCategory';
import DetailModal from '@/app/component/DetailModal';
import PopUpModal from '@/app/component/PopUpModal';

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
};

export default function Edit() {
  const dispatch = useAppDispatch();
  const { products, mutate } = useProducts({});
  const { categories } = useCategory();
  const [isSuccess, setIsSuccess] = useState(false);
  const listCategory = categories?.map((category) => category.name);
  const { transactions } = useTransaction();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [productDetail, setProductDetail] = useState<Product | null>(null);
  const [isProductModalopen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPopUpModalOpen, setIsPopUpModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [idToDelete, setIdToDelete] = useState(0);
  const [productToUpdate, setProductToUpdate] = useState<Product>({
    id: 0,
    name: '',
    image: '',
    price: 0,
    category: '',
  });

  const onDeleteProduct = (id: number) => {
    const existProductInTransaction = transactions?.find((transaction) =>
      transaction.transactionProducts.find(
        (transactionProduct) => transactionProduct.product.id === id
      )
    );

    if (existProductInTransaction) {
      setIsSuccess(false);
      setPopupText('Menu ini tidak dapat dihapus');
      setIsPopUpModalOpen(true);
      setIdToDelete(0);
    } else {
      setIsDeleteModalOpen(true);
      setIdToDelete(id);
    }
  };

  const deleteProduct = async () => {
    try {
      await productApi.delete({ id: idToDelete });
      setIdToDelete(0);
      setIsDeleteModalOpen(false);
      mutate();
    } catch (e) {
      console.log('error when deleting product:', e);
    }
    setIsSuccess(true);
    setPopupText('Menu ini berhasil dihapus');
    setIsPopUpModalOpen(true);
  };

  const handleSubmitModal = async (data: Product) => {
    const category = categories?.find(
      (category) => category.name === data.category
    );

    try {
      if (data.id !== 0) {
        await productApi.update({
          id: data.id,
          name: data.name,
          image: data.image,
          price: data.price,
          categoryId: category?.id,
        });
      } else {
        await productApi.create({
          name: data.name,
          image: data.image,
          price: data.price,
          categoryId: category?.id,
        });
      }

      mutate();
      setIsSuccess(true);
      setPopupText('Menu ini berhasil diperbaharui');
      setIsPopUpModalOpen(true);
    } catch (e) {
      console.log('error when updating product:', e);
    }
    setIsProductModalOpen(false);
  };

  useEffect(() => {
    dispatch(setTitle('Menu Dapur Emmak'));
  }, []);

  return (
    <div>
      <>
        <div className="p-2 flex flex-col items-end">
          <button
            className="py-2 px-1  bg-green-500 hover:bg-green-600 rounded outline-none"
            onClick={() => {
              setIsProductModalOpen(true);
              setModalTitle('Tambah Menu');
              setProductToUpdate({
                id: 0,
                name: '',
                image: '',
                price: 0,
                category: '',
              });
            }}
          >
            Tambah Menu
          </button>
          <table className="w-full mt-4">
            <thead className="block pl-2 me-4">
              <tr className="bg-green-200 drop-shadow grid grid-cols-5 md:text-xs lg:text-sm xl:text-base">
                <th>Id</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Kategori</th>
                <th>Action</th>
              </tr>
            </thead>
          </table>

          <div className="w-full mt-2">
            <table className="w-full">
              <tbody
                className={`grid overflow-y-auto md:max-h-[490px] lg:max-h-[485px] xl:max-h-[480px] 2xl:max-h-[565px] py-1 pl-2 border-collapse gap-y-2 ${
                  products?.length === 10
                    ? 'md:pr-2'
                    : products?.length === 11
                    ? '2xl:pr-2'
                    : 'pr-4'
                }`}
              >
                {products?.map((product) => (
                  <tr
                    key={product.id}
                    className="bg-white w-full hover:bg-green-400 drop-shadow rounded grid grid-cols-5 items-center text-center "
                  >
                    <td className="p-2 text-center">{product.id}</td>
                    <td className="p-2 text-center">{product.name}</td>
                    <td className="p-2 text-center">Rp. {product.price}</td>
                    <td className="p-2 text-center">{product.category.name}</td>
                    <td className="flex justify-center gap-1 items-center mt-0.5">
                      <button
                        onClick={() => {
                          setIsDetailModalOpen(true);
                          setProductDetail({
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            category: product.category.name,
                          });
                        }}
                        className="px-2 py-1 my-1 bg-green-500 hover:bg-green-600 rounded outline-none"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => {
                          setIsProductModalOpen(true);
                          setModalTitle('Perbaharui Produk');
                          setProductToUpdate({
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            category: product.category.name,
                          });
                        }}
                        className="px-2 py-1 my-1 bg-green-500 hover:bg-green-600 rounded outline-none"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="px-2 py-1 my-1 bg-green-500 hover:bg-green-600 rounded outline-none"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products?.length === 0 && (
            <p className="w-full italic text-gray-400 text-center">
              Daftar produk kosong
            </p>
          )}
        </div>

        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Detail Product"
        >
          <div className="w-80 h-auto p-4 mt-4 bg-white drop-shadow rounded">
            <div className="flex justify-between items-center">
              <p>Id </p>
              <p>{productDetail?.id}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Nama </p>
              <p>{productDetail?.name}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Harga </p>
              <p>Rp. {productDetail?.price}</p>
            </div>
          </div>
          <img
            className="mt-4 w-80 h-72 rounded"
            src={productDetail?.image}
            alt={productDetail?.name}
          />
        </DetailModal>

        <ProductModal
          isOpen={isProductModalopen}
          title={modalTitle}
          categories={listCategory}
          onClose={() => setIsProductModalOpen(false)}
          onSubmit={handleSubmitModal}
          product={productToUpdate}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Hapus Menu"
          subtitle="Apakah anda ingin menghapus menu?"
          onClose={() => {
            setIsSuccess(true);
            setPopupText('Kategori berhasil dihapus');
            setIsPopUpModalOpen(true);
            setIsDeleteModalOpen(false);
          }}
          onSubmit={deleteProduct}
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
    </div>
  );
}
