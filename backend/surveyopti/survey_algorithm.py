import random
import math

WAYPOINT = []

def acceptanceProbability(energy, newEnergy, temp):
    if newEnergy < energy:
        return 1
    return math.exp((energy-newEnergy)/temp)

def shortestPathAnnealing(waypoints):
    temp = 1000
    coolingRate = 0.003
    length = len(waypoints)
    distance = totalDistance(waypoints)
    bestWaypoints = waypoints.copy()
    while temp > 1:
        newWaypoints = waypoints.copy()
        a = random.sample(range(1,length-1), 2)
        newWaypoints = swapPosition(newWaypoints, a[0], a[1])
        distance2 = totalDistance(newWaypoints)
        if distance2 < totalDistance(bestWaypoints):
            bestWaypoints = newWaypoints.copy()
        randomNum = random.random()
        accProb = acceptanceProbability(distance, distance2, temp)
        if accProb > randomNum:
            distance = distance2
            waypoints = newWaypoints.copy()
        temp *= 1 - coolingRate
    return totalDistance(bestWaypoints), bestWaypoints

def isCrossing(pointA1, pointA2, pointB1, pointB2):
    if orientation(pointA1, pointA2, pointB1) == orientation(pointA1, pointA2, pointB2):
        return False
    return True

# Determines orientation of 3 points going from p --> q --> r
# 0 - Colinear (Doesn't take colinear into account since very unlikely)
# 1 - Clockwise
# 2 - Anti-clockwise
def orientation(p, q, r):
    value = (q[1] - p[1])*(r[0]-q[0])-(q[0]-p[0])*(r[1]-q[1])
    return 1 if (value > 0) else 2

def swapPosition(_waypoints, pos1, pos2):
    _waypoints[pos1], _waypoints[pos2] = _waypoints[pos2], _waypoints[pos1]
    return _waypoints

def totalDistance(_waypoints):
    length = len(_waypoints)
    a = 0
    distance = 0
    while a < length - 1:
        current = notTotalDistance(_waypoints[a], _waypoints[a+1])
        distance += current
        a += 1
    return distance

def notTotalDistance(start, end):
    return math.sqrt((start[1]-end[1])**2 + (start[0] - end[0])**2)

def takeBestResult():
    global WAYPOINT
    _waypoint = WAYPOINT.copy()
    lowest, lowestWaypoints = shortestPathAnnealing(_waypoint)
    x = 0
    while x < 5:
        _waypoint = WAYPOINT.copy()
        current, currentWaypoints = shortestPathAnnealing(_waypoint)
        if(current < lowest):
            lowest = current
            lowestWaypoints = currentWaypoints
        x += 1
    return lowest

def printWaypoints():
    lowestWaypoints = waypoint
    for y in lowestWaypoints:
        string = str(y)
        print(string)

def calculate(pointsList):
    global WAYPOINT
    WAYPOINT = pointsList
    return shortestPathAnnealing(WAYPOINT)
