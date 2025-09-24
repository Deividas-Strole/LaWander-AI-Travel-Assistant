import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/chat.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Create custom colored icons for different marker types
const createCustomIcon = (color, emoji = "📍") => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">${emoji}</div>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Color scheme for different place types
const getMarkerColor = (placeType, placeName) => {
  const name = placeName.toLowerCase();

  if (placeType === "destination") {
    return { color: "#ff69b4", emoji: "🏙️" }; // Pink for destination
  }

  // Check for specific place categories
  if (
    name.includes("museum") ||
    name.includes("gallery") ||
    name.includes("exhibition")
  ) {
    return { color: "#8B4513", emoji: "🏛️" }; // Brown for museums
  }

  if (
    name.includes("restaurant") ||
    name.includes("cafe") ||
    name.includes("bar") ||
    name.includes("food") ||
    name.includes("dining") ||
    name.includes("kitchen") ||
    name.includes("club")
  ) {
    return { color: "#DC143C", emoji: "🍽️" }; // Red for restaurants
  }

  if (
    name.includes("hotel") ||
    name.includes("accommodation") ||
    name.includes("hostel") ||
    name.includes("resort") ||
    name.includes("lodge")
  ) {
    return { color: "#4169E1", emoji: "🏨" }; // Royal blue for hotels
  }

  if (
    name.includes("park") ||
    name.includes("garden") ||
    name.includes("nature") ||
    name.includes("forest") ||
    name.includes("beach")
  ) {
    return { color: "#228B22", emoji: "🌳" }; // Forest green for parks/nature
  }

  if (
    name.includes("church") ||
    name.includes("cathedral") ||
    name.includes("temple") ||
    name.includes("mosque") ||
    name.includes("synagogue")
  ) {
    return { color: "#9370DB", emoji: "⛪" }; // Purple for religious sites
  }

  if (
    name.includes("shop") ||
    name.includes("market") ||
    name.includes("mall") ||
    name.includes("store") ||
    name.includes("boutique")
  ) {
    return { color: "#FF8C00", emoji: "🛍️" }; // Orange for shopping
  }

  if (
    name.includes("theater") ||
    name.includes("cinema") ||
    name.includes("concert") ||
    name.includes("show") ||
    name.includes("entertainment")
  ) {
    return { color: "#FF1493", emoji: "🎭" }; // Deep pink for entertainment
  }

  // Default color for other attractions
  return { color: "#1E90FF", emoji: "🎯" }; // Dodger blue for general attractions
};

