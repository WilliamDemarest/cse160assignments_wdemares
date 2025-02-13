import numpy as np
import random
import cv2

outfile = open("map.js", "w")
source = "../resources/map1.png"
mappic = cv2.imread(source)

map_array = np.full((32, 32), 0)

color_array = np.full((11, 4), 0.0)

for i in range(32):
    for j in range(32):
        map_array[i, j] = mappic[i, j, 0] / 25.5
        c = int(mappic[i, j, 0] / 25.5)
        color_array[c] = [c/10.0, c/10.0, c/10.0, 1.0]

outfile.write("map_array = [\n")
for i in map_array:
    outfile.write("    [")
    for j in i:
        outfile.write(F" {j},")
    outfile.write("],\n")
outfile.write("];\n\n")

outfile.write("map_color = [\n")
for i in color_array:
    outfile.write("    [")
    for j in i:
        outfile.write(F" {j},")
    outfile.write("],\n")
outfile.write("];\n")
