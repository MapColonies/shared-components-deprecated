# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2020-09-03)


### Bug Fixes

* **code:** functional component typescript ([3ead66e](https://github.com/MapColonies/shared-components/commit/3ead66e0b944dd21241c0e8283f6a23c2cecc907))
* **eslint:** fixing PR lint hook triggering ([30491de](https://github.com/MapColonies/shared-components/commit/30491de0f63e1668361be0447881193aca2c6404))
* **mousetracker:** format changed ([87da349](https://github.com/MapColonies/shared-components/commit/87da3493d0db10989fccd02e093b222625a35283))
* **prcomments:** pr comments fix ([dfac39b](https://github.com/MapColonies/shared-components/commit/dfac39befbe7d322f2ecdba51a164a8464eedbc2))
* **prettier:** git PR hook triggered ([6a4419c](https://github.com/MapColonies/shared-components/commit/6a4419c009c30e1b2dd3a8f586928722a7e043c7))
* **wmtstile:** attribution param not mandatory ([2692cb4](https://github.com/MapColonies/shared-components/commit/2692cb4ea5b41ecc53de4681ebd7bb25f7f23af6))


### Code Refactoring

* **catalog:** storybook for each package & composed storybook ([#25](https://github.com/MapColonies/shared-components/issues/25)) ([96f7d2d](https://github.com/MapColonies/shared-components/commit/96f7d2d8563aac316d8b808101628b2a227b8cbc))


### Features

* **core:** map mouse tracking control ([f2ad16f](https://github.com/MapColonies/shared-components/commit/f2ad16f46f921b411305c6ba1d8263be9522a241))
* **maplayers:** added WMS and XYZ layers ([5353825](https://github.com/MapColonies/shared-components/commit/535382590cb0f93d85c1fa9d6095da0468d2791b))
* **wmtstilelayer:** implementation + lint errors ([a5e7189](https://github.com/MapColonies/shared-components/commit/a5e718992157d97b1470556e7c57299d8f049f97))


### Performance Improvements

* **map:** map control props sensetive to changes ([76ccc8e](https://github.com/MapColonies/shared-components/commit/76ccc8e78ee8acb4cd7d6030a371002aa5d04e6a))


* refactor!(monorepo): moved from yarn workspaces to lerna (#26) ([675815a](https://github.com/MapColonies/shared-components/commit/675815a2e23167b47a9e420bbd1c703cb783ff23)), closes [#26](https://github.com/MapColonies/shared-components/issues/26)


### BREAKING CHANGES

* **catalog:** lerna, core comps

* fix(storybook):  unneeded files

* fix(rename): demoapps

* fix(cleanup): unneeded storybooks remains

* fix(pkg): script added

* chore(release): version bumped 1.0.0

 - demoapp-react@1.0.0
 - demoapp-stencil@1.0.0
 - @map-colonies/react-components@1.0.0
 - @map-colonies/react-core@1.0.0
 - @map-colonies/ui-components@1.0.0
 - @map-colonies/ui-components-react@1.0.0

* fix(readme): updated

* chore(publish): publish [by user]

 - demoapp-react@1.0.1
 - demoapp-stencil@1.0.1
 - @map-colonies/react-components@1.0.1
 - @map-colonies/react-core@1.0.1

* fix(prettier): all code is prettified

* fix(prcomments): fixed

* fix(tests): added tests infrastructure

* fix(composed storybook): updated storybook

* feat(react-core): added stories

* fix(catalog): fixed react-core docs

Co-authored-by: alebinson <newdarkvirus@gmail.com>
Co-authored-by: LEBINSON ALEX <ALEXLEB@rf.local>
* lerna, core comps

* fix(storybook):  unneeded files

* fix(rename): demoapps

* fix(cleanup): unneeded storybooks remains

* fix(pkg): script added

* chore(release): version bumped 1.0.0

 - demoapp-react@1.0.0
 - demoapp-stencil@1.0.0
 - @map-colonies/react-components@1.0.0
 - @map-colonies/react-core@1.0.0
 - @map-colonies/ui-components@1.0.0
 - @map-colonies/ui-components-react@1.0.0

* fix(readme): updated

* chore(publish): publish [by user]

 - demoapp-react@1.0.1
 - demoapp-stencil@1.0.1
 - @map-colonies/react-components@1.0.1
 - @map-colonies/react-core@1.0.1

* fix(prettier): all code is prettified

* fix(prcomments): fixed

* fix(tests): added tests infrastructure

Co-authored-by: LEBINSON ALEX <ALEXLEB@rf.local>
Co-authored-by: Ran Elishayev <rannygmx@gmail.com>
Co-authored-by: Ran Elishayev <42379604+rannyeli@users.noreply.github.com>




# 2.0.0 (2020-08-26)


### Bug Fixes

* **mousetracker:** format changed ([87da349](https://github.com/MapColonies/shared-components/commit/87da3493d0db10989fccd02e093b222625a35283))
* **prcomments:** pr comments fix ([dfac39b](https://github.com/MapColonies/shared-components/commit/dfac39befbe7d322f2ecdba51a164a8464eedbc2))
* **wmtstile:** attribution param not mandatory ([2692cb4](https://github.com/MapColonies/shared-components/commit/2692cb4ea5b41ecc53de4681ebd7bb25f7f23af6))


### Features

* **core:** map mouse tracking control ([f2ad16f](https://github.com/MapColonies/shared-components/commit/f2ad16f46f921b411305c6ba1d8263be9522a241))
* **wmtstilelayer:** implementation + lint errors ([a5e7189](https://github.com/MapColonies/shared-components/commit/a5e718992157d97b1470556e7c57299d8f049f97))


### Performance Improvements

* **map:** map control props sensetive to changes ([76ccc8e](https://github.com/MapColonies/shared-components/commit/76ccc8e78ee8acb4cd7d6030a371002aa5d04e6a))


* refactor!(monorepo): moved from yarn workspaces to lerna (#26) ([675815a](https://github.com/MapColonies/shared-components/commit/675815a2e23167b47a9e420bbd1c703cb783ff23)), closes [#26](https://github.com/MapColonies/shared-components/issues/26)


### BREAKING CHANGES

* lerna, core comps

* fix(storybook):  unneeded files

* fix(rename): demoapps

* fix(cleanup): unneeded storybooks remains

* fix(pkg): script added

* chore(release): version bumped 1.0.0

 - demoapp-react@1.0.0
 - demoapp-stencil@1.0.0
 - @map-colonies/react-components@1.0.0
 - @map-colonies/react-core@1.0.0
 - @map-colonies/ui-components@1.0.0
 - @map-colonies/ui-components-react@1.0.0

* fix(readme): updated

* chore(publish): publish [by user]

 - demoapp-react@1.0.1
 - demoapp-stencil@1.0.1
 - @map-colonies/react-components@1.0.1
 - @map-colonies/react-core@1.0.1

* fix(prettier): all code is prettified

* fix(prcomments): fixed

* fix(tests): added tests infrastructure

Co-authored-by: LEBINSON ALEX <ALEXLEB@rf.local>
Co-authored-by: Ran Elishayev <rannygmx@gmail.com>
Co-authored-by: Ran Elishayev <42379604+rannyeli@users.noreply.github.com>






## [1.0.1](https://github.com/MapColonies/shared-components/compare/@map-colonies/react-components@1.0.0...@map-colonies/react-components@1.0.1) (2020-08-17)


### Bug Fixes

* **readme:** updated ([bf51776](https://github.com/MapColonies/shared-components/commit/bf5177627a7b61c3ee1b1b5f30106e1996da7924))





# [1.0.0](https://github.com/MapColonies/shared-components/compare/@map-colonies/react-components@0.1.2...@map-colonies/react-components@1.0.0) (2020-08-17)


### Bug Fixes

* **cleanup:** unneeded storybooks remains ([6113a9b](https://github.com/MapColonies/shared-components/commit/6113a9b3589a43effe38fb5795cc90bed564f6e6))
* **rename:** mc prefix removed ([2b8c936](https://github.com/MapColonies/shared-components/commit/2b8c9363313c9958c800951ef25a319f21427d00))
* **storybook:**  unneeded files ([aab448f](https://github.com/MapColonies/shared-components/commit/aab448fec67aa971108e05e14eb109242b89c8f5))






## [0.1.2](https://github.com/MapColonies/shared-components/compare/@map-colonies/react-components@0.1.1...@map-colonies/react-components@0.1.2) (2020-08-16)


### Bug Fixes

* **lerna:** index ([f445ee2](https://github.com/MapColonies/shared-components/commit/f445ee235b012a45e57eed5064a32e622f246d8b))






## 0.1.1 (2020-08-16)


### Bug Fixes

* **lerna:** package.json ([fd40bdd](https://github.com/MapColonies/shared-components/commit/fd40bdd5ecdac1ec5b31be1a534ca3ed1de6b43f))
* **lerna:** tasks ([09cdbfc](https://github.com/MapColonies/shared-components/commit/09cdbfc5e76c35af973715b60f29d25e36e8cf3c))
* **lint:** linting integrated ([3536f31](https://github.com/MapColonies/shared-components/commit/3536f3162765a63e3baf595b350251d58e3c04f6))
* **linting:** react components ([b6e4b1f](https://github.com/MapColonies/shared-components/commit/b6e4b1f3649a14dd68b13f84ad6a40676d894d0b))
* **publish:** task added ([4aa8c2d](https://github.com/MapColonies/shared-components/commit/4aa8c2d4d2101ee7b7065f826dd536ff47c0eef1))
