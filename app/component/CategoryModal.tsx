'use client';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type Category = {
  id: number;
  name: string;
};

interface ModalProps {
  isOpen: boolean;
  title: string;
  category?: Category;
  onClose: () => void;
  onSubmit: (data: Category) => void;
}

export default function CategoryModal({
  isOpen,
  title,
  category = { id: 0, name: '' },
  onClose,
  onSubmit,
}: ModalProps) {
  const scheme = yup.object().shape({
    name: yup.string().required('Nama tidak boleh kosong'),
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
      reset({ name: category?.name || '' });
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-4 rounded shadow relative w-1/4 h-52">
        <p className="text-xl font-bold text-center">{title}</p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-0.5 hover:bg-green-600 bg-green-500 rounded"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <form
          onSubmit={handleSubmit((data) =>
            onSubmit({ id: category.id, ...data })
          )}
          className="flex flex-col items-center mt-4"
        >
          <div className="w-full flex flex-col">
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              id="name"
              placeholder="Nama Kategori"
              className="p-2 outline-none border border-green-500 rounded"
              {...register('name')}
            />
            <p className="text-red-500 italic text-sm">
              {errors.name?.message}
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
