import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';


export const config: Config = {
  namespace: 'wc-ui-components',
  taskQueue: 'async',
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@map-colonies/ui-components/dist/types',
      proxiesFile: '../wc-ui-components-react/src/components.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      // dir: '../../dist/libs/wc-ui-components/dist',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      // dir: '../../dist/libs/wc-ui-components/www',
      serviceWorker: null, // disable service workers
    },
  ],




  plugins: [
    sass({
      includePaths: [
        "./node_modules",
        "../../node_modules"
      ]
    })
  ]
};
