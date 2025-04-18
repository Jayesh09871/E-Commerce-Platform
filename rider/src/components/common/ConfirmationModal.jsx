import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  showNotes = false,
  notes = '',
  setNotes = () => {},
  notesPlaceholder = 'Add notes',
  notesRequired = false
}) => {
  const handleConfirm = () => {
    if (notesRequired && !notes.trim()) {
      // If notes are required but not provided, don't proceed
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-2 mr-3">
            <FaExclamationTriangle className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {showNotes && (
          <div className="mb-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={notesPlaceholder}
              className={`w-full border ${
                notesRequired && !notes.trim() ? 'border-red-500' : 'border-gray-300'
              } rounded-md p-2 focus:ring-primary-500 focus:border-primary-500`}
              rows="3"
            ></textarea>
            {notesRequired && !notes.trim() && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-md ${
              notesRequired && !notes.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
            disabled={notesRequired && !notes.trim()}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
