<p align="center">
<a href="http://cesium.agi.com/">
<img src="https://github.com/AnalyticalGraphicsInc/cesium/wiki/logos/Cesium_Logo_Color.jpg" width="50%" />
</a>
</p>

A simple JavaScript starter app for creating apps with [Cesium](http://cesium.agi.com/), the open-source WebGL virtual globe and map engine.  Just fork this repo and start coding.

**Cesium version**: [b26](http://cesiumjs.org/downloads.html).

**License**: Apache 2.0.  Free for commercial and non-commercial use.  See [LICENSE.md](LICENSE.md).

My primary use for this is to quickly start coding at hackathons without having to setup a repo with a server, Eclipse project, third-party includes, .gitignore, etc.  Feel free to overwrite this README.md in your repo with info on your project.

Once you are up and running, copy and paste code examples from [Cesium Sandcastle](http://cesium.agi.com/tutorials.html).

What's here?
------------

* [index.html](index.html) - A simple HTML page based on Cesium's Hello World example.  Run a local web server, and browse to index.html to run your app, which will show a 3D globe.
* [Source](Source/) - Contains [App.js](Source/App.js) which is referenced from index.html.  This is where your app's code goes.
* [ThirdParty](ThirdParty/) - A directory for third-party libraries, which initially includes just Cesium.  See the **Updating Cesium** section for how to use the latest version from the Cesium repo.
* [server.js](server.js) - A simple node.js server for serving your Cesium app.  See the **Local server** section.
* [LICENSE.md](LICENSE.md) - A license file already referencing Cesium as a third-party.  This starter app is licensed with [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) (free for commercial and non-commercial use).  You can, of course, license your code however you want.
* [.project](.project) - An [Eclipse](http://www.eclipse.org/downloads/) project with [JSHint](http://www.jshint.com/) enabled.
* [.settings](.settings/) - Directory with settings for the Eclipse project.
* [.gitignore](.gitignore) - A small list of files not to include in the git repo.  Add to this as needed.

### Branches

The [viewer branch](https://github.com/pjcozzi/cesium-starter-app/tree/viewer) is the same as master except it creates a [Viewer](http://cesium.agi.com/Cesium/Build/Documentation/Viewer.html) widget instead of a [CesiumWidget](http://cesium.agi.com/Cesium/Build/Documentation/CesiumWidget.html), so it includes the timeline, imagery picker, etc. in addition to the 3D globe.

Local server
------------

A local HTTP server is required to run the app.

Have python installed?  If so, from the `cesium-starter-app` root directory run
```
python -m SimpleHTTPServer
```
Browse to `http://localhost:8000/`

No python?  Use Cesium's node.js server.

* Install [node.js](http://nodejs.org/)
* From the `cesium-starter-app` root directory, run
   * `npm install connect`
   * `node server.js`

Browse to `http://localhost:8000/`

Importing into Eclipse
----------------------

If you use Eclipse as your JavaScript IDE, it is easy to important the `cesium-starter-app` Eclipse project into a new workspace.  In Eclipse:
* `File -> Switch Workspace -> Other`
* Select a directory for the workspace and click `OK`
* In `Package Explorer`, right click and select `Import`
* Under `General`, select `Existing Projects into Workspace` and click `Next`
* Next to `Select root directory`, click `Browse`
* Browse to the `cesium-starter-app` root directory and click `Open`
* Click `Finish`

Updating Cesium
---------------

The built Cesium source is in [ThirdParty/Cesium/](ThirdParty/Cesium/).  I sync this up with the master branch in the [Cesium repo](https://github.com/AnalyticalGraphicsInc/cesium) once in a while.  With `cesium` and `cesium-starter-app` repo directories in the same parent directory, here's up to update (replace `b25` with the tag/commit to update to):
```
cd cesium
git pull
git checkout -b b25-starter b25

./Tools/apache-ant-1.8.2/bin/ant clean combine
rm -rf ../cesium-starter-app/ThirdParty/Cesium/*
cp -R Build/Cesium/* ../cesium-starter-app/ThirdParty/Cesium/
```
Test the starter app in case any changes are needed to [index.html](index.html) or [App.js](Source/App.js).

Also merge `master` to `viewer` so both `cesium-starter-app` branches are up to date.
```
git checkout viewer
git merge master
// Change starter app as needed
git push
```

This uses the unminified version of Cesium.js, which is great for debugging but is quite large for production deployments.  To use the minified version, run `ant` with `minify` instead of `combine` before updating `cesium-starter-app`:
```
./Tools/apache-ant-1.8.2/bin/ant clean minify
```
The [Cesium Contributor's Guide](https://github.com/AnalyticalGraphicsInc/cesium/wiki/Contributor's-Guide) has more info on Cesium build options.

Cesium resources
----------------

* [Tutorials](http://cesium.agi.com/tutorials.html)
* [Sandcastle](http://cesium.agi.com/Cesium/Apps/Sandcastle/index.html) - lots of examples to copy and paste.
* [Reference Documentation](http://cesium.agi.com/refdoc.html)
* [Forum](http://cesium.agi.com/forum.html)

Useful hackathon tools
----------------------

* [jq](http://stedolan.github.io/jq/) - command-line JSON processor
