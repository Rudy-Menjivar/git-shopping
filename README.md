# git-shopping
![{data.license}](https://shields.io/badge/license-MIT-green)
![{data.build}](https://travis-ci.com/Rudy-Menjivar/git-shopping.svg?branch=master&status=passed)

## Description
    
 Git-Shopping is a team project involving the deployment of a fictitious E-commerce site. The site is hosted thru Heroku and uses MySQL as its database.

An API for the shopping cart was also integrated thru APICart.

## Content

* [GitHub Repository](https://github.com/Rudy-Menjivar/git-shopping/)

* <a href="https://gentle-cove-47687.herokuapp.com/" target="_blank">Git-Shopping Site</a>

* [Technologies Used](#technologies-used)

* [New Technologies Used](#new-technologies-used)

* [Team Contributions](#team-contributions)

* [Installation](#installation)

* [Usage](#usage)

* [Contributing](#contributing)

* [Tests](#tests)


## Technologies Used

* Node & Express server
* Handlebars.js as the template engine
* MySQL database with a Sequelize ORM
* Hosted by Heroku
* APICart for shopping cart integration

## New Technologies Used

* CSRF - Middleware for CSRF token creation and validation
* dotenv - Loads development environmental variables from .env file
* Helmet - Secures Express apps by setting up HTTP headers

## Team Contributions

<a href="https://github.com/Rudy-Menjivar" target="_blank">Rudy Menjivar</a>
- Ensured API keys were hidden from public view
- Integrated Handlebars template engine
- Implemented login and authentication
- Configured API & HTML Routes
- Applied MVC structure
- Git Management
- Finalized README
- Design & styling
- Code cleanup

<a href="https://github.com/RobertKoepp" target="_blank">Robert Koepp</a>
- Applied layout design, styling & additional fonts
- Configured API content for use with APICart
- Setup content for several handlebars pages
- Designed presentation content and layout
- Moved passport code to a separate file
- Researched APIs for deployment
- Code cleanup

<a href="https://github.com/Krazydev12" target="_blank">Devon Leardini</a>
- Applied hover effect on buttons
- Aligned NavBar to the right
- Design & styling
- Code cleanup

<a href="https://github.com/eluna1997" target="_blank">Emilio Luna</a>
- Researched login and authentication

## Installation

Run the following command to install the required dependencies:
```
npm install
```
  

## Usage

Run this command to invoke this application:
```
node server.js
```
  

## Contributing
    
Any community contributions will help in achieving this project's success, so any help is greatly appreciated.
    
To participate in this project, please review the following guidelines:
    
1. Create a branch for your update (after forking and cloning)
    
   `git checkout -b <branchName>`
    
2. Make changes or additions to new or existing file & stage it
    
   `git add <fileName.ext>`
    
3. Commit your file by adding comments about code enhancements
    
   `git commmit -m <your code comments>`
    
4. Push your changes with your remote branch name
    
   `git push -u origin <branchName>`
    
5. Finally, submit [feature requests and bugs](https://github.com/Rudy-Menjivar/git-shopping/issues) and open a [pull request](https://github.com/Rudy-Menjivar/git-shopping/pulls)
    

## Tests
    
For testing, run this command:
```
npm run test
```
  

## License

Copyright (c) Rudy-Menjivar. All rights reserved.
    
Licensed under the [MIT](./LICENSE.txt) license.