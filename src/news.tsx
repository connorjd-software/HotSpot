import React from "react";

interface NewsAppProps {
  articles: any[];
}

const NewsApp: React.FC<NewsAppProps> = ({ articles }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">City News Search</h1>
      {articles.length > 0 ? (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">
            Top News:
          </h2>
          <ul className="space-y-4" style={{justifyItems:'center', textAlign:'center'}}>
            {articles.map((article, index) => (
              <li
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col"
              >
                <div style={{backgroundColor:'lightgray', height:'2px', width:'100%', marginTop:'10px', marginBottom:'10px'}}></div>
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
      ) : (
        <p>No news articles found.</p>
      )}
    </div>
  );
};

const NewsTitles: React.FC<NewsAppProps> =  ({ articles }) => {
  return (
<div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">City News Search</h1>
      {articles.length > 0 ? (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">
            Top News:
          </h2>
          <ul className="space-y-4">
            {articles.map((article, index) => (
              <li
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col"
              >
                <div style={{backgroundColor:'lightgray', height:'2px', width:'90%', marginTop:'10px', marginBottom:'10px'}}></div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-blue-600 hover:underline"
                >
                  {article.title}
                </a>
                
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No news articles found.</p>
      )}
    </div>
  )
}

export  {NewsApp, NewsTitles};
