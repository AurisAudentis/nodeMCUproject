# Responsive Architecture: A NodeDev Project
This is the repository for the responsive architecture nodedev project. It contains subfolders for the different elements of the project.

This project is aimed at unifying the architectural and digital world, by using microprocessors and sensors that connect to a central server, which allows the self-built
structure to be directly modelled on the computer, and also respond to any input a person might give.


### MVC
To facilitate this, the project is built following an MVC paradigm:
We use the NodeDEV arduino board units to form the controller by having these nodes collect info about their surroundings (neighbors, sensors, actions taken...) and communicate this to the server.
In this way, the server gets to know about all actions taken, and can respond accordingly. These nodes also have the ability to respond at command of the server, by
utilizing their GPIO pins.

The Model is supported by a Node.js backend, utilizing express.js and mongo.db to create an API which allows the Nodes to communicate current statuses, and the views to request the current info stored
in the server.

The View then makes use of this Model to determine the Nodes' relative position to each other which enables it to render an accurate 3D model. We've made a render in p5.js in the browser and one using Grasshopper in Rhinoceros, making use of Python scripts.
