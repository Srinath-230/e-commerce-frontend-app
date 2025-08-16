import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const CartPage = ({ cartItems, onDeleteItem, getProductDetails }) => {
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
                                    onClick={() => onDeleteItem(item.id)}
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

export default CartPage;
