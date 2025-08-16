import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';

// Import all your new components
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import HomePage from './HomePage.jsx';
import ContactPage from './ContactPage.jsx';

// A modal component for creating and updating products
const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000] animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative animate-slide-in-up">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

// Main App component
const App = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const API_URL = "https://e-commerce-backend-api-1c2f.onrender.com/api/products";
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (currentPage === 'products') {
            fetchProducts();
        }
    }, [currentPage]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data from the server. Check your network connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const url = editingProduct ? `${API_URL}/${editingProduct.id}` : API_URL;
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Failed to ${editingProduct ? 'update' : 'create'} product`);
            }
            fetchProducts();
            closeModal();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error saving product to the server.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product from the server.");
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('price', product.price);
        setValue('imageUrl', product.imageUrl || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        reset();
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <main className="flex-grow container mx-auto p-8">
                        <HomePage onNavigate={setCurrentPage} />
                    </main>
                );
            case 'products':
                return (
                    <main className="flex-grow container mx-auto p-8">
                        <section className="text-center mb-12">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Products</h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Explore our wide range of products, from electronics to fashion, all at your fingertips.
                            </p>
                        </section>
                        {isLoading && (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-b-indigo-500 border-gray-200"></div>
                            </div>
                        )}
                        {!isLoading && (
                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
                                            <img 
                                                src={product.imageUrl || `https://placehold.co/600x400/312e81/ffffff?text=${encodeURIComponent(product.name)}`}
                                                alt={product.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                                                <p className="text-gray-600 mb-4 h-12 overflow-hidden text-sm">{product.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(product)}
                                                            className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-full transition-colors"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="bg-red-500 text-white hover:bg-red-600 p-2 rounded-full transition-colors"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500">
                                        No products found. Add a new one!
                                    </div>
                                )}
                            </section>
                        )}
                    </main>
                );
            case 'contact':
                return (
                    <main className="flex-grow container mx-auto p-8">
                        <ContactPage />
                    </main>
                );
            default:
                return (
                    <main className="flex-grow container mx-auto p-8">
                        <HomePage onNavigate={setCurrentPage} />
                    </main>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900 flex flex-col">
            <Header onAddProduct={openCreateModal} onNavigate={setCurrentPage} showAddProductButton={currentPage === 'products'} />
            {renderPage()}
            <Footer />

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            id="name"
                            {...register('name', { required: 'Product name is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            {...register('description', { required: 'Description is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            rows="3"
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price', {
                                required: 'Price is required',
                                valueAsNumber: true,
                                min: { value: 0, message: 'Price must be a positive number' }
                            })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            id="imageUrl"
                            type="url"
                            {...register('imageUrl')}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button 
                            type="button" 
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            {editingProduct ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default App;
