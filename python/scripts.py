import re
import urllib2

response = urllib2.urlopen("http://maxiemgeldhof.com/node/raw")
text = response.read()
response.close()
print(text)

arrNodes = []
arrFaces = []
text = re.sub(";", "\n", text)
for line in text.split():
    id = int(re.sub(":.*", "", line))
    line = re.sub("^[0-9]*:", "", line)
    surrounding = []
    for number in re.sub(",", " ", line).split():
        surrounding.append(int(number))
    arrNodes.append(id)
    arrFaces.append(surrounding)


class Node:
    x=None
    y=None
    z=None
    id=None
    surrounding = []
    def __init__(self,surrounding, id):
        self.surrounding = surrounding
        self.id = id

    def getCoord(self):
        return self.x, self.y, self.z

    def sharePos(self,x,y,z):
        if self.x is None:
            self.x = x
            self.y = y
            self.z = z
            for index, node in enumerate(self.surrounding):
                if node != 0:
                    self.array = [0,0,0,0,0,0,0,0]
                    self.array[index] += 1
                    getObj(node).sharePos(self.x + self.array[3] - self.array[2], self.y + self.array[4] - self.array[5], self.z + self.array[0] - self.array[1])


def getObj(id):
    for node in nodes:
        if node.id == id:
            return node


def calcspots():
    nodes[0].sharePos(0, 0, 0)

nodes = [Node(surrounding, id) for surrounding, id in zip(arrFaces, arrNodes)]

calcspots()

for node in nodes:
    print(node.id, (node.x, node.y, node.z))
