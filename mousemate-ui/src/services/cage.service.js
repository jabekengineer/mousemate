import http from "../http-common";

const getAll = () => {
    return http.get("/cages");
};

const get = id => {
    return http.get(`/cages/${id}`);
};

const getMice = id => {
    return http.get(`/cages/${id}/mice`)
}

const getNextCage = () => {
    return http.get("/cages/next")
}

const getTransferCages = (gender, strain, cageId, experimentFlag) => {
    return http.get(`/cages/transfer/${gender}/${strain}/${cageId}/${experimentFlag}`)
}

const addNew = (cage) => {
    /**
     * Add a new cage to cages table.
     * @param {Object} cage with fields:
     * @param {Number} cage.id cageId of the new cage
     * @param {Number} cage.roomId roomId where the cage is
     * @param {String} cage.strain strain of the mice in the cage
     * @param {String} cage.status 'Adult', 'Breeder', 'Experimental'
     * @param {String} cage.gender 'M', 'F', 'Pair'
     * @param {Number} cage.count number of mice in the cage
     * @param {Number} cage.litterId id of the litter the mice in cage belong to
     * @param {String} cage.notes notes for the cage
     */
    return http.post("/cages", cage)
}

const addMouse = (id,data) => {
    return http.post(`/cages/${id}`, data)
}

const updateCageNote = (id, data) => {
    return http.put(`/cages/${id}/note`, data)
}

const updateCageRoom = (id, data) => {
    return http.put(`/cages/${id}/roomChange`, data)
}

const updateCageRetire = (id, data) => {
    return http.put(`/cages/${id}/retire`, data)
}

const getEmptyOrNot = (emptyFlag,experimentFlag) => {
    return http.get(`/cages/${emptyFlag}/${experimentFlag}/empties`);
};

const updateCageClaim = (id, data) => {
    return http.put(`/cages/${id}/claim`, data)
}

const CageService = {
    getAll,
    get,
    getEmptyOrNot,
    getNextCage,
    getMice,
    getTransferCages,
    addNew,
    addMouse,
    updateCageNote,
    updateCageRetire,
    updateCageRoom,
    updateCageClaim
};

export default CageService;