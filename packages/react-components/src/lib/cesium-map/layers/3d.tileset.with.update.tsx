/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
   https://sandcastle.cesium.com/index.html?#c=fVZtTxs5EP4re3xho0YOkOv1jgC6ElIuiAQKKaWQqnJ2nayL187Z3qCk4r/f+GXf8nKWot3YzzOeGT8z6wWWQRdLTRTFvB2cBl14y1JUznXGfMxbreBSYq798tV9gKOIKBVoESxFJgMqeICVIlqNuTfRFxzFZIozpj9a8Ei8EA5b7JPlVTK5jOgNvep/WfUPh7Sv+vzufdTt/9F/mT8+dK/+QgD6N758MSA6GJ3/HB712gN60H66fHq5Ht0l39K+vvnaWw27h/RmFP+8ueitBqvB+8FqRq+7V/MnMDa8+Kz6KUtieB+MPv8+/Am/i8HBoH2AztvdD0NBlu2n28do+uHHp8fz3rdXKiN91J6qLyS64/eHR5+YHv65b3OwgFRFNrQRkRJTfivFgsZEllmLJMGafBWSxR4TNjqOSRijcyVovEnm5DU30NuBsmacoQUlr+u0BzsX7jv3uoJr4BK53wx+jXkAY4IVucZLIm9p9ALs42CKmSJNt6rXXDreHueYv+XRqIhwAj44Z5D9az20b2jGxITA4c91MiJKf5yBFaW9OaBpmZEiIE0ZAeHAtCPPJU2ppguiEI7j0LlYCdY92hcjxwt9iGZkkh0HpfzuiAJtRgRNpUg/GnX247D9oX3UcJQ3ePrEujhWQqQjEXqPPAoJnRD5ShUJpxmPtJF6CKEI2Qgqe0eCK8EIYmLmVzv5LnaLgpvNYxCJ8T6wOxVWTDImIuMx5bMHwbLUZNggUH3W26XTIPSxQpnBecfWHAJHNOH6vMZp1HzdvstWYh5E6aKHrbE6JSAVMWGw7FfQDztRASSEzhJjoO4HSimnaZb+Y5creJCFtpK3htAPqaOunapguJApZoWInAKLokMzAlRNo/tMTnFEhhYdOsNNp66i44WNRsWwmE6dOksASqGn0Tlbni/vI8ywDN3uTR/Z/xuMYF7UO62YSTxPaGSFWvC8e1XuHNZBiCX7NSG2y/oWkevCJWG9rk9PT3f2oZo+zFaSKIjSHKNxsFMuugVUHOJBZc37hwAj2IKEDltUAuwOzv/awJfxKJzOGfG+DYTSFwR6GQNtbw2pGTxb9743EBQpLwrUb6xqUW1E5kHPB987dZRJ4W9rteVD2bDoUqIzyTcyVSmcNaQzVoG+NcpCcy95KrfFVXOiCGeboLQo5VQ/jEJSQlHbl2oKV9lESxxpT2r6MtitbDPWy7NuMmKCkzDfrrmBrvXLtx0t0zR8KUSZAXNUZiLvQ3cEx8tafkqyY+4Uo8kGowqsWNf9VwCZ57XAsfka9RawxbXHlKdSa+NVEZkFW3Y1n6uj4p210tmE5D6Fjd3a2tSPbTUJZbG0ly6XI/+/0lEY4TOdmDL3a8jNeMhUyCA0OGorHR4nntIJ3r2jOxJtTim390y/V3yz7t1jHkdYafh6QE5HYjZj5DzTGjK5n18SehxPoOzhCmMuC82gyHWUELjCxDUBrM+ZsaMFbr/a7NTELiu72uj6KdRzkksq16E9tb3m3onSS0bOHOVvms6F1OYyEyLU0gQ6IthQrUkGQcIhKmVoJ62cdBLTRUDj0/He2v1vvBdEDG7lsDLNGLunKzLeOztpAb5GY6Bu+ArfLIhkeGkgyeHZtZtECJ204O8mSwvBJlhWLP4H
*/

import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Cesium3DTileset,
  Cesium3DTile,
  Cartographic,
  Cartesian3,
  defined,
  sampleTerrainMostDetailed,
  Cesium3DTileContent,
} from 'cesium';
import { CesiumViewer, useCesiumMap } from '../map';

export interface Cesium3DTilesetWithUpdateProps {}

export const Cesium3DTilesetWithUpdate: React.FC<Cesium3DTilesetWithUpdateProps> = (
  props
) => {
  const mapViewer: CesiumViewer = useCesiumMap();
  const scene = mapViewer.scene;
  const [depthTest, setDepthTest] = useState<boolean>(false);
  const [handleUpdateTileset, setHandleUpdateTileset] = useState<boolean>(
    false
  );
  const [jerusalem] = useState<Cesium3DTileset>(
    new Cesium3DTileset({
      url:
        'https://3d.ofek-air.com/3d/Jeru_Old_City_Cesium/ACT/Jeru_Old_City_Cesium_ACT.json',
    })
  );
  const [tileset, setTileset] = useState<Cesium3DTileset>(
    scene.primitives.add(jerusalem)
  );

  useEffect(() => {
    void mapViewer.zoomTo(tileset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileset]);

  const handleDepthTestChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDepthTest(e.target.checked);
    scene.globe.depthTestAgainstTerrain = !depthTest;
  };

  const handleUpdateTilesetChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setHandleUpdateTileset(e.target.checked);
    if (!handleUpdateTileset) {
      updateTileset(tileset);
    } else {
      setTileset(scene.primitives.add(jerusalem));
    }
  };

  const updateContent = (model: Cesium3DTileContent): void => {
    console.log(model);
    const boundingVolume = model._boundingSphere;
    const height = boundingVolume.minimumHeight;
    const center = model._rtcCenter;
    const normal = scene.globe.ellipsoid.geodeticSurfaceNormal(center, new Cartesian3());
    const offset = Cartesian3.multiplyByScalar(normal, height, new Cartesian3());
    const carto = Cartographic.fromCartesian(center);
    void new Promise((resolve, reject) => {
      if (scene.terrainProvider._ready !== true) {
        const result = {...carto};
        result.height = 0;
        resolve(result);
      } else {
        void sampleTerrainMostDetailed(scene.terrainProvider, [carto]).then((results) => {
          const result = results[0];
          if (!defined(result)) {
            resolve(carto);
          }
          resolve(result);
        });
      }
    }).then((result) => {
      const resultCartesian = Cartographic.toCartesian(result as Cartographic);
      const position = Cartesian3.subtract(resultCartesian, offset, new Cartesian3());
      model._rtcCenter = Cartesian3.clone(position, model._rtcCenter);
    });
  };
  
  const updateTile = (tile: Cesium3DTile, counter: number): void => {
    void tile.content?.readyPromise.then((content): void => {
      console.log(counter++);
      updateContent(content);
    });
    tile.children.forEach(child => updateTile(child, counter));
  };
  
  const updateTileset = (tileset: Cesium3DTileset): void => {
    updateTile(tileset.root, 1);
  };

  return (
    <>
      <input
        type="checkbox"
        id="input"
        checked={depthTest}
        onChange={handleDepthTestChange}
        style={{ marginLeft: '20px', marginRight: '5px' }}
      />
      <label htmlFor="input">depthTestAgainstTerrain</label>
      <input
        type="checkbox"
        id="input"
        checked={handleUpdateTileset}
        onChange={handleUpdateTilesetChange}
        style={{ marginLeft: '20px', marginRight: '5px' }}
      />
      <label htmlFor="input">updateTileset</label>
      <br />
    </>
  );
};
