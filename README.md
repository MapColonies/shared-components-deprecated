# React MonoRepo

This repo contains react demo apps and component libraries to share between apps.

The repo uses [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to link dependencies, and to enable running `yarn install` once.

**You should use yarn instead of npm.**


## Projects
* **demoapp-react** - UI app as a demo for using react components.
* **demoapp-stencil** - UI app as a demo for using stencil componets(not active).
* **react-components** - Component library for common usage(more suffisitcated components).
* **react-ui-components** - Core components based on Material Web Components helpers.

## Install workspace packages dependecies
```json
  yarn
```

## Adding new projects
1. Create a new folder for the project.
2. Add [cross-env](https://www.npmjs.com/package/cross-env) as a dependency to your new project.
3. Add the new project into the root package.json workspaces array:
```json
{
  "workspaces": ["workspace-a", "workspace-b", "add your new project here"]
}
```
4. Add any dependency you want from the repo your your package.json (some of the packages might need to be builded before use). **make sure that the dependency version matches the version in the target package.json.** 

```json
{
  "dependencies": {
    "react-components": "0.1.0"
  }
}
```
5. Add any external dependencies you would like using yarn.
6. start hacking :wink:

## Build
1. Build Core components
```json
  yarn run build:react-core:build
``` 
2. Build common components
```json
  yarn run build:react
``` 

## Publishing
1. Be logged in to NPM
```json
  npm login
``` 
2. Publish PUBLIC packages 
```json
  yarn run publish
``` 
or
```json
  npx lerna publish --conventional-commits -m "chore(publish): publish %s [ci skip]"
``` 
3. Re-publish currently bumped versions
```json
  npx lerna exec -- npm publish
```
