import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./style.css";
import axios from "axios";
import Loader from "./Loader";

function Hero() {
  const weatherApi = import.meta.env.VITE_WEATHER_API;
  //states
  const [location, setLocation] = useState("");
  const [weatherDetails, setweatherDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [aqi, setAqi] = useState("");
  const [forecast, setForecast] = useState([]);
  useEffect(() => {
    const fetchLocation = async () => {
      let err;
      //ip
      let res = await axios
        .get(`https://ipapi.co/json`)
        .catch((e) => (err = e));
      setLocation(res.data.city + `, ` + res.data.region + `.`);
      //weather
      const res1 = await axios
        .get(
          `http://api.weatherapi.com/v1/forecast.json?key=${weatherApi}&q=${res.data.city}&days=5&aqi=yes&alerts=no`
        )
        .catch((e) => (err = e));
      err && console.log(err);
      setweatherDetails(res1);
      setAqi(Math.floor(res1.data.current.air_quality.pm10));
      setForecast(res1.data.forecast.forecastday);
      setLoading(false);
    };

    fetchLocation();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="main-container">
          <h1>Weather App</h1>
          <h3>{location}</h3>
          <div className="weather-info">
            <div className="temp">
              <div className="temp-celsius">
                <p className="temp-value">
                  {weatherDetails.data.current.temp_c} ° C
                </p>
                <p className="temp-text">
                  {weatherDetails.data.current.condition.text}
                </p>
              </div>
              <img
                src={weatherDetails.data.current.condition.icon}
                alt="weather-image"
              />
            </div>
            <div className="air-quality">
              <p>Air Quality Index</p>
              <p>{aqi}</p>
            </div>
          </div>
          <div className="next-days">
            {forecast.map((day) => {
              return (
                <div>
                  <p className="next-day-date">{day.date.slice(8)} June </p>
                  <p className="next-day-temp">Max: {day.day.maxtemp_c} ° C</p>
                  <p className="next-day-temp">Min: {day.day.mintemp_c} ° C</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Hero;
