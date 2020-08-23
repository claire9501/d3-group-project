# Dependencies
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
# Go to existing database with automap_base
from sqlalchemy.ext.automap import automap_base
# Work through mapper to use python code
from sqlalchemy.orm import Session, relationship
# Inspect with python
from sqlalchemy import create_engine, inspect
# Allow us to declare column types
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, desc
from sqlalchemy.ext.declarative import declarative_base
import datetime
import pandas as pd
import numpy as np
import json


def update_weather(lat_search):
    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base = declarative_base()
    ## Class base template to upload to sqlite
    class WeatherSeries(Base):
        __tablename__ = 'weatherSeries'

        id = Column(Integer, primary_key=True)
        city = Column(String(50))
        country = Column(String(200))
        region = Column(String(80))
        avgtemp = Column(Float)
        date = Column(String(12))
        date_epoch = Column(Float)
        maxtemp = Column(Float)
        mintemp = Column(Float)
        sunhour = Column(Float)
        totalsnow = Column(Float)
        uv_index = Column(Float)
        magnitude = Column(Float)
        place = Column(String(80))
        lat = Column(String(12))
        long = Column(String(12))

    # Create Database Connection
    # ----------------------------------
    # Creates a connection to our DB
    # Engine opens the door. Conn is the walk through sign
    engine = create_engine("sqlite:///earthquake_weather.sqlite")
    conn = engine.connect()
    # Create a "Metadata" Layer That Abstracts our SQL Database
    # ----------------------------------
    # Create (if not already in existence) the tables associated with our classes.
    Base.metadata.create_all(engine)
    # Create a Session Object to Connect to DB
    # ----------------------------------
    session = Session(bind=engine)

    def weatherTimeSeries(query_call):
        Base = automap_base()
        Base.prepare(engine, reflect=True)
        # Check db table names
        # Base.classes.keys()
        weather_table = Base.classes.weatherSeries
        weather_container = session.query(weather_table).filter(weather_table.lat == query_call).all()
        weather_data = []


        def spellDate(datestring):
            date_time_obj = datetime.datetime.strptime(datestring, '%Y-%m-%d')
            month_name = date_time_obj.strftime("%B")
            day = date_time_obj.strftime("%d")
            year = date_time_obj.strftime("%Y")

            month_day = month_name + " " + day
            month_day_year = month_name + " " + day + ", " + year

            date = {
                "month_day": month_day,
                "month_day_year": month_day_year,
            }
            return date  

        for data in weather_container:
            date_date = data.date
            date_to_pass = spellDate(date_date)
            container = {
                "city": data.city, 
                "country": data.country, 
                "region": data.region, 
                "avgtemp": data.avgtemp, 
                "date": date_to_pass, 
                "date_epoch": data.date_epoch, 
                "maxtemp": data.maxtemp, 
                "mintemp": data.mintemp, 
                "sunhour": data.sunhour, 
                "totalsnow": data.totalsnow, 
                "uv_index": data.uv_index, 
                "magnitude": data.magnitude, 
                "place": data.place, 
                "lat": data.lat, 
                "long": data.long
            }
            weather_data.append(container)
        return weather_data

    latitude = lat_search
    weather_data = weatherTimeSeries(latitude)

        
    # Return results
    return weather_data




#################################################################
## Facts 
##################################################################

