import { useEffect, useState } from 'react'
import countryService from './Services/country'
import weatherService from './Services/weather'
import '../index.css'

const DisplaySingle = ({ selectedCountry }) => {
  return (
    <div>
      <h1>{selectedCountry.name}</h1>
      <div>capital {selectedCountry.capital}</div>
      <div>area {selectedCountry.area}</div>
      <div>
        <h4>Languages:</h4>
        {Object.keys(selectedCountry.languages).map((keyName, i) => (
          <li key={i}>
            {selectedCountry.languages[keyName]}
          </li>
        ))}
      </div>
      <div>
        <img src={selectedCountry.flag}></img>
      </div>
    </div >
  )
}

const App = () => {

  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [matchedCountries, setMatchedCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState([])

  useEffect(() => {
    countryService.getAll().then(response => setCountries([...response]))
  }, [])

  const handleInput = (event) => {
    event.preventDefault();
    setSearch(event.target.value)

    const matched = countries.filter(country => country.toLowerCase().includes(event.target.value.toLowerCase()))
    setMatchedCountries([...matched])

    if (matched.length === 1) {
      countryService.getByName(matched[0]).then(response => {
        setSelectedCountry(response)
        weatherService.getCapitalLocation(response.capital, response.name).then(response => {
          return weatherService.getWeatherForCapital(response.lat, response.lon).then(response => setWeather(response))
        })
      })
    } else {
      setSelectedCountry(null)
    }
  }

  const handleClick = (country) => {
    setMatchedCountries([country])
    countryService.getByName(country).then(response => setSelectedCountry(response))
  }

  if (matchedCountries.length === 1 && !selectedCountry) {
    return (
      <>
        <div>find countries <input value={search} onChange={handleInput} ></input></div>
        <h3>Loading...</h3>
      </>
    )
  }
  else if (matchedCountries.length === 1 && selectedCountry) {
    return (
      <>
        <div>find countries <input value={search} onChange={handleInput} ></input></div>
        <DisplaySingle selectedCountry={selectedCountry} />
        <h1>Weather in {selectedCountry.capital}</h1>
        <div>temperature {weather.temp} Celcius</div>
        <img src={`https://openweathermap.org/img/wn/${weather.img}@2x.png`} />
        <div>wind {weather.wind} m/s</div>
      </>
    )
  }
  else {

    return (
      <>
        <div>find countries <input value={search} onChange={handleInput} ></input></div>
        {matchedCountries.length < 10 ? matchedCountries.map(country =>
          <div key={country}>
            {country} <button onClick={() => handleClick(country)}>show</button>
          </div>
        ) :
          <div>Too many matches, specify another filter</div>
        }
      </>
    )
  }
}

export default App
