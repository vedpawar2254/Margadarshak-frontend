"use client";

import { useState, useRef } from 'react';
import { api } from '../../services/api';

const PartnerManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    description: '',
    order: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [partners, setPartners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch all partners
  const fetchPartners = async () => {
    try {
      const response = await api.get('/partners');
      if (response.success) {
        setPartners(response.data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      setMessage('Error fetching partners');
    }
  };

  // Load partners on component mount
  useState(() => {
    fetchPartners();
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('websiteUrl', formData.websiteUrl);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      if (editingId) {
        // Update existing partner
        response = await api.upload(`/partners/${editingId}`, formDataToSend);
      } else {
        // Create new partner
        response = await api.upload('/partners', formDataToSend);
      }

      if (response.success) {
        setMessage(editingId ? 'Partner updated successfully!' : 'Partner created successfully!');
        setFormData({
          name: '',
          websiteUrl: '',
          description: '',
          order: 0,
          isActive: true
        });
        setImageFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        fetchPartners(); // Refresh the list
      } else {
        setMessage(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      setMessage('Error saving partner: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit partner
  const handleEdit = (partner) => {
    setFormData({
      name: partner.name,
      websiteUrl: partner.websiteUrl || '',
      description: partner.description || '',
      order: partner.order || 0,
      isActive: partner.isActive
    });
    setEditingId(partner.id);
    setPreviewUrl(partner.imageUrl);
  };

  // Delete partner
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) {
      return;
    }

    try {
      const response = await api.delete(`/partners/${id}`);
      if (response.success) {
        setMessage('Partner deleted successfully!');
        fetchPartners(); // Refresh the list
      } else {
        setMessage(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      setMessage('Error deleting partner: ' + error.message);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setFormData({
      name: '',
      websiteUrl: '',
      description: '',
      order: 0,
      isActive: true
    });
    setImageFile(null);
    setPreviewUrl(null);
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Partner Management</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Partner Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Partner' : 'Add New Partner'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            
            {/* Right Column - Image Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo/Image
                </label>
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-32 max-w-full object-contain mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the partner company"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update Partner' : 'Add Partner'}
            </button>
          </div>
        </form>
      </div>

      {/* Partners List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Current Partners</h2>
        
        {partners.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No partners found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.imageUrl ? (
                        <img 
                          src={partner.imageUrl} 
                          alt={partner.name} 
                          className="h-12 w-16 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/100x50?text=${encodeURIComponent(partner.name.substring(0, 8))}`;
                          }}
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-12 flex items-center justify-center text-gray-500 text-xs">
                          {partner.name.substring(0, 3)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                      {partner.description && (
                        <div className="text-sm text-gray-500">{partner.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.websiteUrl ? (
                        <a 
                          href={partner.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          {partner.websiteUrl.replace('https://', '').replace('http://', '')}
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(partner)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(partner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerManagement;