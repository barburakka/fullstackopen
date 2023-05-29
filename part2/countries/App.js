import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchList = ( { countries, data, setCountry, setWeather } ) => {

  const handleClick = (selectedCountry) => {
    const selectedCountryData = data.find(country => country.name.common === selectedCountry)
    setCountry( selectedCountryData )
    axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountryData.capital[0]},${selectedCountryData.cca2}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`)
        .then(response => setWeather(response.data) )
        .catch(err => console.log(err))
  }

  if ( countries.length > 1 && countries.length < 10 ) {
    return (
      countries.map(country => {
        return (
          <div key={country}>
            {country}
            &nbsp;
            <button onClick={() => handleClick(country)}>show</button>
          </div>
          )
        })
      )
  }
}

const Notification = ({searchValue}) => {
  if (searchValue.length > 10 ) {
    return (<p>Too many matches, specify another filter</p>)
  }
}

const Snapshot = ({countryData}) => {
  
  if (countryData) { 
    return (
    <div>
        <h2>{countryData.name.common}</h2>
        <div>Capital: {countryData.capital[0]}</div>
        <div>Area: {countryData.area}</div>
        <h3>Languages:</h3>
        <ul>
          {Object.values(countryData.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img key="flag" src={countryData.flags.png} width="160" alt="flag"></img>
    </div>
    )
  }
}

const Weather = ({weatherData}) => {
  if (weatherData) { 
    return (
    <div>
        <h3>Weather in {weatherData.name}</h3>
        <div>Temperature: {weatherData.main.temp.toFixed(0)} &deg;C</div>
        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description}></img>
        <div>Wind: {weatherData.wind.speed} m/s</div>
    </div>
    )
  }
}

const App = () => {
  const [value, setValue] = useState('')
  const [allData, setAllData] = useState([])
  const [searchNames, setSearchNames] = useState([])
  const [countryData, setCountryData] = useState()
  const [weatherData, setWeatherData] = useState()

  useEffect(() => {
    axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          setAllData(response.data)
    })
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
    if (event.target.value) {
      const countryNames = allData.map(country => country.name.common)
      const filteredNames = countryNames.filter(name => name.toLowerCase().includes(event.target.value.toLowerCase()))
      setSearchNames(filteredNames)
      if (filteredNames.length === 1) {
        const selectedCountryData = allData.find(country => country.name.common === filteredNames[0])
        setCountryData( selectedCountryData )
        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountryData.capital[0]},${selectedCountryData.cca2}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`)
        .then(response => setWeatherData(response.data) )
        .catch(err => console.log(err))
      }
      else if (filteredNames.length > 10) {
        setCountryData(null)
        setWeatherData(null)
      }
    }
    else {
      setSearchNames([])
      setCountryData(null)
      setWeatherData(null)
    }
  }

 return (
    <div>
      <div>
        Find countries: <input id="searchBox"value={value} onChange={handleChange} />
        <Notification searchValue={searchNames} />
        <br></br>
        <br></br>
        <SearchList countries={searchNames} data={allData} setCountry={setCountryData} setWeather={setWeatherData} />
      </div>
      <div>
        <Snapshot countryData={countryData} />
        <Weather weatherData={weatherData} />
      </div>
    </div>
  )
}

export default App