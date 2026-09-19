// import React, { useState } from "react";


//   const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
//   const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'


// function App() {
//   const [city, setCity] = useState("");
//   const [search, setSearch] = useState("");
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);


 
//   async function handleSearch(e) {
//     e.preventDefault();
//     const query = search.trim();
//     if (!query) return;

//     setLoading(true);
//     setError("");
//     setWeather(null);

//     try {
//       const geoResponse = await fetch(
//         `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API}&q=bulk`
//       );
      

//       const geoData = await geoResponse.json();

//       if(!geoData.results || geoData.results.length === 0){
//         throw new Error("city not found try again");
//       }

//       const { latitude, longitude, name, country } = geoData.results[0];

//       const weatherResponse = await fetch( `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`);
      
//       setWeather({
//         cityName: name,
//         countryName: country,
//         temprature: weatherData.current_weather.temperature,
//         windspeed: weather.current_weather.windspeed,
//       });

//     } catch (e) {
//       return console.log("error is : ", e);
//     }finally{
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <div className="app">
//         <h1>Weather App</h1>

//         <div className="searchbar">
//           <input
//             type="text"
//             placeholder="search for a city"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <button 
//               type="submit" 
//               onClick={handleSearch}  
//               disabled={loading}>submit</button>
             

//         {weather && (
//           <div className="weather-card">
//             <h2>{weather.cityName}, {weather.countryName}</h2>
//             <p className="temp">Temperature: {weather.temperature}°C</p>
//             <p className="wind">Wind Speed: {weather.windspeed} km/h</p>
//           </div>
//         )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;




import React, { useState } from "react";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoResponse = await fetch(
        `${GEO_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found, try again.");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherResponse = await fetch(
        `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
      );

      const weatherData = await weatherResponse.json();

      if (!weatherData.current) {
        throw new Error("Weather data unavailable.");
      }

      setWeather({
        cityName: name,
        countryName: country,
        temperature: weatherData.current.temperature_2m,
        windspeed: weatherData.current.wind_speed_10m,
      });
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    
    <div className="body bg-black text-white flex content-center  ">
      <div className="app content-center" >
        <h1 className="mb-10 text-3xl border">Weather App</h1>

        <form className="searchbar mb-10  flex" onSubmit={handleSearch}>
          <input className="bg-grey-500 rounded-sm w-30"
            type="text"
            placeholder="Search for a city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="bg-blue-500 rounded-sm w-30"  type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>
              {weather.cityName}, {weather.countryName}
            </h2>
            <p className="temp">Temperature: {weather.temperature}°C</p>
            <p className="wind">Wind Speed: {weather.windspeed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

