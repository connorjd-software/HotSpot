import React, { useState } from "react";

interface Article {
  title: string;
  description: string;
  link: string;
  source_id: string;
  source_priority: number;
}

const NewsApp: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = "pub_666022c2deee31c8dac631775cc9a9dd65dce"; // Replace with your actual API key

  const fetchNews = async (newCity: string): Promise<void> => {
    if (!newCity.trim()) {
      setError("Please enter a city name.");
      console.log("No city entered");
      return;
    }

    setError(null);
    setLoading(true);
    console.log(`Fetching news for city: ${newCity}`);

    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${encodeURIComponent(
      newCity
    )}&language=en`; // Filter for English news

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data); // Print the fetched data

      if (data.status === "success" && data.totalResults > 0) {
        // Sort articles by source priority (lower is more popular/reputable)
        const sortedArticles = data.results.sort(
          (a: Article, b: Article) => a.source_priority - b.source_priority
        );

        if (sortedArticles.length > 0) {
          setArticles(sortedArticles); // Set the fetched and sorted articles
          console.log("Sorted articles:", sortedArticles); // Print sorted articles
        } else {
          setArticles([]);
          setError(`No news articles found for "${newCity}".`);
          console.log(`No news found for city: ${newCity}`);
        }
      } else {
        setArticles([]);
        setError(`No news articles found for "${newCity}".`);
        console.log(`No news found for city: ${newCity}`);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching news:", err); // Log the error
    } finally {
      setLoading(false);
      console.log("Loading finished");
    }
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    setArticles([]); // Clear previous articles
    console.log("Handling search for city:", city);
    fetchNews(city); // Fetch new articles based on the city
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">City News Search</h1>
      <form onSubmit={handleSearch} className="mb-6 flex">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city name..."
          className="border rounded-l-lg p-2 w-64 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {articles.length > 0 && (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">
            Top News in {city.charAt(0).toUpperCase() + city.slice(1)}:
          </h2>
          <ul className="space-y-4">
            {articles.map((article, index) => (
              <li
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col"
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-blue-600 hover:underline"
                >
                  {article.title}
                </a>
                <p className="text-gray-700">{article.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Source: {article.source_id}
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
