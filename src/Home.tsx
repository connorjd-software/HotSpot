import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // Icons for light and dark mode
import "./Home.css";
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [displayText, setDisplayText] = useState(""); // Current text displayed
  const [isDeleting, setIsDeleting] = useState(false); // Whether we're deleting text
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the current string
  const strings = [
    "Learn About What Others Are/Were Up To...",
    "Check Out News That Were From A Long Time Ago In Another Place?",
    "Pin A Post At Your Next Travel Location To Ask For Other's Tips",
    "See A Dangerous Event, Alert Others!",

  ]; // Strings to type
  const typingSpeed = 75; // Speed of typing in ms
  const deletingSpeed = 50; // Speed of deleting in ms
  const pauseBetweenCycles = 1000; // Pause after typing or deleting a full string

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;

    const handleTyping = () => {
      const currentString = strings[currentIndex];
      if (isDeleting) {
        // Remove characters
        setDisplayText((prev) => prev.slice(0, prev.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % strings.length); // Move to the next string
        }
      } else {
        // Add characters
        setDisplayText((prev) => currentString.slice(0, prev.length + 1));
        if (displayText === currentString) {
          setTimeout(() => setIsDeleting(true), pauseBetweenCycles); // Pause before deleting
        }
      }
    };

    typingInterval = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(typingInterval); // Cleanup on unmount
  }, [displayText, isDeleting, currentIndex]);

  return (
    <div
      className={darkMode ? "homepage dark-mode" : "homepage light-mode"}
      style={{ height: "100vh" }}
    >
      <header className="header">
        <div className="logo">
          <h1>Website Name</h1> {/* Replace "Website Name" later */}
        </div>
        <button className="mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      <main className="main-content">
        <section className="welcome">
          <h2>Welcome to Our Community</h2>
          <p className="typewriter">
            {displayText}
            <span className="typewriter-cursor">|</span>
          </p>
        </section>

        <section className="features">
          <div className="feature">
            <h3>Real-Time Updates</h3>
            <p>Get live updates on local events and alerts as they happen.</p>
          </div>
          <div className="feature">
            <h3>News Time Traversal</h3>
            <p>Discover and interact with others through current and past news articles that you might have missed on.</p>
          </div>
          <div className="feature">
            <h3>Discover The World Map</h3>
            <p>Pin your posts at various locations to see what the locals are doing.</p>
          </div>
        </section>

        <section className="join">
            <p><Link to="/app">Join</Link></p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Website Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
