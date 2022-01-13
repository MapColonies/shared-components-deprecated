import React, { useLayoutEffect, useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Menu, MenuItem, MenuSurfaceAnchor } from '@map-colonies/react-core';
import { Box } from '../box';
import { CesiumMap, IContextMenuData, useCesiumMap } from './map';
import { CesiumSceneMode } from './map.types';
import { IRasterLayer } from './layers-manager';

export default {
  title: 'Cesium Map',
  component: CesiumMap,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

interface ILayersMozaikProps {
  layers: IRasterLayer[];
}

const mapDivStyle = {
  height: '90%',
  width: '100%',
  position: 'absolute' as const,
};

const BASE_MAPS = {
  maps: [
    {
      id: '1st',
      title: '1st Map Title',
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/3456d1802ab2ef330ae2732387726771.png',
      baseRasteLayers: [
        {
          id: 'GOOGLE_TERRAIN',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            layers: '',
            credit: 'GOOGLE',
          },
        },
        {
          id: 'INFRARED_RASTER',
          type: 'WMS_LAYER',
          opacity: 0.6,
          zIndex: 1,
          options: {
            url:
              'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?',
            layers: 'goes_conus_ir',
            credit: 'Infrared data courtesy Iowa Environmental Mesonet',
            parameters: {
              transparent: 'true',
              format: 'image/png',
            },
          },
        },
      ],
      baseVectorLayers: [],
    },
    {
      id: '2nd',
      title: '2nd Map Title',
      isCurrent: true,
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
      baseRasteLayers: [
        {
          id: 'RADAR_RASTER',
          type: 'WMS_LAYER',
          opacity: 0.6,
          zIndex: 1,
          options: {
            url:
              'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
            layers: 'nexrad-n0r',
            credit: 'Radar data courtesy Iowa Environmental Mesonet',
            parameters: {
              transparent: 'true',
              format: 'image/png',
            },
          },
        },
        {
          id: 'GOOGLE_TERRAIN',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            layers: '',
            credit: 'GOOGLE',
          },
        },
        {
          id: 'VECTOR_TILES_GPS',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 2,
          options: {
            url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
            layers: '',
            credit: 'openstreetmap',
          },
        },
      ],
      baseVectorLayers: [],
    },
    {
      id: '3rd',
      title: '3rd Map Title',
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/d8b97d3e38a0d43e5a06dea9aae17a3e.png',
      baseRasteLayers: [
        {
          id: 'VECTOR_TILES',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 0,
          options: {
            url:
              'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
            layers: '',
            credit: 'thunderforest',
          },
        },
        {
          id: 'VECTOR_TILES_GPS',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 1,
          options: {
            url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
            layers: '',
            credit: 'openstreetmap',
          },
        },
        {
          id: 'WMTS_POPULATION_TILES',
          type: 'WMTS_LAYER',
          opacity: 0.4,
          zIndex: 2,
          options: {
            url:
              'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
            layer: 'USGSShadedReliefOnly',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'default028mm',
            maximumLevel: 19,
            credit: 'U. S. Geological Survey',
          },
        },
      ],
      baseVectorLayers: [],
    },
  ],
};

const layers = [
  {
    id: '2_raster_ext',
    type: 'XYZ_LAYER',
    opacity: 1,
    zIndex: 0,
    show: false,
    options: {
      url:
        'https://tiles.openaerialmap.org/5a9f90c42553e6000ce5ad6c/0/eee1a570-128e-4947-9ffa-1e69c1efab7c/{z}/{x}/{y}.png',
    },
    details: {
      footprint: {
        type: 'Polygon',
        coordinates: [
          [
            [34.8099445223518, 31.9061345394902],
            [34.8200994167574, 31.9061345394902],
            [34.8200994167574, 31.9106311613979],
            [34.8099445223518, 31.9106311613979],
            [34.8099445223518, 31.9061345394902],
          ],
        ],
      },
    },
  },
  {
    id: '3_raster_ext',
    type: 'XYZ_LAYER',
    opacity: 1,
    zIndex: 1,
    show: false,
    options: {
      url:
        'https://tiles.openaerialmap.org/5a8316e22553e6000ce5ac7f/0/c3fcbe99-d339-41b6-8ec0-33d90ccca020/{z}/{x}/{y}.png',
    },
    details: {
      footprint: {
        type: 'Polygon',
        coordinates: [
          [
            [34.8106008249547, 31.9076273723004],
            [34.8137969069015, 31.9076273723004],
            [34.8137969069015, 31.9103791381117],
            [34.8106008249547, 31.9103791381117],
            [34.8106008249547, 31.9076273723004],
          ],
        ],
      },
    },
  },
  {
    id: '4_raster1_ext',
    type: 'XYZ_LAYER',
    opacity: 1,
    zIndex: 2,
    show: false,
    options: {
      url:
        'https://tiles.openaerialmap.org/5a831b4a2553e6000ce5ac80/0/d02ddc76-9c2e-4994-97d4-a623eb371456/{z}/{x}/{y}.png',
    },
    details: {
      footprint: {
        type: 'Polygon',
        coordinates: [
          [
            [34.8043847068541, 31.9023297972932],
            [34.8142791322292, 31.9023297972932],
            [34.8142791322292, 31.9108796531516],
            [34.8043847068541, 31.9108796531516],
            [34.8043847068541, 31.9023297972932],
          ],
        ],
      },
    },
  },
];

