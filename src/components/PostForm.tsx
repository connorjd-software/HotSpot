import React, { useState, useEffect } from "react";
import { writePost } from "./FireBase";
import "./styles/PostForm.css";
import { Autocomplete } from "@react-google-maps/api";

const PostForm: React.FC<{ isLoaded: boolean }> = ({ isLoaded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [location, setLocation] = useState(""); // User-specified location
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null); // Resolved location
  const [userLatLng, setUserLatLng] = useState<{ lat: number; lng: number } | null>(null); // User's current location
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

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

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location!.toJSON();
        setLatLng({ lat, lng });
        setLocation(place.formatted_address || "");
        console.log("Selected Place:", place);
      } else {
        alert("No valid location selected.");
        setLatLng(null); // Clear latLng if invalid place
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalLatLng = latLng || userLatLng;

    if (!finalLatLng) {
      alert("Unable to determine location. Please specify one.");
      return;
    }

    // Simulated user ID (replace with actual user ID from auth context)
    const userId = "user1234";

    // Call the writePost function
    await writePost(
      userId,
      title,
      content,
      imgUrl,
      finalLatLng.lat,
      finalLatLng.lng
    );

    console.log("Post added successfully!");

    // Show success message
    setSuccessMessage(`Now posted at "${location || `Latitude: ${finalLatLng.lat}, Longitude: ${finalLatLng.lng}`}"`);

    // Clear form fields
    setTitle("");
    setContent("");
    setImgUrl("");
    setLocation("");
    setLatLng(null);

    // Clear the message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5500);
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <label htmlFor="title" style={{ color: "white" }}>
        Title<span className="required">*</span>
      </label>
      <input
        type="text"
        placeholder="What's On Your Mind?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="location-toggle">
        <button
          type="button"
          className="toggle-btn"
          onClick={() => setShowLocationInput(!showLocationInput)}
        >
          Add Location
        </button>
        {showLocationInput && (
          <Autocomplete
            onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-input"
            />
          </Autocomplete>
        )}
      </div>
      <textarea
        placeholder="Body"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        className="hide" // Remove this line to show the image input field
        type="text"
        placeholder="Image (Optional)"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <div className="actions">
        <button type="submit" className="post-btn">
          Post
        </button>
      </div>
      {successMessage && (
        <div className="success-message" style={{ marginTop: "10px", color: "lightgreen" }}>
          {successMessage}
        </div>
      )}
    </form>
  );
};

export default PostForm;
