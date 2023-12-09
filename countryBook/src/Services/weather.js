import axios from "axios"
const baseUrl = `http://api.openweathermap.org/geo/1.0/direct?q=`
const weather = `https://api.openweathermap.org/data/3.0/onecall?`
const api_key = import.meta.env.VITE_API_KEY

const getCapitalLocation = (capital, country) => {
    const request = axios.get(`${baseUrl}${capital},${country}&limit=1&appid=${api_key}`)
    return request.then(response => {
        var temp = {
            lat: response.data[0].lat,
            lon: response.data[0].lon
        }
        return temp
    })

}

const getWeatherForCapital = (lat, lon) => {
    const req = axios.get(`${weather}lat=${lat}&lon=${lon}&appid=${api_key}`)
    return req.then(response => {
        const obj = {
            temp: (response.data.current.temp - 273.15).toFixed(2),
            img: response.data.current.weather[0].icon,
            wind: response.data.current.wind_speed
        }
        return obj
    })
}

export default { getCapitalLocation, getWeatherForCapital }