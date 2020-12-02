# react-components

This is a library contains react components for use by other apps. 
All the components are written using typescript. 
The project was bootstrapped using create-react-app, and modified to enable exporting of components.


## Using the package

* Run `yarn run build`. This will compile the `src/lib` folder, and copy all the other files into the dist folder.
* Add the package as a dependency to your project.
* Import the required component, and use it in your code.

## Developing new components

* Create a new folder for your component under src/lib.
* Develop your component (you can use `src/index.tsx` with `yarn start` to help you in the process).
* Import the component into `src/lib/index.ts`.
* Rebuild the package using `yarn run build`.
* Use the new component in different apps.

## Static resources (assets) handling
CESIUM assets (js, css) are not part of the package. 
react-components provides a declarative way to use cesium maps.

**Make sure you include an CESIUM static assest in your appilcation!**

You can use any one you want, but Google's Material Icons are available through open source. 
https://google.github.io/material-design-icons/

### Self hosted solution
* Copy relevant assets to your `public` folder.  
  ***cesium* npm module** is a npm dependency.  
For exmaple you can add to your `package.json` following script:  
    ```json
    "scripts": {
        "copyassets:cesium": "copyfiles -u 3 \"./node_modules/cesium/Build/Cesium/**/*\" \"./public\"",
    }
    ```
* Load the assests in your app entry point(`index.html`).  
    For exmaple you can add it in ***head*** section of your `index.html`:  
    ```html
    <head>
        <link rel="stylesheet" href="%PUBLIC_URL%/Cesium/Widgets/widgets.css" />
        <script src="%PUBLIC_URL%/Cesium/Cesium.js"></script>
    </head>
    ```

### Other solution how to integrate assets to you code 
* See here https://resium.darwineducation.com/installation1



