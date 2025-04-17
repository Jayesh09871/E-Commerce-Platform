import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllRiders } from '../store/slices/riderSlice';
import { FaSearch, FaMotorcycle } from 'react-icons/fa';

const RidersPage = () => {
  const dispatch = useDispatch();
  const { riders, loading } = useSelector((state) => state.riders);
  
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(getAllRiders());
  }, [dispatch]);
  
  useEffect(() => {
    if (riders.length > 0) {
      let filtered = [...riders];
      
      // Apply search filter
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          rider => 
            rider.name.toLowerCase().includes(term) ||
            rider.email.toLowerCase().includes(term) ||
            (rider.phone && rider.phone.includes(term))
        );
      }
      
      setFilteredRiders(filtered);
    }
  }, [riders, searchTerm]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Riders</h1>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Riders Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-4">Loading riders...</div>
        ) : filteredRiders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRiders.map((rider) => (
              <div key={rider._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <FaMotorcycle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{rider.name}</h3>
                      <p className="text-sm text-gray-500">{rider.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Status:</span>{' '}
                          <span className="text-green-600">Active</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Assigned Orders:</span>{' '}
                          {rider.assignedOrders?.length || 0}
                        </p>
                      </div>
                      <Link
                        to={`/riders/${rider._id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No riders found matching your search
          </div>
        )}
      </div>
    </div>
  );
};

export default RidersPage;
