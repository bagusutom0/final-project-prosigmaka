'use client';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useCategory from '../api/category/useCategory';

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
};

interface ModalProps {
  isOpen: boolean;
  title: string;
  categories: string[] | undefined;
  product?: Product;
  onClose: () => void;
  onSubmit: (data: Product) => Promise<void>;
}

export default function ProductModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  categories,
  product = {
    id: 0,
    name: '',
    image: '',
    price: 0,
    category: '',
  },
}: ModalProps) {
  const scheme = yup.object().shape({
    name: yup.string().required('Nama tidak boleh kosong'),
    image: yup.string().required('Gambar tidak boleh kosong'),
    price: yup.number().required('Harga tidak boleh kosong'),
    category: yup.string().required('Kategori tidak boleh kosong'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(scheme) });

  const handleClickOutside = (event: MouseEvent) => {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent && !modalContent.contains(event.target as Node)) onClose();
  };

  const handleEscapeClick = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeClick);
      reset({
        name: product?.name || '',
        image: product?.image || '',
        price: product?.price || 0,
        category: product?.category || '',
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-4 rounded shadow relative w-1/4 h-3/4">
        <p className="text-xl font-bold text-center">{title}</p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-0.5 hover:bg-green-600 bg-green-500 rounded"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <form
          onSubmit={handleSubmit((data) =>
            onSubmit({ id: product.id, ...data })
          )}
          className="flex flex-col items-center mt-4"
        >
          <div className="w-full flex flex-col">
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              id="name"
              placeholder="Nama Menu"
              className="p-2 outline-none border border-green-500 rounded"
              {...register('name')}
            />
            <p className="text-red-500 italic text-sm">
              {errors.name?.message}
            </p>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="image">Gambar</label>
            <input
              type="text"
              id="image"
              placeholder="Url Gambar"
              className="p-2 outline-none border border-green-500 rounded"
              {...register('image')}
            />
            <p className="text-red-500 italic text-sm">
              {errors.image?.message}
            </p>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="price">Harga</label>
            <input
              type="number"
              id="price"
              placeholder="Harga"
              onFocus={(e) => e.target.select()}
              className="p-2 outline-none border border-green-500 rounded"
              {...register('price')}
            />
            <p className="text-red-500 italic text-sm">
              {errors.price?.message}
            </p>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="category">Kategori</label>
            <select
              className="p-2 outline-none border border-green-500 rounded"
              id="category"
              {...register('category')}
            >
              <option value="">Pilih Kategori</option>
              {categories?.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <p className="text-red-500 italic text-sm">
              {errors.category?.message}
            </p>
          </div>
          <div className="absolute bottom-3 flex mt-6 w-full justify-between px-10 gap-8">
            <button
              className="w-1/2 py-2 bg-green-500 hover:bg-green-600 rounded"
              type="submit"
            >
              Simpan
            </button>
            <button
              className="w-1/2 py-2 bg-green-500 hover:bg-green-600 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
