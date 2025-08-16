import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';

// Import all your new components
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import HomePage from './HomePage.jsx';
import ContactPage from './ContactPage.jsx';
import CartPage from './CartPage.jsx';

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

const ConfirmationModal = ({ message, onClose, isOpen }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000] animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center relative animate-slide-in-up">
                <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
                >
                    OK
                </button>
            </div>
        </div>,
        document.body
    );
};

// Main App component
const App = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [confirmation, setConfirmation] = useState({ message: '', isOpen: false });
    const API_URL = "https://e-commerce-backend-api-1c2f.onrender.com";
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (currentPage === 'products') {
            fetchProducts();
        } else if (currentPage === 'cart') {
            fetchCartItems();
        }
    }, [currentPage]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/products`);
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

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/cart`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            alert("Error fetching cart items from the server. Check your network connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const url = editingProduct ? `${API_URL}/api/products/${editingProduct.id}` : `${API_URL}/api/products`;
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
            const response = await fetch(`${API_URL}/api/products/${id}`, {
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

    const handleAddToCart = async (productId) => {
        const existingCartItem = cartItems.find(item => item.productId === productId);
        let newQuantity = 1;
        if (existingCartItem) {
            newQuantity = existingCartItem.quantity + 1;
        }

        try {
            const response = await fetch(`${API_URL}/api/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: productId, quantity: newQuantity })
            });
            if (!response.ok) throw new Error('Failed to add to cart');
            fetchCartItems();
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error adding item to cart.");
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

    const getProductDetails = (productId) => {
        return products.find(p => p.id === productId);
    };

    const renderCartPage = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-b-indigo-500 border-gray-200"></div>
                </div>
            );
        }

        return (
            <main className="flex-grow container mx-auto p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Your Cart</h1>
                {cartItems.length > 0 ? (
                    <div className="space-y-4">
                        {cartItems.map((item) => {
                            const product = getProductDetails(item.productId);
                            if (!product) return null;

                            return (
                                <div key={item.id} className="flex items-center bg-white p-4 rounded-2xl shadow-lg">
                                    <img 
                                        src={product.imageUrl || `https://placehold.co/100x100/312e81/ffffff?text=${encodeURIComponent(product.name)}`}
                                        alt={product.name}
                                        className="w-24 h-24 object-cover rounded-xl mr-4"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="text-2xl font-bold text-indigo-600">${(product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCartItem(item.id)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-lg h-40 flex items-center justify-center">
                        Your cart is empty.
                    </div>
                )}
            </main>
        );
    };

    const handleDeleteCartItem = async (itemId) => {
        try {
            const response = await fetch(`${API_URL}/api/cart/${itemId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete item from cart');
            fetchCartItems();
        } catch (error) {
            console.error("Error deleting from cart:", error);
            alert("Error deleting item from cart.");
        }
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
                                                src={product.imageUrl ? product.imageUrl : `https://placehold.co/600x400/312e81/ffffff?text=${encodeURIComponent(product.name)}`}
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
                                                        <button
                                                            onClick={() => handleAddToCart(product.id)}
                                                            className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors"
                                                            title="Add to Cart"
                                                        >
                                                            <ShoppingCartIcon className="h-5 w-5" />
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
                return <ContactPage />;
            case 'cart':
                return renderCartPage();
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
