import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const create = async (newObject) => {
    const request = axios.post(baseUrl, newObject);
    return request
        .then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
}
const deleteUser = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`, id);

    return request.then(response => response.data);
}


export default {
    getAll,
    create,
    update,
    deleteUser
}