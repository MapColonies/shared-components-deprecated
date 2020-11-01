# React MonoRepo

This repo contains react demo apps and component libraries to share between apps.

The repo uses [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to link dependencies, and to enable running `yarn install` once.

**You should use yarn instead of npm.**


## Projects
* **react-components** - Component library for common usage(more sophisticated components).
* **react-ui-components** - Core components based on Material Web Components helpers.

## Install workspace packages dependecies
```sh
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

## Adding new components
1. Create a folder for your component under `packages/react-components/src/lib/`
2. Write your component.
3. Add unit tests to your component using jest. Test files should be named `*.spec.tsx` or `*.test.tsx`.
4. Add storybook stories to your component.
5. Make sure the component is exported in the file `packages/react-components/src/index.ts`.
6. Open a pull request with all the details about your component.

## Build
1. Build Core components
```sh
  yarn run build:react-core:build
``` 
2. Build common components
```sh
  yarn run build:react
``` 

## Publishing
1. Be logged in to NPM
```sh
  npm login
``` 
2. Publish PUBLIC packages 
```sh
  yarn run publish
``` 
or
```sh
  npx lerna publish --conventional-commits -m "chore(publish): publish %s [ci skip]"
``` 
3. Re-publish currently bumped versions
```sh
  npx lerna exec -- npm publish
```

## Storybook
1. Run all packages storybooks, each package storybook tab will open and the terminal will be captured to the servers.
```sh
  yarn run storybook:all
```
2. While the storybooks are running, you can run, in a different terminal, a single composed storybook which containing all of these storybooks.
```sh
  yarn run storybook-composition
``` 

In order to run storybook for specific package - run it from appropriate package location
1. react-components
```sh
  cd packages/react-components
  yarn run storybook
```
2. react-ui-components
```sh
  cd packages/react-ui-components
  yarn run storybook
```
