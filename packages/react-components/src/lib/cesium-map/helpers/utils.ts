import { ImageryLayer, Rectangle } from "cesium";
import { get } from "lodash";
import LayerManager, { ICesiumImageryLayer } from "../layers-manager";
import { CesiumViewer } from "../map";

export const imageHasTransparency = async (image: string | HTMLImageElement): Promise<boolean> => {
    const ALPHA_CHANNEL_OFFSET = 4; // [R,G,B,A, R,G,B,A] => FLAT ARRAY OF THIS SHAPE; (Uint8ClampedArray)
    const OPAQUE_PIXEL_ALPHA_VALUE = 255;

    return new Promise<boolean>((resolve, reject) => {
        try {
            const canvasElem = document.createElement("canvas");
            const canvasCtx = canvasElem.getContext("2d");

            let imageElement: HTMLImageElement;

            // Init Image instance.
            if (image instanceof HTMLImageElement) {
                imageElement = image;
            } else {
                console.log("IMAGE URL! ",image);
                imageElement = new Image();
                imageElement.crossOrigin = "anonymous"; // Disable CORS errors on canvas image load.
                imageElement.src = image;
            }

            imageElement.onload = (): void => {
                // Image loaded, set canvas size to image size.
                canvasElem.width = imageElement.width;
                canvasElem.height = imageElement.height;

                canvasCtx?.drawImage(imageElement, 0, 0);

                const canvasImg = canvasCtx?.getImageData(
                    0,
                    0,
                    canvasElem.width,
                    canvasElem.height
                );
                const imgData = canvasImg?.data ?? [];

                // Iterate through alpha channels only.
                for (let i = 3; i < imgData?.length; i += ALPHA_CHANNEL_OFFSET) {
                    if (imgData[i] < OPAQUE_PIXEL_ALPHA_VALUE) {
                        // Transparent pixel found.
                        resolve(true);
                    }
                }
                
                resolve(false);
            };
        } catch (e) {
            console.error("Could not determine image transparency. Error => ", e);
            reject(e);
        }
    });
};

export const updateLayersRelevancy = (managerContext: LayerManager, layerList: ICesiumImageryLayer[], viewer: CesiumViewer): void => {
    const extent = viewer.camera.computeViewRectangle() as Rectangle;

    let topOpaqueLayer: ICesiumImageryLayer | null = null;
  
    for (let i = layerList.length - 1; i >= 0; i--) {
        const layer = layerList[i];
        let relevantToExtent = false;
  
        // Check if the layer intersects with the extent
        const intersectsExtent = typeof Rectangle.intersection(extent, layer.rectangle) !== 'undefined';
        
        // Check if the layer has some transparency
        const hasTransparency = layer.meta?.hasTransparency === true;
      
        if(!topOpaqueLayer && !hasTransparency) {
            topOpaqueLayer = layer;
        }

        const isTopOpaqueLayer = !hasTransparency && layer.meta?.id === topOpaqueLayer?.meta?.id;
        
  
      if (intersectsExtent) {

        if (isTopOpaqueLayer) {
          // If the layer is the top opaque layer
          relevantToExtent = true;

          if (layer.rectangle.width > extent.width && layer.rectangle.height > extent.height) {
            // If it is the top opaque layer, and bigger than extent then its the only relevant layer
            layerList.forEach((layerToMatch) => layer.meta = {...layer.meta, relevantToExtent: layerToMatch === layer});
            break;
          }

        } else {
            // Not the top layer
            // If not covered by the top layer it is relevant
            if(topOpaqueLayer && layer.rectangle.width > topOpaqueLayer.rectangle.width && layer.rectangle.height > topOpaqueLayer.rectangle.height) {
                relevantToExtent = true;
            }
        }
        
        
      } else {
        // If the layer does not intersect with the extent, mark it as not relevant
        relevantToExtent = false;
      }

      managerContext.addMetaToLayer({relevantToExtent}, (layerToMatch) => layerToMatch === layer);
    }
  }