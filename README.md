# DigiReceipt
A project built for the 400 level Cybersecurity course (CPEN 442) at UBC

# Design Project

This project won the award of "Best Design Project" among 4th years bestowed by Konstantin Beznosov, a UBC Computer Engineering Professor. 

Outline of this project can be found in a Youtube Video [here](https://www.youtube.com/watch?v=yRzMnziT6js), which was submitted to the mini conference occurring at UBC to showcase our project and presentation to various jury members.

Link to the mini conference - [here](https://blogs.ubc.ca/cpen442/mini-conference/schedule/)


# Reasoning behind this project 
Management of receipts is an issue faced by most people these days as they try to navigate the inconvenience of piles of paper copies and the concern of providing email addresses for digital copies. Furthermore, most formats in which receipts are issued do not account for the risks associated with receipt fraud which can significantly damage the revenue of merchants. DigiReceipt is a digital system designed to serve two purposes. On one end it provides strong privacy guarantees as it does not require any user information such as email or phone number to track digital copies of purchases. On the other end, it is built so as to avoid receipt fraud based on refreshing and encrypted QR codes. 

## For More Information

If you would like to know more regarding this project and how cyber security solutions were implemented to overcome this challenge described above, follow the link [here](https://drive.google.com/file/d/1htzXISls0iod9ojlBo3Omlw58cwUJszf/view?usp=share_link).

## Frontend Setup
Follow the installation instructions [here](https://flutter.dev/?gad_source=1&gclid=Cj0KCQjw2a6wBhCVARIsABPeH1vYbEcEqSg32x7elmsDfcpha2lXGbhK-wa9UCYa9u3dh7X8fG5hbQ0aApkFEALw_wcB&gclsrc=aw.ds) to get the Flutter SDK and Dart installed on your machine and ensure you also have a simulator available. By default you should be able to run the app on Chrome but you can also look into getting an iOS or Android simulator.

Start your simulator and then run `flutter run` to launch the app, or alternatively `flutter run -d chrome` to run on Chrome.

## Backend Setup
The backend of DigiReceipt is built using the Flask framework and runs on top of a PostgreSQL database. Installation instructions for the backend are given below:

### PostgreSQL
To install PostgreSQL you will need to follow the installation instructions based on the OS on which you are running as described [here](https://www.postgresql.org/download/).

If you are using MacOS it is suggested you install using Homebrew and then start it as a service. Below V denotes the version that was installed (likely this will be @14)

```
brew install postgresql
brew services start postgresql@V
```

Now we prepare our database for our application like shown below. You need to create a .env file under the `/backend` directory. You can set your environment variables like you want but for ease I recommend you use the following. During deployment, the JWT_SECRET_KEY ought to be set to something secure.

```
DB_USERNAME = 'caesar'
DB_PASSWORD = 'caesar'
DB_NAME = 'digireceipt'
JWT_SECRET_KEY = 'secretJWTtoken''
```

Now connect to PSQL from a command line by entering `psql -U <DB_USERNAME> -d <DB_NAME>` and create the user and database for our application as following. It is important that you use the constants set on your .env file because those are needed to set up the connection to the database from the Flask backend as well.

```
psql postgres
CREATE ROLE <DB_USERNAME> WITH LOGIN PASSWORD '<DB_PASSWORD>';
CREATE DATABASE <DB_NAME> WITH OWNER <DB_USERNAME>;
```

### Backend Dependencies
It is highly encouraged to install the project dependencies via virtual environments for better isolation:

First create a virtual environment and activate it:

```
############### MacOS ###############
python3 -m venv env
source env/bin/activate
#####################################

############## Windows ##############
python -m venv env
env\Scripts\activate
#####################################
```

Install all dependencies by running `pip install -r requirements.txt`

### Run Backend
To run the server you can run from your shell where the virtual environment is active `python app.py`. Then visit `http://localhost:5000/` on your local browser and confirm you see `Hello, World` printed.
You should confirm the database connection with this statement from your active shell: *"Database connection established successfully"*
