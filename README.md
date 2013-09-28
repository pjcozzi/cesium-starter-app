<p align="center">
<a href="http://cesium.agi.com/">
<img src="https://github.com/AnalyticalGraphicsInc/cesium/wiki/logos/Cesium_Logo_Color.jpg" width="50%" />
</a>
</p>

A simple JavaScript starter app for building apps with [Cesium](http://cesium.agi.com/), the open-source WebGL virtual globe and map engine.  Just fork the repo and start coding.  My primary use for this is to quickly start coding at hackathons without having to setup a repo with a server, third-party includes, etc.

What's here?
* [LICENSE.md](LICENSE.md) - a license file already referencing Cesium as a third-party.  This starter app is licensed with [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) (free for commercial and non-commercial use).  You can, of course, license your code however you want.
* [node.js](node.js) - A simple node.js server for serving your Cesium app.  See the `Local server` section below.

Local server
------------

Have python installed?  If so, from the root directory run
```
python -m SimpleHTTPServer
```
Browse to `http://localhost:8000/`

No python?  Use the Cesium's node.js server.

* Install [node.js](http://nodejs.org/)
* Run `npm install connect`
* From the root directory run `node server.js`

Browse to `http://localhost:8000/`
