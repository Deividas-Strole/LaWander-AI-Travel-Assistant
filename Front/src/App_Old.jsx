import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Card, CardContent } from "@/components/ui";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [showTable, setShowTable] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setTimeout(() => setShowForm(true), 500);
  };

  const handleSubmit = () => {
    if (location && destination) {
      setShowForm(false);
      setTimeout(() => setShowTable(true), 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!isAuthenticated ? (
        <Card className="p-6 w-80">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <Input placeholder="Email" className="mb-2" />
            <Input type="password" placeholder="Password" className="mb-4" />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <p className="text-sm text-center mt-2">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600">
                Register
              </a>
            </p>
          </CardContent>
        </Card>
      ) : showForm ? (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 w-96">
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Enter Your Info</h2>
              <Input
                placeholder="Where do you live?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Where would you like to be?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleSubmit} className="w-full">
                Enter
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : showTable ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 w-96">
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Travel Information</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Current Location</th>
                    <th className="border p-2">Destination</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">{location}</td>
                    <td className="border p-2">{destination}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
