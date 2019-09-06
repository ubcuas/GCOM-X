#!/usr/bin/env python3

import json
import sys
import os
from pprint import pprint

SECTIONS = ['home_pos', 'air_drop_pos', 'emergent_last_known_pos', 'off_axis_odlc_pos',
            'odlcs', 'stationary_obstacles', 'fly_zones', 'mission_waypoints', 'search_grid_points']

if len(sys.argv) != 3:
    print("Usage: ./mission_generator.py [mission file] [output fixture name]")
    exit(1)

if os.path.exists(sys.argv[2]):
    print("Error: output file already exists")
    exit(1)

mission_file = open(sys.argv[1], 'r')
parser = json.loads(mission_file.read())
mission_file.close()

extra_sections = list(set(parser.keys()).difference(set(SECTIONS)))
missing_sections = list(set(SECTIONS).difference(set(parser.keys())))

if len(extra_sections) > 0:
    print("Error: Extra section(s):")
    pprint(extra_sections)
    exit(1)

if len(missing_sections) > 0:
    print("Error: Missing section(s):")
    pprint(missing_sections)
    exit(1)


data = {
    "auvsi_suas.gpsposition": [],
    "auvsi_suas.aerialposition": [],
    "auvsi_suas.waypoint": [],
    "auvsi_suas.flyzone": [],
    "auvsi_suas.stationaryobstacle": [],
    "auvsi_suas.odlc": [],
    "auvsi_suas.missionconfig": [{
        "fly_zones": [],
        "mission_waypoints": [],
        "search_grid_points": [],
        "stationary_obstacles": [],
        "odlcs": [],
    }]
}


def add_and_get_index(item, data_list):
    """Adds an item to the list if it does not already exist and returns the index of the item
    
    Arguments:
        item {*} -- Item to add to the list
        data_list {list} -- list to modify
    
    Returns:
        int -- index of the item in the list
    """
    try:
        return data_list.index(item) + 1
    except ValueError:
        data_list.append(item)
        return len(data_list)


def add_and_get_gps(gps_data):
    """Adds a new GPS object to the GPS list if it does not already exist and returns
    the index of the GPS object in the list
    
    Arguments:
        gps_data {list} -- GPS data in the form of [lat, lon]
    
    Returns:
        int -- index of the GPS object in the GPS list
    """
    gps = {
        "latitude": gps_data[0],
        "longitude": gps_data[1]
    }

    return add_and_get_index(gps, data["auvsi_suas.gpsposition"])


def add_and_get_aerial(aerial_data):
    """Adds a new AerialPosition object to the AerialPosition list if it does not already exist,
    and returns the index of the AerialPosition object in the list
    
    Arguments:
        aerial_data {list} -- AerialPosition in the form of [lat, lon, alt]
    
    Returns:
        int -- index of the AerialPosition object in the AerialPosition list
    """
    gps_index = add_and_get_gps(aerial_data[:2])

    aerial = {
        "altitude_msl": aerial_data[2],
        "gps_position": gps_index,
    }

    return add_and_get_index(aerial, data["auvsi_suas.aerialposition"])


def try_parsing(name):
    """Decorator that prints out an error message and exits the program if an exception is thrown
    
    Arguments:
        name {str]} -- Name of element to parse
    
    Returns:
        function -- decorated function
    """
    def h(f):
        def g():
            try:
                f()
            except Exception as e:
                print("Error while parsing " + name + ": " + str(e))
                exit(1)
        return g
    return h


def check_data(data, name, length, data_types):
    """Verifies a list has the correct length and types
    
    Arguments:
        data {list} -- list to verify
        name {str} -- name of the list
        length {int} -- expected length of the list
        data_types {tuple} -- tuple of valid types
    
    Raises:
        ValueError: If the list has an incorrect length or any element has an invalid type
    
    Returns:
        list -- the list if it is valid
    """
    if len(data) != length or any([not isinstance(x, data_types) for x in data]):
        raise ValueError("Invalid " + name + " data")
    return data


# Parse 'home_pos', 'air_drop_pos', 'emergent_last_known_pos', 'off_axis_odlc_pos'
for section in SECTIONS[:4]:
    @try_parsing(section)
    def parse_pos():
        data["auvsi_suas.missionconfig"][0][section] = add_and_get_gps(
            check_data(parser[section], "GPS", 2, (int, float))
        )
    parse_pos()


# Parse 'stationary_obstacles'
for obstacle in parser["stationary_obstacles"]:
    @try_parsing("stationary_obstacles")
    def parse_stationary_obstacles():
        check_data(obstacle, "obstacle", 4, (int, float))
        data["auvsi_suas.stationaryobstacle"].append({
            "cylinder_height": obstacle[0],
            "cylinder_radius": obstacle[1],
            "gps_position": add_and_get_gps(obstacle[2:4]),
        })
    parse_stationary_obstacles()


# Parse 'fly_zones'
@try_parsing("fly_zones")
def parse_flyzones():
    for zone in parser["fly_zones"]:
        flyzone_alt = check_data(zone["altitudes"], "altitudes", 2, (int, float))
        flyzone = {
            "altitude_msl_min": flyzone_alt[0],
            "altitude_msl_max": flyzone_alt[1],
            "boundary_pts": list(map(lambda aerial_data: \
                add_and_get_aerial(
                    check_data(aerial_data, "aerial", 3, (int, float))
                ), zone["aerial"])
            )
        }
        data["auvsi_suas.flyzone"].append(flyzone)
    data["auvsi_suas.missionconfig"][0]["fly_zones"].append(
        len(data["auvsi_suas.missionconfig"][0]["fly_zones"]) + 1
    )
parse_flyzones()


# Parse 'mission_waypoints', 'search_grid_points'
for section in SECTIONS[7:]:
    @try_parsing(section)
    def parse_waypoints():
        for aerial_data in parser[section]:
            data["auvsi_suas.missionconfig"][0][section].append(
                add_and_get_aerial(check_data(aerial_data, "aerial", 3, (int, float)))
            )
    parse_waypoints()


# waypoints are simply just aerialpositions
data["auvsi_suas.waypoint"] = list(map(lambda pos : {
    "order": pos,
    "position": pos,
},
    range(1, len(data["auvsi_suas.aerialposition"]) + 1)
))

# Mission stationary obstacles
data["auvsi_suas.missionconfig"][0]["stationary_obstacles"] = \
    list(range(1, len(data["auvsi_suas.stationaryobstacle"]) + 1))

pprint(data)

# Generate fixture
fixtures = []
for key in data:
    for (i, value) in enumerate(data[key]):
        fixtures.append({
            "model": key,
            "pk": i + 1,
            "fields": value,
        })

# Write fixture to file
out = open(sys.argv[2], "w")
out.write(json.dumps(fixtures, indent=4))
out.close()

