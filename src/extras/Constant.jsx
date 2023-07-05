import axios from 'axios'

const BASE_URL = 'http://localhost:8000/'

// POST ENDPOINTS
const POST_ENDPOINT = 'posts/'
const POST_URL = `${BASE_URL}${POST_ENDPOINT}`
const MEDIA_URL = `${BASE_URL}/media/`

const API_SINGLETON = axios.create({
    baseURL: BASE_URL,
})

const CHECK_LOGIN = () => {
    return true;
}

export { POST_ENDPOINT, POST_URL, MEDIA_URL, API_SINGLETON, CHECK_LOGIN }