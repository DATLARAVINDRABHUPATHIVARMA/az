import { Card, Metric, Title } from "@tremor/react";
import { Country, City } from "country-state-city";
import { useEffect, useState } from "react";
import Select from "react-select";
import AreaChartCard from "./Components/AreaChartCard";
import LineChartCard from "./Components/LineChartCard";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [weatherDetails, setWeatherDetails] = useState([]);

  useEffect(() => {
    setAllCountries(
      Country.getAllCountries().map((country) => ({
        value:{
          latitude: country.latitude,
          longitude: country.longitude,
          isoCode: country.isoCode,
        },
      label: country.name,
      }))
    );
  },[]);

  const handleSelectedCountry = (option) => {
    setSelectedCountry(option);
    setSelectedCity(null);
  };

  const handleSelectedCity = (option) => {
    setSelectedCity(option);
  };

  const getWeatherDetails = async(e) => {
    e.preventDefault();

    const fetchWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.value?.latitude}&longitude=${selectedCity?.value?.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&minutely_15=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,snowfall,snowfall_height,freezing_level_height,sunshine_duration,weather_code,wind_speed_10m,wind_speed_80m,wind_direction_10m,wind_direction_80m,wind_gusts_10m,visibility,cape,lightning_potential,is_day,shortwave_radiation,direct_radiation,diffuse_radiation,direct_normal_irradiance,global_tilted_irradiance,terrestrial_radiation,shortwave_radiation_instant,direct_radiation_instant,diffuse_radiation_instant,direct_normal_irradiance_instant,global_tilted_irradiance_instant,terrestrial_radiation_instant&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,uv_index,uv_index_clear_sky,is_day,cape,freezing_level_height,sunshine_duration&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=GMT`);

    const data = await fetchWeather.json();

    setWeatherDetails(data);
  };

  console.log(weatherDetails);

  return (
    <div className="flex max-w-7xl mx-auto space-x-1">
      {/*SideBar*/}
      <div className="flex flex-col space-y-3 h-screen bg-blue-950 p-4 w-[25%]">
        {/*Form*/}
        <Select 
        options={allCountries} value={selectedCountry} onChange={handleSelectedCountry}/>

        <Select 
          options={City.getCitiesOfCountry(selectedCountry?.value?.isoCode).map(
            (city)=>({
              value:{
                latitude: city.latitude,
                longitude: city.longitude,
              },
              label: city.name,
            })
        )}
        value={selectedCity}
        onChange={handleSelectedCity}
      />

      <button onClick={getWeatherDetails} className="bg-green-400 w-full py-3 text-white text-sm font-bold hover:scale-110 transition-all duration-200 ease-in-out">Get Weather</button>
      <div className="flex flex-col space-y-2 text-white font-semibold">
      <p>{selectedCountry?.label} | {selectedCity?.label}</p>
      <p>Coordinates: {selectedCity?.value?.latitude} | {selectedCity?.value?.longitude}</p>
      </div>
      <div>{/* Sunrise | Sunset */}</div>
      </div>
      
      {/*Body*/}
      <div className="w-[75%] h-screen">
        <div className="flex items-center space-x-3">
          <Card decoration="top" decorationColor='red' className="bg-gray-100 text-center">
            <Title>Temperature</Title>
            <Metric>{weatherDetails?.current?.temperature_2m}&#8451;</Metric>
          </Card>
          <Card decoration="top" decorationColor='blue' className="bg-gray-100 text-center">
            <Title>Precipitation and Humidity</Title>
            <Metric>{weatherDetails?.current?.precipitation}% and {weatherDetails?.current?.relative_humidity_2m}%</Metric>
          </Card>
          <Card decoration="top" decorationColor='green' className="bg-gray-100 text-center">
            <Title>Wind Speed</Title>
            <Metric>{weatherDetails?.current?.wind_speed_10m}Km/h</Metric>
          </Card>
        </div>
        <div>
          <AreaChartCard weatherDetails={weatherDetails} />
          <LineChartCard weatherDetails={weatherDetails} />
        </div>
      </div>
    </div>
  );
}

export default App;
