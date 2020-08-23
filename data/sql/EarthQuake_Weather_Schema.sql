-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/OYXwQY
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE `weather` (
    `id` SERIAL  NOT NULL ,
    `lat` INT  NOT NULL ,
    `lon` INT  NOT NULL ,
    `date` DATE  NOT NULL ,
    `earthquake_id` INT  NOT NULL ,
    `location` VARCHAR(60)  NOT NULL ,
    `weather_con` VARCHAR(60)  NOT NULL ,
    `temp` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `earthquake` (
    `_id` SERIAL  NOT NULL ,
    `lat` INT  NOT NULL ,
    `lon` INT  NOT NULL ,
    `date` DATE  NOT NULL ,
    `mag` INT  NOT NULL ,
    `location` VARCHAR(60)  NOT NULL ,
    PRIMARY KEY (
        `_id`
    )
);

ALTER TABLE `weather` ADD CONSTRAINT `fk_weather_lat_lon_earthquake_id` FOREIGN KEY(`lat`, `lon`, `earthquake_id`)
REFERENCES `earthquake` (`lat`, `lon`, `_id`);

