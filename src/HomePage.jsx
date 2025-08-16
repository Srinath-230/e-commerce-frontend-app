import React from 'react';

const HomePage = ({ onNavigate }) => {
    return (
        <main className="flex-grow flex items-center justify-center bg-gray-100">
            <section 
                className="relative w-full h-full text-center py-24 sm:py-32 lg:py-48 bg-cover bg-center"
                style={{backgroundImage: "url('https://media.istockphoto.com/id/941302930/vector/online-shopping-smartphone-turned-into-internet-shop-concept-of-mobile-marketing-and-e.jpg?s=612x612&w=0&k=20&c=oEaIaAVRL6w7juxEIVwFPISjW_XkoYbLmK_VRWjNaEk=')"}}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative container mx-auto px-4 z-10 text-white">
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 animate-fade-in-down">Discover Your Next Favorite Thing</h1>
                    <p className="text-lg sm:text-xl font-medium mb-8 max-w-2xl mx-auto animate-fade-in">
                        Explore our curated selection of high-quality products, from tech to fashion.
                    </p>
                    <div className="mt-8 animate-fade-in-up">
                        <button 
                            onClick={() => onNavigate('products')}
                            className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-lg"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
