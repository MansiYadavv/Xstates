import React, { useEffect, useState } from "react";
import "./locationselector.css"; 

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(""); // New state for displaying selected location

  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch countries");
        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("Invalid country response");
        }
        return await res.json();
      })
      .then((data) => setCountries(data))
      .catch((err) => {
        console.error("Country API error:", err);
        setCountries([]);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch states");
          const contentType = res.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            throw new Error("Invalid state response");
          }
          return await res.json();
        })
        .then((data) => setStates(data))
        .catch((err) => {
          console.error("State API error:", err);
          setStates([]);
        });
    } else {
      setStates([]);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
      )
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch cities");
          const contentType = res.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            throw new Error("Invalid city response");
          }
          return await res.json();
        })
        .then((data) => setCities(data))
        .catch((err) => {
          console.error("City API error:", err);
          setCities([]);
        });
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedState, selectedCountry]);

  // Update the selected location whenever country, state, or city changes
  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      setSelectedLocation(`You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`);
    }
  }, [selectedCountry, selectedState, selectedCity]);

  return (
    <div className="location-wrapper">
      <div className="location-container">
        <h2>Select Location</h2>
        <div className="dropdown-row">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedState("");
              setSelectedCity("");
            }}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity("");
            }}
            disabled={!selectedCountry}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Display the selected location */}
        {selectedLocation && (
          <div className="selected-location">
            <p>{selectedLocation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
