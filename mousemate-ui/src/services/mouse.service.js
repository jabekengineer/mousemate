import http from "../http-common";

const addLitter = (mouseId,data) => {
    return http.post(`/mouse/${mouseId}/litter`,data)
}

const addPup = (litterId) => {
    return http.put(`/mouse/litter/${litterId}/add`)
}

const addCfPup = (litterId) => {
    return http.put(`/mouse/litter/${litterId}/cfAdd`)
}

const dropPup = (litterId,data) => {
    return http.put(`/mouse/litter/${litterId}/drop`, data)
}

const getLitter = mouseId => {
    return http.get(`/mouse/${mouseId}/litter`);
}

const getUnfinishedLitters = (litterId) => {
    return http.get(`/mouse/litter/${litterId}/unfinished`)
}

const getLitterAndCages = litterId => {
    return http.get(`/mouse/litter/${litterId}`);
}

const getLitterCages = litterId => {
    return http.get(`/mouse/litter/${litterId}/cages`);
}

const getNextLitter = () => {
    return http.get('mouse/litter/next')
}

const getNextMouse = () => {
    return http.get('/mouse/next')
}

const getMouse = (mouseId) => {
    return http.get(`/mouse/${mouseId}`)
}

const strainPairings = (strain, gender) => {
    return http.get(`/mouse/pairing/${strain}/${gender}`)
}

const updateLitterWean = (litterId, data) => {
    return http.put(`/mouse/litter/${litterId}/wean`, data)
}

const updateLitterNote = (litterId, data) => {
    return http.put(`/mouse/litter/${litterId}/note`, data)
}

const updateLitterPupDeath = (litterId, data) => {
    return http.put(`/mouse/litter/${litterId}/pupDeath`, data)
}

const updateLitterCrossFoster = (litterId, data) => {
    return http.put(`/mouse/litter/${litterId}/crossFoster`, data)
}

const updateMouseNote = (mouseId, data) => {
    return http.put(`mouse/${mouseId}/note`, data)
}

const finishLitter = (litterId, data) => {
    return http.put(`/mouse/litter/${litterId}/finish`, data)
}

const euthanize = (mouseId, data) => {
    return http.put(`/mouse/${mouseId}/euth`, data);
}

const transfer = (mouseId,data) => {
    return http.put(`/mouse/${mouseId}/transfer`, data);
};

const makeBreeder = (mouseId, toCageId, fromCageId) => {
    return http.put(`/mouse/${mouseId}/breeder/${toCageId}/${fromCageId}`);
}

const retireBreeder = (mouseId, data) => {
    return http.put(`/mouse/${mouseId}/retire`, data);
}

const claimMouse = (mouseId, data) => {
    return http.put(`/mouse/${mouseId}/claim`, data);
}

const genotypeMouse = (mouseId, data) => {
    return http.put(`/mouse/${mouseId}/genotype`, data);
}

const MouseService = {
    addLitter,
    addCfPup,
    addPup,
    claimMouse,
    dropPup,
    euthanize,
    finishLitter,
    genotypeMouse,
    getLitter,
    getLitterAndCages,
    getLitterCages,
    getMouse,
    getNextLitter,
    getNextMouse,
    getUnfinishedLitters,
    makeBreeder,
    retireBreeder,
    strainPairings,
    transfer,
    updateLitterCrossFoster,
    updateLitterNote,
    updateLitterWean,
    updateLitterPupDeath,
    updateMouseNote,
};

export default MouseService;