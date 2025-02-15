import numpy as np
import random
import cv2

def shortest_neighbor(i, j, map_array):
    n_heights = []
    if (i > 0):
        n_heights.append(map_array[i-1, j, 0])

    if (i < 31):
        n_heights.append(map_array[i+1, j, 0])

    if (j > 0):
        n_heights.append(map_array[i, j-1, 0])

    if (j < 31):
        n_heights.append(map_array[i, j+1, 0])

    return min(n_heights)

outfile = open("map.js", "w")
source = "../resources/map1.png"
mappic = cv2.imread(source)

map_array = np.full((32, 32, 2), 0)

#color_array = np.full((11, 4), 0.0)
color_array = [
    [1*0.6, 0.949*0.6, 0.74*0.6, 1],
    [1*0.7, 0.949*0.7, 0.74*0.7, 1],
    [1*0.8, 0.949*0.8, 0.74*0.8, 1],
    [1*0.9, 0.949*0.9, 0.74*0.9, 1],
    [1, 0.949, 0.74, 1],
    [0.1, 0.7,0.1, 1],
    [0.2, 0.8, 0.2, 1],
    [0.5, 1, 0.5, 1],
    [0.7, 0.7, 0.7, 1],
    [0.4, 0.4, 0.4, 1],
    [0.4, 0.4, 0.4, 1],
]

for i in range(32):
    for j in range(32):
        map_array[i, j, 0] = mappic[i, j, 0] / 25.5
        #c = int(mappic[i, j, 0] / 25.5)
        #color_array[c] = [c/10.0, c/10.0, c/10.0, 1.0]

for i in range(32):
    for j in range(32):
        map_array[i, j, 1] = shortest_neighbor(i, j, map_array)

outfile.write("map0_array = [\n")
for i in map_array:
    outfile.write("    [")
    for j in i:
        outfile.write(F" [{j[0]}, {j[1]}, {1 if random.random() > 0.9 else 0}],")
    outfile.write("],\n")
outfile.write("];\n\n")

outfile.write("map0_color = [\n")
for i in color_array:
    outfile.write("    [")
    for j in i:
        outfile.write(F" {j},")
    outfile.write("],\n")
outfile.write("];\n\n")


#----------------------------------- do it again for the next map
source = "../resources/mazeMap.png"
mappic = cv2.imread(source)

map_array = np.full((32, 32, 2), 0)

#color_array = np.full((11, 4), 0.0)
color_array = [
    [1, 0.949, 0.74, 1],
    [0.1, 0.7,0.1, 1],
    [0.1, 0.7,0.1, 1],
    [0.1, 0.7,0.1, 1],
]

for i in range(32):
    for j in range(32):
        map_array[i, j, 0] = 2 if mappic[i, j, 0] > 120 else 0
        #c = int(mappic[i, j, 0] / 25.5)
        #color_array[c] = [c/10.0, c/10.0, c/10.0, 1.0]

for i in range(32):
    for j in range(32):
        map_array[i, j, 1] = shortest_neighbor(i, j, map_array)

outfile.write("map1_array = [\n")
for i in map_array:
    outfile.write("    [")
    for j in i:
        outfile.write(F" [{j[0]}, {j[1]}, {1 if random.random() > 0.9 else 0}],")
    outfile.write("],\n")
outfile.write("];\n\n")

outfile.write("map1_color = [\n")
for i in color_array:
    outfile.write("    [")
    for j in i:
        outfile.write(F" {j},")
    outfile.write("],\n")
outfile.write("];\n")
