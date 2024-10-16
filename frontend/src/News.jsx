import React, { useState, useEffect } from "react";
import axios from "axios";

const News = () => {
  const [headlines, setHeadlines] = useState([]); // Store all the headlines fetched from the API
  const [visibleHeadlines, setVisibleHeadlines] = useState(6); // Initially show 6 headlines
  const [error, setError] = useState(""); // Store error messages if API call fails

  // Fetch news headlines from the API
  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news"); // Call the backend route that fetches news from the News API
        setHeadlines(response.data); // Store the fetched headlines
      } catch (error) {
        setError("Failed to load news"); // Set error message if the API request fails
      }
    };

    fetchHeadlines();
  }, []);

  // Load more headlines when the "More Headlines" button is clicked
  const loadMoreHeadlines = () => {
    setVisibleHeadlines((prevVisible) => prevVisible + 6); // Add 6 more headlines to the displayed list
  };

  console.log(headlines);
  return (
    <div className="news-container">
      <h2>Latest News Headlines</h2>
      {error && <p>{error}</p>} {/* Show error message if fetching fails */}
      <ul className="news-list">
        {/* Show only the visible headlines */}
        {headlines.slice(0, visibleHeadlines).map((headline, index) => (
          <li key={index} className="news-item">
            <a href={headline.url} target="_blank" rel="noopener noreferrer">
              <h3>{headline.title}</h3>
            </a>
            <p>Source: {headline.source}</p>
            <p>Date: {new Date(headline.publishedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
      {/* Display the "More Headlines" button only if there are more headlines to show */}
      {visibleHeadlines < headlines.length && (
        <button className="load-more-btn" onClick={loadMoreHeadlines}>
          More Headlines
        </button>
      )}
    </div>
  );
};

export default News;
