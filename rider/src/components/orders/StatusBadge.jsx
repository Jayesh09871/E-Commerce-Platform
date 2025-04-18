import React from 'react';
import { FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let icon = null;
  let label = status;

  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'Pending';
      break;
    case 'processing':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = 'Processing';
      break;
    case 'shipped':
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
      icon = <FaTruck className="mr-1" />;
      label = 'Shipped';
      break;
    case 'delivered':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <FaCheckCircle className="mr-1" />;
      label = 'Delivered';
      break;
    case 'undelivered':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <FaTimesCircle className="mr-1" />;
      label = 'Undelivered';
      break;
    case 'cancelled':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = 'Cancelled';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;
