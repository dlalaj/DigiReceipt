# DigiReceipt
A project built for the 400 level Cybersecurity course (CPEN 442) at UBC

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
