module.exports = app => {
    const cages = require("../controllers/cage.controller.js");

    var router = require("express").Router();

    // next cage number
    router.get("/next", cages.findNext);

    // get nonempty cages matching strain and gender
    router.get("/transfer/:gender/:strain/:cageId/:experiment", cages.findStrainGender)

    // get all records
    router.get("/", cages.findAll);

    // get one cage
    router.get("/:id", cages.findOne);

    // get mice of one cage
    router.get("/:id/mice", cages.findMice);

    // add new cage
    router.post("/", cages.addCage);

    // add mouse to cage
    router.post("/:id", cages.addMouse);

    // update cage note
    router.put("/:id/note", cages.noteUpdate);

    // update cage retire status
    router.put("/:id/retire", cages.retireUpdate);

    router.put("/:id/roomChange", cages.roomChange);

    // get filtered cage list by empty
    router.get("/:empty/:experiment/empties", cages.findEmptyOrNot);

    // apply claiming user name to cage
    router.put("/:id/claim", cages.claimCage);
 
    // define api endpoint root url
    app.use('/cages', router);
}