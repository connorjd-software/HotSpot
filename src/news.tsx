import React, { useState } from "react";
import axios from "axios";

const NewsApp = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("CA"); // Default state to "CA"
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = "02d69c3b-9e5e-4306-bf6b-4dc895d872fe"; // Replace with your actual API key

  const fetchNews = async (newCity, newState) => {
    if (!newCity.trim() || !newState.trim()) {
      setError("Please enter both city and state.");
      console.log("City or state is missing");
      return;
    }

    setError(null);
    setLoading(true);
    console.log(`Fetching news for city: ${newCity}, state: ${newState}`);

    const url = `https://api.goperigon.com/v1/all?&city=${encodeURIComponent(
      newCity
    )}&country=us&language=en&state=${encodeURIComponent(
      newState
    )}&from=2025-01-20&apiKey=${apiKey}`;

    try {
      const response = await axios.get(url);
      console.log("Fetched data:", response.data);

      if (response.data && response.data.articles && response.data.articles.length > 0) {
        setArticles(response.data.articles); // Set the fetched articles
      } else {
        setArticles([]);
        setError(`No news articles found for "${newCity}, ${newState}".`);
        console.log(`No news found for city: ${newCity}, state: ${newState}`);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
      console.log("Loading finished");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setArticles([]); // Clear previous articles
    console.log("Handling search for city and state:", city, state);
    fetchNews(city, state); // Fetch new articles based on the city and state
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">City News Search</h1>
      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city name..."
          className="border rounded-lg p-2 w-64 focus:outline-none"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter a state (e.g., CA)..."
          className="border rounded-lg p-2 w-32 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {articles.length > 0 && (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">
            Top News in {city.charAt(0).toUpperCase() + city.slice(1)}, {state.toUpperCase()}:
          </h2>
          <ul className="space-y-4">
            {articles.map((article, index) => (
              <li
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-blue-600 hover:underline"
                >
                  {article.title}
                </a>
                <p className="text-gray-700">{article.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Source: {article.source.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewsApp;
