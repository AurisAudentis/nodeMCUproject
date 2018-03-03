import rhinoscriptsyntax as rs
import re
import urllib2
import time
start = time.time()
distanceX = [0.,40.,40.,0.,0.,-40.,-40.,0.]
distanceY = [40.,0.,0.,40.,-40.,0.,0.,-40.]
distanceZ = [28.284271,28.284271,-28.284271,-28.284271,28.284271,28.284271,-28.284271,-28.284271]
response = urllib2.urlopen("http://maxiemgeldhof.com/node/raw")
text = response.read()
response.close()
print(time.time() - start)
distanceX = [x*2 for x in distanceX]
distanceY = [x*2 for x in distanceY]
distanceZ = [x*2 for x in distanceZ]

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
print(time.time() - start)

#______________________________________________

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
                #self.array = [0,0,0,0,0,0,0,0]
                    #self.array[index] += 1
                    self.move = [distanceX[index], distanceY[index], distanceZ[index]]
                     
                    getObj(node).sharePos(self.x + self.move[0], self.y + self.move[1], self.z + self.move[2])


def getObj(id):
    for node in nodes:
        if node.id == id:
            return node


def calcspots():
    nodes[0].sharePos(0., 0., 0.)

nodes = [Node(surrounding, id) for surrounding, id in zip(arrFaces, arrNodes)]
calcspots()
print(time.time() - start)
idOutput = []
pointOutput = []
for node in nodes:
    idOutput.append(node.id)
    pointOutput.append(rs.AddPoint(node.x, node.y, node.z))
print(time.time() - start)