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

