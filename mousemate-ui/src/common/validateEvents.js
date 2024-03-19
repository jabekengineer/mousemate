// TODO: number of pups in litter may need to not be instantaneous

function weanDateFromDob(dateString){
    if(!dateString){
        return null
    }
    let dateObj = new Date(dateString);
    let _later = new Date(dateObj.setDate(dateObj.getDate() + 19));
    var dd = String(_later.getDate()).padStart(2, '0');
    var mm = String(_later.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = _later.getFullYear();

    _later = mm + '/' + dd + '/' + yyyy;
    return _later
}

function convertDateToSlash(dateHyphen){
    if(!dateHyphen){
        return null
    }
    let _date = new Date(dateHyphen);
    const dd = String(_date.getDate()).padStart(2, '0');
    var mm = String(_date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = _date.getFullYear();

    _date = mm + '/' + dd + '/' + yyyy;
    return _date
    
}

export {convertDateToSlash}

function stdTimezoneOffset(date) {    
    var jan = new Date(date.getFullYear(), 0, 1);
    var jul = new Date(date.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}


function isDST(date) {
    return date.getTimezoneOffset() < stdTimezoneOffset(date);
}

export {isDST}

function convertDateSlashToHyphen(dateSlash) {
    let _date = new Date(dateSlash);
    const dd = String(_date.getDate()).padStart(2, '0');
    var mm = String(_date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = _date.getFullYear();

    _date = yyyy + '-' + mm + '-' + dd;
    return _date
}

export { convertDateSlashToHyphen }
// @param birthEvent: date, note
function validateBirth(birthEvent, nextLitter, sireAndDam, currentLitter, parentCageId, breeders) {
    let validation = {
        'passed': false,
        'data': {},
        'message': '',
    };
    // if there is a current, unfinished litter, finish it
    if(Object.keys(currentLitter).length !== 0){
        validation.message = 'Finish litter ' + currentLitter.id + " before starting new one."
        return validation
    };
    validation.passed = true;
    const sire = breeders.find((breeder) => {return breeder.gender === "M"});
    const dam = breeders.find((breeder) => {return breeder.gender === "F"});
    // package the data
    var body = {
        id: nextLitter,
        parentCageId: parentCageId,
        sireId: sireAndDam.sireId ?? null,
        damId: sireAndDam.damId,
        dob: convertDateToSlash(birthEvent.date),
        pupCount: 1,
        weanDate: weanDateFromDob(birthEvent.date),
        generation: calculateGeneration(sire?.generation ?? null, dam.generation),
        notes: birthEvent.note
    }
    validation.data = body;
    return validation
}
export {validateBirth}

function calculateGeneration(genA, genB) {
    if(genA && genA > 0 && genB && genB > 0) {
        return ((Math.min.apply(null,[genA, genB])) + 1)
    }
    if(genA && genA > 0 && !genB) {
        return (genA + 1)
    }
    if(genB && genB > 0 && !genA) {
        return (genB + 1)
    }
    return 1
}

export {calculateGeneration}

// @param wean: count, cage, room, gender, date, finished, note
function validateWean(weanEvent, nextCage, strain, currentLitter, parentCageId) {
    let validation = {
        'passed': false,
        'newCage': {},
        'weanMouse': {},
        'updateLitter': {},
        'message': '',
    };
    //    if weaning to a new cage
    if( weanEvent.cage >= nextCage) {
        // create the cage and add the mice
        // cage data
        const body = {
            id: weanEvent.cage,
            roomId: weanEvent.room,
            strain: strain,
            status: "Adult",
            gender: weanEvent.gender,
            litterId: currentLitter.id,
            parentCageId: parentCageId,
        }
        validation.newCage = body;
    }
    // generate generic wean information, let callback above handle setting mouse ids
    validation.weanMouse = {
        // id declared above
        dob: convertDateToSlash(currentLitter.dob),
        weanDate: convertDateToSlash(weanEvent.date),
        cageId: weanEvent.cage,
        strain: strain,
        status: "Adult",
        gender: weanEvent.gender,
        generation: currentLitter.generation
    };

    // pass back litter updates
        var note = '';
        if(currentLitter.notes){
            note = currentLitter.notes + (weanEvent.note ? "\n " : '') + (weanEvent.note ? weanEvent.note : '');
        } else {
            note = weanEvent.note;
        }
        validation.updateLitter = {
            gender: weanEvent.gender,
            weanDate: convertDateToSlash(weanEvent.date),
            count: weanEvent.count,
            finished: weanEvent.finished,
            notes: note,
            litter: currentLitter
        } 

        return validation
}

export {validateWean}

// rules for cross fostering
/**
 * 
 * cant cross foster into an adult cage
 * drop down list of unfinished litters that a cross foster can join
 * Cage number | strain | date of last birth 
 * 
 */

// @param transferEvent: strain, gender, fromCage, toCage, mice (id numbers)
function validateTransfer(newTransfer, nextCage, parentCageId){
    let validation = {
        newCage: {},
        roomChange: {},
        transferMouse: {}
    }
// new Cage
    if(newTransfer.toCage >= nextCage) {
        const body = {
            id: newTransfer.toCage,
            roomId: newTransfer.roomId,
            strain: newTransfer.strain,
            status: 'Adult',
            gender: newTransfer.gender,
            litterId: newTransfer.litterId,
            parentCageId: parentCageId,
            claim: newTransfer.claim,
        }
        validation.newCage = body;
    }
    // same cage room change
    else if(newTransfer.toCage === newTransfer.fromCage) {
        const body = {
            roomId: newTransfer.roomId,
        }
        validation.roomChange = body;
    }
    validation.transferMouse = {
        toCage: newTransfer.toCage,
        fromCage: newTransfer.fromCage,
        strain: newTransfer.strain,
        gender: newTransfer.gender,
        fromClaim: newTransfer.fromClaim,
        claim: newTransfer.claim,
    }
    return validation
}
export { validateTransfer }