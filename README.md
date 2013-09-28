<p align="center">
<a href="http://cesium.agi.com/">
<img src="https://github.com/AnalyticalGraphicsInc/cesium/wiki/logos/Cesium_Logo_Color.jpg" width="50%" />
</a>
</p>

A simple JavaScript starter app for building apps with [Cesium](http://cesium.agi.com/), the open-source WebGL virtual globe and map engine.  Just fork the repo and start coding.  My primary use for this is to quickly start coding at hackathons without having to setup a repo with a server, .gitignore, Eclipse project, third-party includes, etc.

Feel free to overwrite this README.md in your repo with info on your project.

What's here?
------------

* [index.html](index.html) - A simple HTML based on Cesium's Hello World example.  Run a local web server, and browse to this file to run your app.
* [Source](Source/) - Contains [App.js](Source/App.js) which is where you add your app's code.
* [ThirdParty](ThirdParty/) - A directory for third-party libraries, which initially includes just Cesium.  See the **Upgrading Cesium** section for how to use the latest version from the Cesium repo.
* [node.js](node.js) - A simple node.js server for serving your Cesium app.  See the **Local server** section.
* [LICENSE.md](LICENSE.md) - a license file already referencing Cesium as a third-party.  This starter app is licensed with [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) (free for commercial and non-commercial use).  You can, of course, license your code however you want.
* [.project](.project) - an [Eclipse](TODO) project with [JSHint](TODO) enabled.
* [.gitignore](.gitignore) - a small list of files not to include in the git repo for you to add to as you need.

Local server
------------

Have python installed?  If so, from the root directory run
```
python -m SimpleHTTPServer
```
Browse to `http://localhost:8000/`

No python?  Use Cesium's node.js server.

* Install [node.js](http://nodejs.org/)
* From the `cesium-starter-app` root directory run
   * `npm install connect`
   * `node server.js`

Browse to `http://localhost:8000/`

Upgrading Cesium
----------------

The built Cesium source is in [ThirdParty/Cesium/](ThirdParty/Cesium/).  I sync this up with the master branch in the [Cesium repo](https://github.com/AnalyticalGraphicsInc/cesium) once in a while.  To do so with `cesium` and `cesium-starter-app` repo directories in the same parent directly:
```
cd cesium
git checkout master
git pull

./Tools/apache-ant-1.8.2/bin/ant clean combine
rm -rf ../cesium-starter-app/ThirdParty/Cesium/*
cp -R Build/Cesium/* ../cesium-starter-app/ThirdParty/Cesium/
```
Test the starter app in case any changes are needed to [index.html](index.html) or [Source/App.js](Source/App.js).

This uses the unminified version of Cesium.js, which is great for debugging but is quite large for production deployments.  To use the minified version, run `ant` with `minify` instead of `clean` before update `cesium-starter-app`:
```
./Tools/apache-ant-1.8.2/bin/ant clean minify
```
The [Cesium Contributor's Guide](TODO) has more info on Cesium build options.

Importing into Eclipse
----------------------

If you use Eclipse as your JavaScript IDE, it is easy to important the `cesium-starter-app` project into a new workspace.  In Eclipse:
* `File -> Switch Workspace -> Other`
* Select a directory for the workspace and click `OK`
* In `Package Explorer`, right click and select `Import`
* Under `General`, select `Existing Projects into Workspace` and click `Next`
* Next to `Select root directory`, click `Browse`
* Browse to the `cesium-starter-app` root directory and click `Open`
* Click `Finish`

Cesium resources
----------------

* [Tutorials](TODO)
* [Sandcastle](TODO)
* [Reference Documentation](TODO)
* [Forum](TODO)

Useful hackathon tools
----------------------

* TODO