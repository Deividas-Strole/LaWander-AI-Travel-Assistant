import React, { useState } from "react";
import "../css/welcome.css";

function Welcome({ onNavigateToChat }) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination && days) {
      onNavigateToChat(destination, days);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">Lawander</h1>
          <p className="description">
            Your AI-powered travel companion that creates personalized
            itineraries based on your destination and travel duration.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              placeholder="How many days?"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="input-field"
              min="1"
              required
            />
          </div>

          <button type="submit" className="generate-button">
            Generate
          </button>
        </form>
      </div>
    </div>
  );
}
export default Welcome;