def aboveSixQuakeCall():
    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base = declarative_base()
    ## Class base template to upload to sqlite
    class WeatherSeries(Base):
        __tablename__ = 'weatherSeries'

        id = Column(Integer, primary_key=True)
        city = Column(String(50))
        country = Column(String(200))
        region = Column(String(80))
        avgtemp = Column(Float)
        date = Column(String(12))
        date_epoch = Column(Float)
        maxtemp = Column(Float)
        mintemp = Column(Float)
        sunhour = Column(Float)
        totalsnow = Column(Float)
        uv_index = Column(Float)
        magnitude = Column(Float)
        place = Column(String(80))
        lat = Column(String(12))
        long = Column(String(12))

    # Create Database Connection
    # ----------------------------------
    # Creates a connection to our DB
    # Engine opens the door. Conn is the walk through sign
    engine = create_engine("sqlite:///earthquake_weather.sqlite")
    conn = engine.connect()
    # Create a "Metadata" Layer That Abstracts our SQL Database
    # ----------------------------------
    # Create (if not already in existence) the tables associated with our classes.
    Base.metadata.create_all(engine)
    # Create a Session Object to Connect to DB
    # ----------------------------------
    session = Session(bind=engine)

    def aboveSixQuake():
        Base = automap_base()
        Base.prepare(engine, reflect=True)
        # Check db table names
        # Base.classes.keys()
        weather_table = Base.classes.weatherSeries
        weather_container = session.query(weather_table).filter(weather_table.magnitude > 6).all()
        weather_highesteq = session.query(weather_table).order_by(desc(weather_table.magnitude)).order_by(desc(weather_table.date)).limit(4).all()

        weather_facts = []
        magnitude_list = []
        count = 0
        magnitude_keep = 6

        for data in weather_highesteq:
            magnitude = data.magnitude
            # Get highest recorded earthquake
            if data.magnitude > magnitude_keep:
                magnitude_keep = data.magnitude
                                
                location = data.country
                city = data.city
                temp_low = data.mintemp
                temp_high = data.maxtemp
                avg_temp_at_time = data.avgtemp
                date = data.date
                magnitude = magnitude_keep
            else:
                continue



        # Counter
        for data in weather_container:
            count += 1

        def spellDate(datestring):
            date_time_obj = datetime.datetime.strptime(datestring, '%Y-%m-%d')
            month_name = date_time_obj.strftime("%B")
            day = date_time_obj.strftime("%d")
            year = date_time_obj.strftime("%Y")

            month_day = month_name + " " + day
            month_day_year = month_name + " " + day + ", " + year

            date = {
                "month_day": month_day,
                "month_day_year": month_day_year,
            }
            return date  

  
        # Get avgtemp from list        
        # def Average(lst): 
        #     return sum(lst) / len(lst) 
        # quake_avg = Average(magnitude_list)


        spell_dates = spellDate(date)
        
        container = {
            "count": count, 
            # "avgtemp": quake_avg,
            "highest_magnitude": magnitude_keep, 
            "highest_city": city,
            "highest_location": location,
            "temp_low": temp_low,
            "temp_high": temp_high,
            "avg_temp_at_time": avg_temp_at_time,
            "date": spell_dates,
            
        }
        weather_facts.append(container)
        return weather_facts

    weather_facts = aboveSixQuake()

    # Return results
    return weather_facts


#################################################################
## Facts - Latest Quake
##################################################################

def latestQuakesCall():
    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base = declarative_base()
    ## Class base template to upload to sqlite
    class WeatherSeries(Base):
        __tablename__ = 'weatherSeries'

        id = Column(Integer, primary_key=True)
        city = Column(String(50))
        country = Column(String(200))
        region = Column(String(80))
        avgtemp = Column(Float)
        date = Column(String(12))
        date_epoch = Column(Float)
        maxtemp = Column(Float)
        mintemp = Column(Float)
        sunhour = Column(Float)
        totalsnow = Column(Float)
        uv_index = Column(Float)
        magnitude = Column(Float)
        place = Column(String(80))
        lat = Column(String(12))
        long = Column(String(12))

    # Create Database Connection
    # ----------------------------------
    # Creates a connection to our DB
    # Engine opens the door. Conn is the walk through sign
    engine = create_engine("sqlite:///earthquake_weather.sqlite")
    conn = engine.connect()
    # Create a "Metadata" Layer That Abstracts our SQL Database
    # ----------------------------------
    # Create (if not already in existence) the tables associated with our classes.
    Base.metadata.create_all(engine)
    # Create a Session Object to Connect to DB
    # ----------------------------------
    session = Session(bind=engine)

    def latestQuakes():
        Base = automap_base()
        Base.prepare(engine, reflect=True)

        weather_table = Base.classes.weatherSeries
        weather_container = session.query(weather_table).order_by(desc(weather_table.date)).limit(5).all()
        weather_facts5 = []
        weather_facts5_done = []
        def spellDate(datestring):
            date_time_obj = datetime.datetime.strptime(datestring, '%Y-%m-%d')
            month_name = date_time_obj.strftime("%B")
            day = date_time_obj.strftime("%d")
            year = date_time_obj.strftime("%Y")

            month_day = month_name + " " + day
            month_day_year = month_name + " " + day + ", " + year

            date = {
                "month_day": month_day,
                "month_day_year": month_day_year,
            }
            return date  

        for data in weather_container:

            spell_dates = spellDate( data.date)

            container = {
            "date": spell_dates, 
            "country": data.country,
            "region": data.region,
            "magnitude": data.magnitude,
            "maxtemp": data.maxtemp,
            "mintemp": data.mintemp, 
            "avgtemp": data.avgtemp,
            }
            weather_facts5.append(container)
        
        return weather_facts5

    weather_facts5 = latestQuakes()

    # Return results
    return weather_facts5



#################################################################
## Analysis Chart
##################################################################

