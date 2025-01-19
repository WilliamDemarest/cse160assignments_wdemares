import cv2
import numpy as np
name = "garf"
source = name + ".png"
outpath = name + "_machine.js"

image = cv2.imread(source)
print(len(image))

cells = 80

canvas_size = 400

cell_size = canvas_size / cells

cell_xsize = int(float(len(image)) / float(cells))+1
cell_ysize = int(float(len(image[0])) / float(cells))+1

canvas = np.full((cells, cells, 3, 2), 0)

for i in range(len(image)):
    for j in range(len(image[i])):
        for k in range(3):
            #print(str(j) + " " + str(cell_size))
            x = int(i / cell_xsize)
            y = int(j / cell_ysize)
            #print(str(x) + " " + str(y))
            # canvas[cells-x-1, cells-y-1, k, 0] += image[i, j, k]
            # canvas[cells-x-1, cells-y-1, k, 1] += 1
            canvas[y, x, k, 0] += image[i, j, k]
            canvas[y, x, k, 1] += 1

c = 0

for x in range(len(canvas)):
    for y in range(len(canvas[x])):
        for k in range(3):
            #print(len(canvas))
            #print(str(x) + " " + str(y) + " " + str(k))
            if (canvas[x, y, k, 1] > 0):
                canvas[x, y, k, 0] = canvas[x, y, k, 0] / canvas[x, y, k, 1]
    #print(canvas[x, y])

outfile = open(outpath, "w")

outfile.write("function " + name + "_machine() { \n  let circle = new Circle();\n")
for x in range(len(canvas)):
    for y in range(len(canvas[x])):
        outfile.write("  circle.position = [" +
            str((x-(cells*0.5))/(cells*0.5)) + ", " +
            str(((-1*y)+(cells*0.5))/(cells*0.5)) + ", 0.0];\n")
        outfile.write("  circle.color = [" + 
            str(canvas[x, y, 2, 0]/255.0) + ", " +
            str(canvas[x, y, 1, 0]/255.0) + ", " +
            str(canvas[x, y, 0, 0]/255.0) + ", 1.0];\n")
        outfile.write("  circle.size = " + str(cell_size/2) +";\n")
        outfile.write("  circle.render();\n")
        outfile.write("\n")
outfile.write("}")


# lines = np.full((40, 40), "/")
# for x in range(len(canvas)):
#     for y in range(len(canvas[x])):
#         if (canvas[x, y, k, 0] > 100):
#             lines[x, y] = "@"

# for line in lines:
#     for c in line:
#         print(c, end="")
#     print(" ")

