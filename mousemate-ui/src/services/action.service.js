import http from "../http-common";

const getCageActions = (cageId) => {
    return http.get(`/actions/${cageId}`)
}

const getAllActions = () => {
    return http.get(`/actions/all`)
}

const addAction = (cageId, body) => {
    return http.post(`/actions/${cageId}`, body)
}



const ActionService = {
    getAllActions,
    getCageActions,
    addAction
};

export default ActionService;