def analysisChartCall():
    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base = declarative_base()
    ## Class base template to upload to sqlite
    class WeatherSeries(Base):
        __tablename__ = 'weatherSeries'

        id = Column(Integer, primary_key=True)
        city = Column(String(50))
        country = Column(String(200))
        region = Column(String(80))
        avgtemp = Column(Float)
        date = Column(String(12))
        date_epoch = Column(Float)
        maxtemp = Column(Float)
        mintemp = Column(Float)
        sunhour = Column(Float)
        totalsnow = Column(Float)
        uv_index = Column(Float)
        magnitude = Column(Float)
        place = Column(String(80))
        lat = Column(String(12))
        long = Column(String(12))

    # Create Database Connection
    # ----------------------------------
    # Creates a connection to our DB
    # Engine opens the door. Conn is the walk through sign
    engine = create_engine("sqlite:///earthquake_weather.sqlite")
    conn = engine.connect()
    # Create a "Metadata" Layer That Abstracts our SQL Database
    # ----------------------------------
    # Create (if not already in existence) the tables associated with our classes.
    Base.metadata.create_all(engine)
    # Create a Session Object to Connect to DB
    # ----------------------------------
    session = Session(bind=engine)

    def analysisChart():    
        Base = automap_base()
        Base.prepare(engine, reflect=True)
        weather_table = Base.classes.weatherSeries
        analysis_container = session.query(weather_table).order_by(desc(weather_table.date)).all()        
        analysis_list_temp = []
        x=1

        for data in analysis_container:
            # get specific data from db
            container = {
                "date": data.date,
                "magnitude": data.magnitude,
                "maxtemp": data.maxtemp,
                "mintemp": data.mintemp,
        #         "avgtemp": data.avgtemp,
                "lat": data.lat,
                }
            analysis_list_temp.append(container)

        # Create df for parsing    
        temp_df = pd.DataFrame(analysis_list_temp)
        # Sort by lat and date, reset index
        temp_df = temp_df.sort_values(by=['lat', 'date'], ascending=False).reset_index(drop=True)

        # Make copy of df, remove 2nd and 3rd log keeping 1st and 4th log of one eq entry.
        run_df = temp_df.copy()
        while x < len(temp_df.index):
            run_df=run_df.drop(x)
            x+=1
            run_df=run_df.drop(x)
            x+=3

        # Reset index 
        run_df = run_df.reset_index(drop=True) 

        # get difference of weather change from day of eq and few days before
        i = 0
        new_col = []
        # Icon list will tell style which icon to display
        icon_list = []
        while i < len(run_df.index):
        #     for data in run_df.index:
            first = run_df.iloc[i,2]
            second = run_df.iloc[i+1, 2]
            difference = first - second
            new_col.append(difference)
            new_col.append(difference)
            i+=2

        # Add new list to df as a new column  
        run_df['difference'] = new_col  


        # Remove duplicates
        run_df2 = run_df.copy()
        v = 1
        while v < len(run_df.index):
            run_df2=run_df2.drop(v)
            v+=2





        # Count up, nochange, down
        up_count = 0
        nochange_count = 0
        down_count = 0
        for x in run_df2['difference']:
            if x > 0:
                icon = "up"
                up_count+=1
                icon_list.append(icon)
            elif x == 0:
                icon = "nochange"
                nochange_count+=1
                icon_list.append(icon)
            else:
                icon = "down"
                down_count+=1
                icon_list.append(icon)

        # Add new list to df as a new column
        run_df2['icon'] = icon_list    
        # select only the columns we need
        run_df2 = run_df2[['date','magnitude','lat','difference','icon']]

        # # Turn df into list of tuples
        records = run_df2.to_records(index=False)
        analysis_chart = list(records)

        # Create list of tuple
        analysis_list = []
        for data in analysis_chart:
            container2 = {
                "date": data.date, 
                "magnitude": data.magnitude, 
                "lat": data.lat, 
                "difference": data.difference, 
                "icon": data.icon,
                }
            analysis_list.append(container2)

        diff_count = len(run_df2['difference'])
        above_percentage = "{:.0%}".format(up_count / diff_count)
        atzero_percentage = "{:.0%}".format(nochange_count / diff_count)
        belowzero_percentage = "{:.0%}".format(down_count / diff_count)
        container3 = {
                    "abovezero": up_count,
                    "abovezeropercent": above_percentage,
                    "atzero": nochange_count, 
                    "atzeropercent": atzero_percentage, 
                    "belowzero": down_count, 
                    "belowzeropercent": belowzero_percentage,
                    }

        analysis_list.append(container3)     
        return analysis_list

    analysis_list = analysisChart()
    return analysis_list
