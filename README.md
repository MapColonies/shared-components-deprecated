# React MonoRepo

This repo contains react apps and component libraries to share between apps.

The repo uses [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to link dependencies, and to enable running `yarn install` once.

**You should use yarn instead of npm.**


## Projects
* **mc-conflict-ui** - UI app for resolving conflicts.
* **mc-react-components** - Component library for shared components.

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
    "mc-react-components": "0.1.0"
  }
}
```
5. Add any external dependencies you would like using yarn.
6. start hacking :wink:
