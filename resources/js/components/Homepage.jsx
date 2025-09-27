import React from 'react';

const Homepage = () => {
  return (
    <div className="homepage bg-gray-50 min-h-screen">
      <header className="bg-white shadow p-6 mb-8">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Welcome to EcoTourism!</h1>
        <p className="text-lg text-gray-600">Find and review the best destinations, hotels, restaurants, and experiences.</p>
      </header>
      <section className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
        <form className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search destinations, hotels, restaurants..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>
      </section>
      <section className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Top Destinations</h2>
          <ul className="list-disc ml-6 text-green-700">
            <li>Bangkok</li>
            <li>Phuket</li>
            <li>Chiang Mai</li>
          </ul>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">Popular Hotels</h2>
          <ul className="list-disc ml-6 text-blue-700">
            <li>Eco Resort</li>
            <li>Green Stay</li>
            <li>Adventure Lodge</li>
          </ul>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-yellow-800 mb-2">Top Experiences</h2>
          <ul className="list-disc ml-6 text-yellow-700">
            <li>Guided Tours</li>
            <li>Local Cuisine</li>
            <li>Nature Walks</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
