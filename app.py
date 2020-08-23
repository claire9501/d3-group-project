import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
# from data.py.classes_app import createWeatherClass,createEarthquakeClass
import os
from flask import Flask, jsonify, render_template,request,redirect
from flask_sqlalchemy import SQLAlchemy
import update_data


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Database Setup
# #################################################

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///data/py/earthquake_weather.sqlite"

# # Remove tracking modifications
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

# group_project_db = createWeatherClass(db)

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///earthquake_weather.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
weather_earthquake = Base.classes.weatherSeries


#################################################
# Flask Routes
#################################################

# Main
@app.route('/')
def test_page():
    # look inside `templates` and serve `index.html`
    return render_template('index.html')

# Weather data call
@app.route("/site/update/<weather_data_get>")
def weatherDataRetrieve(weather_data_get):

    print(weather_data_get)
    weather_data = update_data.update_weather(weather_data_get)
    return jsonify(weather_data)


# Generate Facts
@app.route("/site/facts")
def factBoxes():
    weather_facts = update_data.aboveSixQuakeCall()
    return jsonify(weather_facts)
    

# Get latest quakes
@app.route("/site/factsLatestQuake")
def factBoxLatestQuake():

    weather_facts5 = update_data.latestQuakesCall()
    return jsonify(weather_facts5)

# Generate Analysis
@app.route("/site/chart")
def analysisChartRetrieve():

    analysis_list = update_data.analysisChartCall()
    return jsonify(analysis_list)

if __name__ == "__main__":
    app.run(debug=True)
