import React, { useState } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const API_URL = "https://e-commerce-backend-api-1c2f.onrender.com";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Failed to send message.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('Failed to send message.');
        }
    };

    return (
        <main className="flex-grow flex flex-col sm:flex-row items-center justify-center p-8 bg-gray-100">
            {/* Left side with a visual element */}
            <section className="sm:w-1/2 p-8 flex items-center justify-center text-center">
                <div className="relative p-6 rounded-2xl shadow-xl w-full max-w-md bg-white">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Get In Touch</h2>
                    <p className="text-gray-600 mb-6">We're here to help! Please fill out the form and we'll get back to you as soon as possible.</p>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-left">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.957l-7.5 4.33a2.25 2.25 0 0 1-2.16 0l-7.5-4.33A2.25 2.25 0 0 1 1.5 7.003V6.75" />
                            </svg>
                            <div>
                                <p className="text-gray-800 font-medium">Email</p>
                                <p className="text-sm text-gray-500">support@ecommerce.com</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-left">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v1.5m0-1.5a2.25 2.25 0 0 1 2.25-2.25h15a2.25 2.25 0 0 1 2.25 2.25v1.5m0-1.5a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0H21a2.25 2.25 0 0 0-2.25 2.25v13.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V10.5m19.5 0h-2.25" />
                            </svg>
                            <div>
                                <p className="text-gray-800 font-medium">Phone</p>
                                <p className="text-sm text-gray-500">(123) 456-7890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Right side with a form */}
            <section className="sm:w-1/2 p-8">
                <div className="relative p-6 rounded-2xl shadow-xl w-full max-w-md bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                rows="4"
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                Send Message
                            </button>
                        </div>
                        {status && <p className="mt-2 text-sm text-center">{status}</p>}
                    </form>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;
