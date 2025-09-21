import React, { useState } from "react";
import Welcome from "./pages/Welcome";
import Chat from "./pages/Chat";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [tripData, setTripData] = useState({ destination: "", days: "" });

  const handleNavigateToChat = (destination, days) => {
    setTripData({ destination, days });
    setCurrentPage("chat");
  };

  const handleBackToWelcome = () => {
    setCurrentPage("welcome");
    setTripData({ destination: "", days: "" });
  };

  return (
    <div className="App">
      {currentPage === "welcome" ? (
        <Welcome onNavigateToChat={handleNavigateToChat} />
      ) : (
        <Chat
          destination={tripData.destination}
          days={tripData.days}
          onBackToWelcome={handleBackToWelcome}
        />
      )}
    </div>
  );
}

export default App;
