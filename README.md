# react-spa-jwt-authentication-boilerplate

This project aims to give an opensource lean boilerplate for email based microservice authentication that can be used by both web applications as well as native applications.

Ideally, we suggest both the web apps and native apps to interact with the backend through APIs after the login. (The project aims especially SPAs.)

### Roles

* User
* Browser or Native Application (their interaction with backend should be exactly the same)
* Request Handler
* Database
* Mailer
* Lock Handler
* Validations

### Scenarios

#### Sign Up

##### Frontend Experience
![Sign Up Flowchart](./ChartsAndDiagrams/SignUp.png)
##### Process
![Sign Up Sequence Diagram](./ChartsAndDiagrams/SignUp.svg)

#### New Logins

##### Frontend Experience
![New Login Flowchart](./ChartsAndDiagrams/NewLogin.png)
##### Process
![New Login Sequence Diagram](./ChartsAndDiagrams/NewLogin.svg)

#### Remember Me Login

##### Frontend Experience
![Remember Me Flowchart](./ChartsAndDiagrams/RememberMe.png)
##### Process
![Remember Me Sequence Diagram](./ChartsAndDiagrams/RememberMe.svg)

#### Forgot Password

##### Frontend Experience
![Forgot Password Flowchart](./ChartsAndDiagrams/ForgotPassword.png)
##### Process
![Forgot Password Sequence Diagram](./ChartsAndDiagrams/ForgotPassword.svg)

#### Change Password

##### Frontend Experience
![Change Password Flowchart](./ChartsAndDiagrams/UpdatePassword.png)
##### Process
![Change Password Sequence Diagram](./ChartsAndDiagrams/UpdatePassword.svg)

#### Change Email

##### Frontend Experience
![Update Email Flowchart](./ChartsAndDiagrams/UpdateEmail.png)
##### Process
![Update Email Sequence Diagram](./ChartsAndDiagrams/UpdateEmail.svg)

#### Update User Data

##### Frontend Experience
![Update Data Flowchart](./ChartsAndDiagrams/UpdateData.png)
##### Process
![Update Data Sequence Diagram](./ChartsAndDiagrams/UpdateData.svg)


**Please be informed that this project is under development, not yet finalized and open to any contribution from opensource community.**

## Principles

Following should apply for the whole structure:

* Lean
* Authentication is done with JWT - Jason Web Tokens
* Stateless, API driven
* Microsevices
* Scalable
* Opensource
* SQL's should define the "model"
* Because of its microservices and API driven nature "view" are delegeted to SPA or native applications (they also exist in frontend and frontend-native folders)
* It must be easily cloned and when executed it should run (*) 

(*) This project uses [MySQL](https://www.mysql.com/). Because of the [license model of MySQL] (https://www.mysql.com/about/legal/licensing/oem/), if you use this boilerplate, do not distribute MySQL binaries.

## Prerequisites

* Ubuntu is prefered
* MySQL is chosen for user database

## Frontent

* Source code in ```./frontend``` directory
* Web App is generated by [create-react-app](https://github.com/facebook/create-react-app) to have all wiring ready with babel and webpack
* SPA - Single Page Application approach is used
* Redux is used to track login state
* The common library [Material UI](https://material-ui.com/) which implements [Google's material design principles](https://material.io), is used for Material Design UI components

## Frontent Native

* Source code in ```./frontend-native``` directory
* Native App is generated by [Expo](https://expo.io/) to have all wiring ready and a test suite that does not require XCode, hence Mac ownership
* Redux is used to track login state
* The common library [NativeBase](https://nativebase.io/) is used for both iOS and Android UI components

## Backend

* Source code in ```./backend``` directory
* Based on [Express](https://expressjs.com/)
* All authentication is with [JWT](https://jwt.io/) (the node library [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) is used)
* Passwords are hashed by [bcrypt](https://www.npmjs.com/package/bcrypt)
* Uses [MySQL] (https://www.mysql.com/) as the user repository database (*)
* For email uses [nodemailer](https://nodemailer.com/about/)

(*) It is completely OK if you swap the MySQL with other databases. The database scripts are in pure SQL so it should, in theory, be fine to use with other relateional database servers.

## Setup

0. Please note if you are not using MySQL, you'll need to modify database connections in the code. That is why we suggest you to setup MySQL. For a clean guide to set up MySQL for Ubuntu yo can refer [here](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04).

1. Set environment parameters for mail and relational database. If you choose to use MySQL and linux adding following lines to `~/.bashrc` file should be sufficient. (Please update username, password, etc correctly.)

```bash
############# react-spa-jwt-authentication-boilerplate #############
# JWT Secret
export JWT_SECRET="your-secret-do-not-forget-to-change"
# Mail Transporter Parameters 
export GENERIC_MAIL_SERVICE="yourmailtransporter" #Example: "gmail"
export GENERIC_MAIL_USER="yourusername" #Example: "name.surname@gmail.com"
export GENERIC_MAIL_PASSWORD="yourpassword" #Example: "Password1:-)"
# MySQL Parameters 
export MYSQL_HOST="yourhost"  #Example "localhost"
export MYSQL_USER="yourdbuser"  #Example "root"
export MYSQL_PASSWORD="yourdbpassword"  #Example "tiger"
############# react-spa-jwt-authentication-boilerplate #############
```

2. Download codes

```bash
git clone https://github.com/MehmetKaplan/react-spa-jwt-authentication-boilerplate my-authentication-app
```

3. Go to database script folder

```bash
cd my-authentication-app/backend/database
```

Skip below 2 steps, if you have another relational database system. But assure to generate a schema named AuthUsersDB and under that schema generate the objects stated in Generate_Objects.sql file.

4. Generate the schema. (You'll need to provide root password).

```bash
mysql -u root -p < Generate_Database.sql 
```

5. Generate the objects. (You'll need to provide root password).

```bash
mysql -u root -p < Generate_Objects.sql 
```

# To Use for Your Own Project

After you cloned the whole structure with following principles you can use the entire repo as your base and build your own single page web and react native applications on top of it.


## Frontend

.

## Frontend Native

* The layout of pages are components and you can find them under the ```frontend-native/components``` folder. Modifying them you can change the view of your project however you like.
* The redux store is in the ```frontend-native/redux-store.js``` file. You can update this file and use it similarly in your project.
* Under the ```frontend-native/redux-store.js``` file, there is an object named ```homeScreenComponents```. It helps you decide your navigation. Add here the name of your component with a keyname. And use same keyname to be called by a dispatcher where the new component is to be placed in the ```frontend-native/screens/HomeScreen.js```.

## Backend

.

# TO BE CONTINUED

* Sequence diagrams
* Frontend (not yet detailed)