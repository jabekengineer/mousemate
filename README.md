
<a name="readme-top"></a>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://mousemate.bme.gatech.edu">
    <img src="images/logo.png" alt="Logo" height="250">
  </a>

  <h3 align="center">Mousemate</h3>

  <p align="center">
    The Haider Lab's solution to Mouse Colony Record Keeping!
    <br />
    <a href="https://haiderwiki.bme.gatech.edu/index.php?title=How_to_use_Mousemate"><strong>Explore the docs »</strong></a>
    <br/>
    <a href="https://github.gatech.edu/haider-lab/mousemate/issues">Report Bug</a>
    <br/>
    <a href="https://github.gatech.edu/haider-lab/mousemate/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-gif]](https://jshaiderlab.bme.gatech.edu/)

Mousemate was developed to streamline maintaining the records of a large mouse colony. Head to the Haider Wiki page to read more about the following:
* <a href="https://haiderwiki.bme.gatech.edu/index.php?title=Learn_Mousemate_Development">Development</a>
* <a href="https://haiderwiki.bme.gatech.edu/index.php?title=How_to_use_Mousemate">User Guide</a>


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][Node-url] - The backend is a Node Express server.
* [![React][React.js]][React-url] - The frontend is a React application, started with create-react-app.
* [![MySQL][MySQL]][SQL-url] - Communication to a MySQL and MariaDB is done with Sequelize.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install 
  ```
* MySQL database (Workbench recommended)
* Web Server Hosting Service or localhost development server

### Installation

1. Clone the repo
   ```sh
   git clone https://github.gatech.edu/haider-lab/mousemate.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your Databse Connection information in `app/config/db.config.js`
   ```js
      HOST: "Your SQL server IP Address or 127.0.0.1 for localhost",
      USER: "Username you created",
      PASSWORD: "Password you created",
      DB: "Database you created",
      dialect: "mysql"
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

For examples, please refer to the [Documentation](https://haiderwiki.bme.gatech.edu/index.php?title=How_to_use_Mousemate).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap
- [x] Release prototype for testing
- [x] Establish MVP
- [x] Build Colony Reporting 
- [x] Build User Guide


See the [open issues](https://github.gatech.edu/haider-lab/mousemate/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Jason Sebek - jason.sebek@bme.gatech.edu

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: ./images/screenshot.png
[product-gif]: ./images/demo.mp4
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MySQL]: https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white
[SQL-url]: https://www.mysql.com/
