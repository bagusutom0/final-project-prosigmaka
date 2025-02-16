'use client';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  title,
  subtitle,
  onClose,
  onSubmit,
}: ModalProps) {
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-4 rounded shadow relative w-1/4 h-44">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-0.5 hover:bg-green-600 bg-green-500 rounded"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <p className="text-2xl mt-4 font-bold text-center">{title}</p>
        <p className="text-xl text-center">{subtitle}</p>
        <div className="flex mt-2 justify-between px-10 gap-8">
          <button
            className="w-1/2 py-2 bg-green-500 hover:bg-green-600 rounded"
            onClick={onSubmit}
          >
            Ya
          </button>
          <button
            className="w-1/2 py-2 bg-green-500 hover:bg-green-600 rounded"
            onClick={onClose}
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
}
