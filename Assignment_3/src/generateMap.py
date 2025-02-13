import numpy as np
import random

outfile = open("map.js", "w")

map_array = np.full((32, 32), 0)

for i in range(32):
    for j in range(32):
        map_array[i, j] = 1 if random.random() > 0.5 else 0

outfile.write("map_array = [\n")
for i in map_array:
    outfile.write("    [")
    for j in i:
        outfile.write(F" {j},")
    outfile.write("],\n")
outfile.write("];\n")

