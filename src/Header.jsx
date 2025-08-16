import React from 'react';
import { PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const Header = ({ onAddProduct, onNavigate, showAddProductButton }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto p-4 flex justify-between items-center">
                <button onClick={() => onNavigate('home')} className="text-2xl font-bold text-indigo-600">eCommerce</button>
                <nav className="space-x-4 hidden md:block">
                    <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-indigo-600 transition-colors">Home</button>
                    <button onClick={() => onNavigate('products')} className="text-gray-600 hover:text-indigo-600 transition-colors">Products</button>
                    <button onClick={() => onNavigate('contact')} className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</button>
                </nav>
                <div className="flex items-center space-x-4">
                    {showAddProductButton ? (
                        <button 
                            onClick={onAddProduct}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-md flex items-center space-x-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Add Product</span>
                        </button>
                    ) : (
                        <div className="w-[140px] h-[40px]"></div>
                    )}
                    <button onClick={() => onNavigate('cart')} className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-full transition-colors shadow-md">
                        <ShoppingCartIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