// Generate specific description for popup
const getPlaceDescription = (placeName, fullAddress) => {
  const name = placeName.toLowerCase();

  // Extract city and street info from the full address
  const addressParts = fullAddress.split(",");
  const city =
    addressParts[addressParts.length - 3]?.trim() ||
    addressParts[addressParts.length - 2]?.trim() ||
    "Unknown";
  const street = addressParts[0]?.trim() || "";

  // Generate specific description based on place type and name
  if (
    name.includes("museum") ||
    name.includes("gallery") ||
    name.includes("exhibition")
  ) {
    if (name.includes("art")) {
      return `🏛️ <strong>${placeName}</strong><br>Art museum featuring local and international collections in ${city}`;
    } else if (name.includes("history") || name.includes("historical")) {
      return `🏛️ <strong>${placeName}</strong><br>Historical museum showcasing ${city}'s rich heritage and culture`;
    } else if (name.includes("science") || name.includes("natural")) {
      return `🏛️ <strong>${placeName}</strong><br>Science museum with interactive exhibits and natural history displays`;
    } else {
      return `🏛️ <strong>${placeName}</strong><br>Cultural institution featuring art, history, and science exhibits in ${city}`;
    }
  }

  if (
    name.includes("restaurant") ||
    name.includes("cafe") ||
    name.includes("bar") ||
    name.includes("food") ||
    name.includes("dining") ||
    name.includes("kitchen")
  ) {
    if (name.includes("cafe") || name.includes("coffee")) {
      return `☕ <strong>${placeName}</strong><br>Cozy cafe perfect for coffee, light meals, and relaxation in ${city}`;
    } else if (name.includes("bar") || name.includes("pub")) {
      return `🍺 <strong>${placeName}</strong><br>Local bar/pub offering drinks and traditional ${city} atmosphere`;
    } else {
      return `🍽️ <strong>${placeName}</strong><br>Restaurant serving local cuisine and specialties in ${city}`;
    }
  }

  if (
    name.includes("hotel") ||
    name.includes("accommodation") ||
    name.includes("hostel") ||
    name.includes("resort") ||
    name.includes("lodge")
  ) {
    if (name.includes("hostel")) {
      return `🏨 <strong>${placeName}</strong><br>Budget-friendly hostel accommodation in the heart of ${city}`;
    } else if (name.includes("resort")) {
      return `🏨 <strong>${placeName}</strong><br>Luxury resort with amenities and services in ${city}`;
    } else {
      return `🏨 <strong>${placeName}</strong><br>Hotel accommodation offering comfort and convenience in ${city}`;
    }
  }

  if (
    name.includes("park") ||
    name.includes("garden") ||
    name.includes("nature") ||
    name.includes("forest") ||
    name.includes("beach")
  ) {
    if (name.includes("botanical") || name.includes("garden")) {
      return `🌳 <strong>${placeName}</strong><br>Botanical garden featuring diverse plant collections and peaceful walking paths`;
    } else if (name.includes("national") || name.includes("forest")) {
      return `🌲 <strong>${placeName}</strong><br>National park with hiking trails and natural beauty`;
    } else if (name.includes("beach")) {
      return `🏖️ <strong>${placeName}</strong><br>Beautiful beach area perfect for relaxation and water activities`;
    } else {
      return `🌳 <strong>${placeName}</strong><br>Public park offering green spaces and recreational activities in ${city}`;
    }
  }

  if (
    name.includes("church") ||
    name.includes("cathedral") ||
    name.includes("temple") ||
    name.includes("mosque") ||
    name.includes("synagogue")
  ) {
    if (name.includes("cathedral")) {
      return `⛪ <strong>${placeName}</strong><br>Historic cathedral with stunning architecture and religious significance`;
    } else if (name.includes("temple")) {
      return `🕉️ <strong>${placeName}</strong><br>Sacred temple representing spiritual heritage in ${city}`;
    } else {
      return `⛪ <strong>${placeName}</strong><br>Historic church with cultural and architectural importance`;
    }
  }

  if (
    name.includes("shop") ||
    name.includes("market") ||
    name.includes("mall") ||
    name.includes("store") ||
    name.includes("boutique")
  ) {
    if (name.includes("market")) {
      return `🛒 <strong>${placeName}</strong><br>Local market offering fresh produce and traditional goods`;
    } else if (name.includes("boutique")) {
      return `👗 <strong>${placeName}</strong><br>Boutique shop featuring unique fashion and local crafts`;
    } else {
      return `🛍️ <strong>${placeName}</strong><br>Shopping destination for local goods and souvenirs in ${city}`;
    }
  }

  if (
    name.includes("theater") ||
    name.includes("cinema") ||
    name.includes("concert") ||
    name.includes("show") ||
    name.includes("entertainment")
  ) {
    if (name.includes("theater") || name.includes("theatre")) {
      return `🎭 <strong>${placeName}</strong><br>Theater venue hosting plays, performances, and cultural events`;
    } else if (name.includes("cinema") || name.includes("movie")) {
      return `🎬 <strong>${placeName}</strong><br>Cinema showing latest films and cultural screenings`;
    } else {
      return `🎪 <strong>${placeName}</strong><br>Entertainment venue for shows, concerts, and performances`;
    }
  }

  // Default for other attractions - try to be more specific based on name
  if (name.includes("castle") || name.includes("fortress")) {
    return `🏰 <strong>${placeName}</strong><br>Historic castle/fortress with rich history and architectural beauty`;
  } else if (name.includes("tower") || name.includes("monument")) {
    return `🗼 <strong>${placeName}</strong><br>Iconic landmark and monument representing ${city}'s heritage`;
  } else if (name.includes("square") || name.includes("plaza")) {
    return `🏛️ <strong>${placeName}</strong><br>Historic square/plaza in the heart of ${city}`;
  } else {
    return `🎯 <strong>${placeName}</strong><br>Notable attraction worth visiting during your time in ${city}`;
  }
};

