import axios from "axios";

export default axios.create({
// LOCAL DEV 
  // baseURL: "http://localhost:3000/",

  // TEST SITE DEPLOYMENT
  // baseURL: "https://jshaiderlab.bme.gatech.edu/",

  // PROD SITE DEPLOYMENT
  baseURL: "https://mousemate.bme.gatech.edu/",

  headers: {
    "Content-type": "application/json"
  }
});