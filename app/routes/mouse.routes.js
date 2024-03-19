module.exports = app => {
    const mice = require("../controllers/mouse.controller.js");
    const litters = require("../controllers/litter.controller.js");

    var router = require("express").Router();

    // get next litter
    router.get("/litter/next", litters.findNext);

    // get next mouse
    router.get("/next", mice.findNext);

    // get a mouse
    router.get("/:id", mice.findOne);

    router.get("/pairing/:strain/:gender", mice.findStrainAdults)

    // get mouse of id's litters
    router.get("/:id/litter", mice.findLitter);

    // get a litter by id
    router.get("/litter/:id", litters.findOne);

    // get a litter of id's cages
    router.get("/litter/:id/cages", litters.findLitterCages);

    // get unfinished litters for litterId cross foster options
    router.get("/litter/:id/unfinished", litters.findUnfinished);

    // add litter to mouse of id
    router.post("/:id/litter", litters.addNew);

    // add pup to litter
    router.put("/litter/:id/add", litters.addPup);

     // add cf pup to litter
    router.put("/litter/:id/cfAdd", litters.addCfPup);
    
    // drop pup from litter
    router.put("/litter/:id/drop", litters.dropPup);

    // update litter after wean
    router.put("/litter/:id/wean", litters.weanUpdate);
   
    // update litter note generally
    router.put("/litter/:id/note", litters.noteUpdate);

    // update litter after pupDeath
    router.put("/litter/:id/pupDeath", litters.pupDeathUpdate);

    // update litter after pupDeath
    router.put("/litter/:id/crossFoster", litters.crossFosterUpdate);

    // finish litter
    router.put("/litter/:id/finish", litters.finishLitter);

    // update individual mouse note
    router.put("/:mouseId/note", mice.updateNote);

    // update adult mouse after euthanasia
    router.put("/:mouseId/euth", mice.deactivate);

    // transfer a mouse between cages
    router.put("/:mouseId/transfer", mice.transferMouse);
    
    // make a mouse a breeder
    router.put("/:mouseId/breeder/:toCageId/:fromCageId", mice.makeBreeder);

    // make a breeder an adult
    router.put("/:mouseId/retire", mice.retireBreeder);

    // claim an adult mouse
    router.put("/:mouseId/claim", mice.claimAdult);

    // update mouse genotype and notches
    router.put("/:mouseId/genotype", mice.genotypeAdult);

    // define api endpoint root url
    app.use('/mouse', router);
}