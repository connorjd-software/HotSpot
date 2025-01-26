import React, { useState, useEffect } from "react";
import { writePost } from "./FireBase";
import "./styles/PostForm.css";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [location, setLocation] = useState(""); // User-entered location
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null); // Resolved location
  const [userLatLng, setUserLatLng] = useState<{ lat: number; lng: number } | null>(null); // User's current location
  const [validatingLocation, setValidatingLocation] = useState(false); // Validation 
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Fetch user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLatLng({ lat: latitude, lng: longitude });
        console.log("User's current location:", { lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error fetching user's location:", error);
      }
    );
  }, []);

  // Function to get latitude and longitude from user-entered location
  const fetchLatLng = async (address: string): Promise<boolean> => {
    setValidatingLocation(true);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLatLng({ lat, lng });
        console.log("Resolved LatLng:", { lat, lng });
        setValidatingLocation(false);
        return true;
      } else {
        alert("Location not found. Please try again.");
        setValidatingLocation(false);
        return false;
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      alert("An error occurred while resolving the location.");
      setValidatingLocation(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (location.trim() && !latLng) {
      const isValidLocation = await fetchLatLng(location);
      if (!isValidLocation) return; // Stop submission if location validation fails
    }

    const finalLatLng = latLng || userLatLng;
    if (!finalLatLng) {
      alert("Unable to determine a location. Please specify one.");
      return;
    }

    // Simulated user ID (replace with actual user ID from auth context)
    const userId = "user1234";

    // Call the writePost function
    await writePost(userId, title, content, imgUrl, finalLatLng.lat, finalLatLng.lng);

    console.log("Post added successfully!");

    // Clear form fields
    setTitle("");
    setContent("");
    setImgUrl("");
    setLocation("");
    setLatLng(null);
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      {validatingLocation && <p>Validating location...</p>}
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      {title && content && userLatLng && !latLng && (
        <p>Using Current Location (No Other Address Provided).</p>
      )}
      {title && content && latLng && (
        <p>
          Using This Location: Latitude: {latLng.lat}, Longitude: {latLng.lng}
        </p>
      )}
      <input
        className="hide" // Remove this line to show the image input field
        type="text"
        placeholder="Image (Optional)"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <button type="submit" disabled={validatingLocation}>
        Add Post
      </button>
    </form>
  );
};

export default PostForm;
