let strains = [
    "ArchT",
    "ArchT x SOM-Cre",
    "CD-1",
    "Cntnap",
    "Emx1-Cre",
    "Gad2-Cre",
    "GCaMP6",
    "Gt(Rosa)",
    "Gt(Rosa) x PV-Cre",
    "Gt(Rosa) x SOM-Cre",
    "Gt(Rosa) x Scnn1a-Cre",
    "Gt(Rosa) x WT x Emx1-Cre",
    "PV-Cre",
    "Scnn1a-Cre",
    "SOM-Cre",
    "tTa",
    "tTa x GCaMP6",
    "WT",
    "WT x Emx1-Cre",
    "WT x PV-Cre",
    "WT x Scnn1a-Cre"
];
export {strains}

let breederStrains = [
    "ArchT",
    "CD-1",
    "Cntnap",
    "Emx1-Cre",
    "Gad2-Cre",
    "GCaMP6",
    "Gt(Rosa)",
    "PV-Cre",
    "Scnn1a-Cre",
    "SOM-Cre",
    "tTa",
    "WT",
    "WT x Emx1-Cre",
];
export {breederStrains}

let genotypeStrains = {
    "tTa": ["tTa (+)", "tTa (-)"],
    "tTa x GCaMP6": ["tTa (+) GCaMP6 (+)", "tTa (+) GCaMP6 (-)", "tTa (-) GCaMP6 (+)", "tTa (-) GCaMP6 (-)"],
    "GCaMP6" : ["WT (+) GCaMP6 (+)", "WT (+) GCaMP6 (-)", "WT (-) GCaMP6 (+)", "WT (-) GCaMP6 (-)"],
    "Scnn1a-Cre" : ["Cre (+)", "Cre (-)"],
    "Gt(Rosa) x Scnn1a-Cre": ["Cre (+) Gt(Rosa) (+)", "Cre (+) Gt(Rosa) (-)", "Cre (-) Gt(Rosa) (+)", "Cre (-) Gt(Rosa) (-)"],
    "Cntnap": ["Cntnap (+) WT (+)", "Cntnap (+) WT (-)", "Cntnap (-) WT (+)", "Cntnap (-) WT (-)"],
    "WT x Emx1-Cre": ["WT (+) Cre (+)", "WT (+) Cre (-)", "WT (-) Cre (+)", "WT (-) Cre (-)"],
    "WT x Scnn1a-Cre": ["WT (+) Cre (+)", "WT (+) Cre (-)", "WT (-) Cre (+)", "WT (-) Cre (-)"],
};
export {genotypeStrains}