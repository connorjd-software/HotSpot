import React, { useState } from "react";
import { writePost } from "./FireBase";
import "./styles/PostForm.css";

interface PostFormProps {
  markerLat: number; // Latitude of the marker
  markerLng: number; // Longitude of the marker
}

const PostForm: React.FC<PostFormProps> = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [showImgInput, setShowImgInput] = useState(false);
  const [location, setLocation] = useState(""); // Location input from the user
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  ); // Resolved latitude and longitude
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // Function to get latitude and longitude from location input
  const fetchLatLng = async (address: string) => {
     // Use your Google Maps API key
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
      } else {
        alert("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      alert("An error occurred while resolving the location.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!latLng) {
      alert("Please resolve the location before submitting.");
      return;
    }

    // Simulated user ID (replace with actual user ID from auth context)
    const userId = "user123";
    // Call the writePost function
    await writePost(
      userId,
      title,
      content,
      imgUrl,
      latLng.lat,
      latLng.lng
    );

    console.log("Post added successfully!");

    // Clear form fields
    setTitle("");
    setContent("");
    setImgUrl("");
    setLocation("");
    setLatLng(null);
    setShowImgInput(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title for the post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <textarea
        placeholder="What's in your mind..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      {showImgInput && (
        <input
            type="text"
            placeholder="Image URLs (comma-separated)"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
        />
      )}
      {/* <button
        type="button"
        onClick={() => fetchLatLng(location)}
        disabled={!location.trim()}
      >
        Resolve Location
      </button> */}
      <div className="image-icon-container">
        <button
          type="button"
          className="image-icon-btn"
          onClick={() => setShowImgInput(!showImgInput)}
        >
          📷
        </button>
      </div>
      <button 
        type="submit" 
        onClick={() => fetchLatLng(location)}
        disabled={!latLng || !location.trim()}>
        Add Post
      </button>
      {latLng && (
        <p>
          Resolved Location: Latitude: {latLng.lat}, Longitude: {latLng.lng}
        </p>
      )}
    </form>
  );
};

export default PostForm;
