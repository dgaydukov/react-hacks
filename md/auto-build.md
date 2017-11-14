# React Project Server AutoBuilding

You develop your react apps, and in one day you want to show it. So you build it and push to some repo. But the problem is that you have to have 2 repos, one for
source code with react, es6, jsx and one with built project.
How to avoid this problem - The answer is build app on you production server.

### How it works
In you server you have a directory with production build. Every time you push a new commit, you server run builder, that builds your react app