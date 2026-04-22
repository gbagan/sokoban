import json

levels = []
for i in range(1, 185):
    level = []
    for line in open("levels/screen."+str(i)):
        line = line.strip('\n')
        if line != "":
            level.append(line)
    levels.append(level)
with open("public/levels.json", "w") as output:
    output.write(json.dumps(levels))