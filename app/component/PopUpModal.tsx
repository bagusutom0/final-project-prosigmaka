'use client';

import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function PopUpModal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-start pt-16 z-50">
      <div className="modal-content bg-white rounded drop-shadow relative p-2">
        {children}
      </div>
    </div>
  );
}