function Chat({ destination, days, onBackToWelcome }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London
  const [markers, setMarkers] = useState([]);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Extract place names from text (format: **PlaceName**)
  const extractPlaceNames = (text) => {
    console.log("Extracting place names from text:", text);
    const regex = /\*\*(.*?)\*\*/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    console.log("Found matches:", matches);
    return matches;
  };

  // Extract place descriptions from AI response text
  const extractPlaceDescriptions = (text, placeNames) => {
    const descriptions = {};

    // Split text into sentences for better parsing
    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    placeNames.forEach((placeName) => {
      // Look for sentences that mention this place
      const relevantSentences = sentences.filter((sentence) =>
        sentence.toLowerCase().includes(placeName.toLowerCase())
      );

      if (relevantSentences.length > 0) {
        // Take the first relevant sentence and clean it up
        let description = relevantSentences[0];

        // Remove the place name from the beginning if it's there
        description = description
          .replace(new RegExp(`\\*\\*${placeName}\\*\\*`, "gi"), "")
          .trim();

        // Remove colons from the description
        description = description.replace(/:/g, "");

        // Remove common prefixes
        description = description.replace(
          /^(is|are|was|were|has|have|had|will|would|can|could|should|may|might)\s+/i,
          ""
        );

        // Capitalize first letter
        description =
          description.charAt(0).toUpperCase() + description.slice(1);

        // Use the entire first sentence (no length limit)
        descriptions[placeName] = description;
      }
    });

    console.log("Extracted place descriptions:", descriptions);
    return descriptions;
  };

  // Format message text to highlight only found place names
  const formatMessageText = (text, foundPlaces = []) => {
    if (foundPlaces.length === 0) {
      // If no places were found, don't highlight any
      return text.replace(/\*\*(.*?)\*\*/g, "$1");
    }

    // Only highlight places that were actually found on the map
    return text.replace(/\*\*(.*?)\*\*/g, (match, placeName) => {
      const trimmedPlaceName = placeName.trim();
      if (foundPlaces.includes(trimmedPlaceName)) {
        return `<span class="place-name">${placeName}</span>`;
      } else {
        return placeName; // Don't highlight if not found
      }
    });
  };

  // Geocode multiple places and add them to the map
  const geocodePlaces = async (placeNames, placeDescriptions = {}) => {
    console.log("Geocoding places:", placeNames);
    console.log("Place descriptions:", placeDescriptions);
    const newMarkers = [];
    const foundPlaces = [];

    for (const placeName of placeNames) {
      try {
        // Try multiple search strategies for better results, prioritizing local results
        const searchQueries = [
          `${placeName}, ${destination}`, // Name + destination city (highest priority)
          `${placeName}, ${destination}, Lithuania`, // Name + destination + country
          `${placeName} ${destination}`, // Name + destination (alternative format)
          `${placeName}`, // Original name (fallback only)
        ];

        // For museums, try alternative search terms with destination
        if (placeName.toLowerCase().includes("museum")) {
          // Try without "museum" in the name
          const nameWithoutMuseum = placeName.replace(/museum/gi, "").trim();
          if (nameWithoutMuseum) {
            searchQueries.push(`${nameWithoutMuseum}, ${destination}`);
            searchQueries.push(`${nameWithoutMuseum} museum, ${destination}`);
            searchQueries.push(
              `${nameWithoutMuseum}, ${destination}, Lithuania`
            );
          }

          // Try with just the main part of the name
          const mainName = placeName.split(":")[0].split("(")[0].trim();
          if (mainName !== placeName) {
            searchQueries.push(`${mainName}, ${destination}`);
            searchQueries.push(`${mainName} museum, ${destination}`);
            searchQueries.push(`${mainName}, ${destination}, Lithuania`);
          }
        }

        let found = false;
        for (const query of searchQueries) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}&limit=3&addressdetails=1`
          );
          const data = await response.json();

          console.log(`Searching for "${query}":`, data.length, "results");

          if (data && data.length > 0) {
            // Filter results to only include those in the destination area
            const localResults = data.filter((item) => {
              const address = item.display_name.toLowerCase();
              const destinationLower = destination.toLowerCase();

              // Must include the destination city name
              const hasDestination = address.includes(destinationLower);

              // Should also be in Lithuania (but destination is primary requirement)
              const isInLithuania =
                address.includes("lithuania") || address.includes("lt");

              // Prioritize results that have both destination and Lithuania
              return hasDestination && isInLithuania;
            });

            // If we have local results, use them; otherwise use all results but with warning
            const resultsToUse = localResults.length > 0 ? localResults : data;

            if (localResults.length === 0) {
              console.warn(
                `⚠️ No local results found for ${placeName} in ${destination}. Using first available result.`
              );
            }

            // Find the best match (prefer results with more address details)
            const bestMatch =
              resultsToUse.find(
                (item) =>
                  item.display_name
                    .toLowerCase()
                    .includes(placeName.toLowerCase()) ||
                  item.display_name
                    .toLowerCase()
                    .includes(destination.toLowerCase())
              ) || resultsToUse[0];

            const { lat, lon, display_name } = bestMatch;
            const coordinates = [parseFloat(lat), parseFloat(lon)];

            newMarkers.push({
              position: coordinates,
              popup: `${placeName}<br><small>${display_name}</small>`,
              type: "place",
              placeName: placeName,
              fullAddress: display_name,
              aiDescription: placeDescriptions[placeName] || null,
            });

            foundPlaces.push(placeName); // Add to found places list
            console.log(`✅ Found ${placeName} at:`, coordinates);
            console.log(`   Full address: ${display_name}`);
            found = true;
            break; // Stop trying other queries once we find a match
          }
        }

        if (!found) {
          console.log(`❌ No results found for: ${placeName}`);
          console.log(`   Tried queries:`, searchQueries);

          // Fallback: Try to find any museum in the destination city
          if (placeName.toLowerCase().includes("museum")) {
            console.log(
              `🔄 Trying fallback search for museums in ${destination}`
            );
            try {
              const fallbackResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=museum+${encodeURIComponent(
                  destination
                )}+lithuania&limit=5&addressdetails=1`
              );
              const fallbackData = await fallbackResponse.json();

              if (fallbackData && fallbackData.length > 0) {
                // Find a museum that hasn't been added yet
                const availableMuseums = fallbackData.filter(
                  (museum) =>
                    !newMarkers.some((marker) =>
                      marker.popup
                        .toLowerCase()
                        .includes(
                          museum.display_name
                            .toLowerCase()
                            .split(",")[0]
                            .toLowerCase()
                        )
                    )
                );

                if (availableMuseums.length > 0) {
                  const museum = availableMuseums[0];
                  const coordinates = [
                    parseFloat(museum.lat),
                    parseFloat(museum.lon),
                  ];

                  newMarkers.push({
                    position: coordinates,
                    popup: `${placeName} (${
                      museum.display_name.split(",")[0]
                    })<br><small>${museum.display_name}</small>`,
                    type: "place",
                    placeName: placeName,
                    fullAddress: museum.display_name,
                    aiDescription: placeDescriptions[placeName] || null,
                  });

                  foundPlaces.push(placeName); // Add fallback found place to list
                  console.log(
                    `✅ Fallback found: ${
                      museum.display_name.split(",")[0]
                    } at:`,
                    coordinates
                  );
                }
              }
            } catch (fallbackError) {
              console.error(
                `Fallback search failed for ${placeName}:`,
                fallbackError
              );
            }
          } else {
            // General fallback: Try to find any place with similar name in the destination
            console.log(
              `🔄 Trying general fallback search for ${placeName} in ${destination}`
            );
            try {
              const generalFallbackResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                  placeName
                )}+${encodeURIComponent(
                  destination
                )}+lithuania&limit=3&addressdetails=1`
              );
              const generalFallbackData = await generalFallbackResponse.json();

              if (generalFallbackData && generalFallbackData.length > 0) {
                // Filter for local results
                const localFallbackResults = generalFallbackData.filter(
                  (item) => {
                    const address = item.display_name.toLowerCase();
                    return (
                      address.includes(destination.toLowerCase()) &&
                      (address.includes("lithuania") || address.includes("lt"))
                    );
                  }
                );

                if (localFallbackResults.length > 0) {
                  const fallbackItem = localFallbackResults[0];
                  const coordinates = [
                    parseFloat(fallbackItem.lat),
                    parseFloat(fallbackItem.lon),
                  ];

                  newMarkers.push({
                    position: coordinates,
                    popup: `${placeName}<br><small>${fallbackItem.display_name}</small>`,
                    type: "place",
                    placeName: placeName,
                    fullAddress: fallbackItem.display_name,
                    aiDescription: placeDescriptions[placeName] || null,
                  });

                  foundPlaces.push(placeName);
                  console.log(
                    `✅ Fallback found ${placeName} at:`,
                    coordinates
                  );
                  console.log(
                    `   Fallback address: ${fallbackItem.display_name}`
                  );
                }
              }
            } catch (generalFallbackError) {
              console.error(
                `General fallback search failed for ${placeName}:`,
                generalFallbackError
              );
            }
          }
        }

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error geocoding ${placeName}:`, error);
      }
    }

    // Add new markers to existing ones
    if (newMarkers.length > 0) {
      setMarkers((prev) => [...prev, ...newMarkers]);
      console.log(`✅ Added ${newMarkers.length} new markers to map`);
      console.log(
        `   Markers added:`,
        newMarkers.map((m) => m.placeName)
      );
    } else {
      console.log("❌ No new markers were added");
    }

    // Show which places were found vs not found
    const notFoundPlaces = placeNames.filter(
      (name) => !foundPlaces.includes(name)
    );
    if (notFoundPlaces.length > 0) {
      console.log(
        `⚠️ Places mentioned in chat but not found on map:`,
        notFoundPlaces
      );
    }

    console.log("✅ Found places for highlighting:", foundPlaces);
    return foundPlaces;
  };

  // Geocode destination to get coordinates
  const geocodeDestination = React.useCallback(
    async (destinationName) => {
      try {
        console.log("Geocoding destination:", destinationName);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            destinationName
          )}&limit=1`
        );
        const data = await response.json();
        console.log("Geocoding response:", data);

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const coordinates = [parseFloat(lat), parseFloat(lon)];
          console.log("Found coordinates:", coordinates);

          // Update map center to destination
          setMapCenter(coordinates);

          // Add destination marker
          setMarkers([
            {
              position: coordinates,
              popup: `${destinationName} - Your destination for ${days} days`,
              type: "destination",
              placeName: destinationName,
              fullAddress: `${destinationName}, ${data[0].display_name}`,
            },
          ]);

          return coordinates;
        } else {
          console.log("No results found for:", destinationName);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
      return null;
    },
    [days]
  );

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: 1,
      text: `Welcome! I'll help you plan your ${days}-day trip to ${destination}. What would you like to know about your destination?`,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([welcomeMessage]);

    // Geocode destination and update map
    if (destination) {
      geocodeDestination(destination);
    }
  }, [destination, days, geocodeDestination]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    const userMessage = inputMessage;
    setInputMessage("");

    // Add loading message
    const loadingMessage = {
      id: messages.length + 2,
      text: "Lawander is thinking...",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Add destination context to the message with more specific instructions
      const contextualMessage = `Context: The user is planning a ${days}-day trip to ${destination}. 

IMPORTANT INSTRUCTIONS:
- If the user asks for a specific type of place (restaurants, museums, hotels, etc.), ONLY provide places of that exact type
- ALL places must be located in or very near ${destination}
- When mentioning places, use the format **PlaceName** for each place
- Be specific and accurate about locations - only include places that are actually in ${destination}
- For each place you mention, provide a brief description (1-2 sentences) about what makes it special or what it offers
- Include practical information like cuisine type, atmosphere, or unique features

User question: ${userMessage}`;

      // Call backend API
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: contextualMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract place names from AI response (format: **PlaceName**)
      const placeNames = extractPlaceNames(data.message);
      console.log("AI Response:", data.message);
      console.log("Extracted place names:", placeNames);

      // Extract place descriptions from AI response
      const placeDescriptions = extractPlaceDescriptions(
        data.message,
        placeNames
      );

      // Geocode the places and add them to the map
      let foundPlaces = [];
      if (placeNames.length > 0) {
        console.log("Starting geocoding for", placeNames.length, "places");
        foundPlaces = await geocodePlaces(placeNames, placeDescriptions);
      } else {
        console.log("No place names found in AI response");
      }

      // Remove loading message and add real response
      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => !msg.isLoading);
        const aiResponse = {
          id: withoutLoading.length + 1,
          text: data.message,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString(),
          foundPlaces: foundPlaces, // Store found places for highlighting
        };
        return [...withoutLoading, aiResponse];
      });
    } catch (error) {
      console.error("Error calling chat API:", error);

      // Remove loading message and add error response
      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => !msg.isLoading);
        const errorResponse = {
          id: withoutLoading.length + 1,
          text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString(),
        };
        return [...withoutLoading, errorResponse];
      });
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={onBackToWelcome}>
            ← Back
          </button>
          <h1 className="chat-title">Lawander</h1>
        </div>
        <div className="trip-info">
          <span className="destination">{destination}</span>
          <span className="days">{days} days</span>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-window">
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "user" ? "user-message" : "ai-message"
                }`}
              >
                <div
                  className={`message-content ${
                    message.isLoading ? "loading" : ""
                  }`}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: formatMessageText(
                        message.text,
                        message.foundPlaces
                      ),
                    }}
                  ></p>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your destination..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>

        <div className="map-container">
          <MapContainer
            key={`${mapCenter[0]}-${mapCenter[1]}`}
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => {
              const colorInfo = getMarkerColor(marker.type, marker.placeName);

              // Generate popup content
              let popupContent;
              if (marker.type === "destination") {
                popupContent = `🏙️ <strong>${marker.placeName}</strong><br><small>Your destination for ${days} days</small>`;
              } else {
                // Use AI description if available, otherwise fall back to generated description
                if (marker.aiDescription) {
                  popupContent = `${colorInfo.emoji} <strong>${marker.placeName}</strong><br>${marker.aiDescription}`;
                } else {
                  const description = getPlaceDescription(
                    marker.placeName,
                    marker.fullAddress
                  );
                  popupContent = description;
                }
              }

              return (
                <Marker
                  key={index}
                  position={marker.position}
                  icon={createCustomIcon(colorInfo.color, colorInfo.emoji)}
                >
                  <Popup>
                    <div dangerouslySetInnerHTML={{ __html: popupContent }} />
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Chat;
