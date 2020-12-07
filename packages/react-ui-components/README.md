# react-ui-components

This is a library contains CORE react components for use by other apps, based on Material Web Components helpers.
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
Icons assets (fonts, css) are not part of the package. 
react-core provides a declarative way to use icons. Note that react-core does not ship with any icons of its own. 

**Make sure you include an icon set in your appilcation!**

You can use any one you want, but Google's Material Icons are available through open source. 
https://google.github.io/material-design-icons/

### Self hosted solution
* Copy relevant assets to your `public` folder.  
  ***material-design-icons* npm module** defined as dependency for your convinience.  
For exmaple you can add to your `package.json` following script:  
    ```json
    "scripts": {
        "copyassets:md-fonst": "copyfiles -u 3 \"./node_modules/material-design-icons/iconfont/*\" \"./public/fonts/material-icons\""
    }
    ```
* Load the `material-icons.css` in your app entry point(`index.html`).  
    For exmaple you can add it in ***head*** section of your `index.html`:  
    ```html
    <head>
        <link href="%PUBLIC_URL%/fonts/material-icons/material-icons.css" rel="stylesheet">
    </head>
    ```

### Outer resources solution(CDN, etc.)
* Load the `material-icons.css` in your app entry point(`index.html`) from URL.  
The recommended way to use the Material Icons font is by linking to the web font hosted on Google Fonts:
    ```html
    <head>
        <!-- https://material.io/resources/icons/?style=baseline -->
        <link href="https://fonts.googleapis.com/css2?family=Materia+Icons" rel="stylesheet">

        <!-- https://material.io/resources/icons/?style=outline -->
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">

        <!-- https://material.io/resources/icons/?style=round -->
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">

        <!-- https://material.io/resources/icons/?style=sharp -->
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp" rel="stylesheet">
    </head>
    ```