const ContextMenu: React.FC<IContextMenuData> = ({
  data,
  position,
  style,
  size,
  handleClose,
}) => {
  const layerId =
    data[0]?.meta !== undefined
      ? ((data[0]?.meta as Record<string, unknown>).id as string)
      : '';

  const handleAction = (
    action: string,
    data: Record<string, unknown>[]
  ): void => {
    console.log(`ACTION: ${action}`);
    console.log('DATA:', data);
    console.log('SIZE:', size);
  };

  const emptyStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <>
      {data.length > 0 && (
        <Box
          style={{
            ...emptyStyle,
            ...style,
            background: 'var(--mdc-theme-surface)',
            position: 'absolute',
            borderRadius: '4px',
            padding: '12px',
            paddingBottom: '220px',
          }}
        >
          <h4>Actions on {layerId}:</h4>
          {data.length > 1 && (
            <h3>
              <span style={{ color: 'red' }}>{data.length}</span> layers
              overlapping
            </h3>
          )}
          <MenuSurfaceAnchor>
            <Menu
              open={true}
              onClose={(evt): void => handleClose()}
              style={{ width: '100%' }}
            >
              {['Top', 'Up', 'Down', 'Bottom'].map((action) => {
                return (
                  <MenuItem key={`imageryMenuItemAction_${action}`}>
                    <Box
                      onClick={(evt): void => {
                        handleAction(action, data);
                      }}
                    >
                      {action}
                    </Box>
                  </MenuItem>
                );
              })}
            </Menu>
          </MenuSurfaceAnchor>
        </Box>
      )}
      {data.length === 0 && (
        <Box
          style={{
            ...emptyStyle,
            background: 'var(--mdc-theme-surface)',
            position: 'absolute',
            borderRadius: '4px',
            padding: '12px',
          }}
        >
          No data found
        </Box>
      )}
    </>
  );
};

const LayersMozaik: React.FC<ILayersMozaikProps> = (props) => {
  const mapViewer = useCesiumMap();
  const { layers } = props;
  const [selectedLayer, setSelectedLayer] = useState<string>(layers[0].id);
  const [times, setTimes] = useState<number>(1);
  const [allShow, setAllShow] = useState<boolean>(false);

  useLayoutEffect(() => {
    const sortedLayers = layers.sort(
      (layer1, layer2) => layer1.zIndex - layer2.zIndex
    );
    sortedLayers.forEach((layer, idx) => {
      mapViewer.layersManager?.addRasterLayer(layer, idx, '');
    });
  }, [layers, mapViewer]);

  const handleRaise = (): void => {
    mapViewer.layersManager?.raise(selectedLayer, times);
  };

  const handleLower = (): void => {
    mapViewer.layersManager?.lower(selectedLayer, times);
  };

  const handleRaiseToTop = (): void => {
    mapViewer.layersManager?.raiseToTop(selectedLayer);
  };

  const handleLowerToBottom = (): void => {
    mapViewer.layersManager?.lowerToBottom(selectedLayer);
  };

  const handleToglleAll = (): void => {
    mapViewer.layersManager?.showAllNotBase(!allShow);
    setAllShow(!allShow);
  };

  return (
    <>
      <select
        defaultValue={selectedLayer}
        onChange={(evt): void => {
          setSelectedLayer(evt.target.value);
        }}
      >
        {layers.map((layer) => (
          <option key={layer.id} defaultValue={layer.id}>
            {layer.id}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={times}
        onChange={(evt): void => {
          setTimes(parseInt(evt.target.value));
        }}
      ></input>
      <button
        onClick={(): void => {
          handleRaise();
        }}
      >
        Raise
      </button>
      <button
        onClick={(): void => {
          handleLower();
        }}
      >
        Lower
      </button>
      <button
        onClick={(): void => {
          handleRaiseToTop();
        }}
      >
        RaiseToTop
      </button>
      <button
        onClick={(): void => {
          handleLowerToBottom();
        }}
      >
        LowerToBottom
      </button>
      <button
        onClick={(): void => {
          handleToglleAll();
        }}
      >
        Toggle All
      </button>
    </>
  );
};

export const MapWithContextMenu: Story = () => {
  const [center] = useState<[number, number]>([34.811, 31.908]);
  return (
    <div style={mapDivStyle}>
      <CesiumMap
        center={center}
        zoom={14}
        imageryProvider={false}
        sceneModes={[CesiumSceneMode.SCENE3D, CesiumSceneMode.COLUMBUS_VIEW]}
        baseMaps={BASE_MAPS}
        // @ts-ignore
        imageryContextMenu={<ContextMenu />}
        imageryContextMenuSize={{ height: 340, width: 200 }}
      >
        <LayersMozaik layers={layers} />
      </CesiumMap>
    </div>
  );
};
