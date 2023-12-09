import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`).then(response => response.data)
    return request.then(response => response.map(country => country.name.common))
}

const getByName = (name) => {
    const request = axios.get(`${baseUrl}/name/${name}`)
    return request.then(response => {
        const obj = {
            name: response.data.name.common,
            capital: response.data.capital[0],
            area: response.data.area,
            languages: response.data.languages,
            flag: response.data.flags.png
        }
        return obj

    })
}

export default { getAll, getByName }