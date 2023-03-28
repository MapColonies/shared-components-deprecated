import { Rectangle } from "cesium";
import { CustomImageryProvider } from "./customImageryProviders";

export const imageHasTransparency = async (image: string | HTMLImageElement, context?: CustomImageryProvider): Promise<boolean> => {
    const ALPHA_CHANNEL_OFFSET = 4; // [R,G,B,A, R,G,B,A] => FLAT ARRAY OF THIS SHAPE; (Uint8ClampedArray)
    const OPAQUE_PIXEL_ALPHA_VALUE = 255;

    if(context) {
        context.tileTransparencyCheckedCounter++
    }

    return new Promise<boolean>((resolve, reject) => {
        try {
            const canvasElem = document.createElement("canvas");
            const canvasCtx = canvasElem.getContext("2d");

            let imageElement: HTMLImageElement;

            // Init Image instance.
            if (image instanceof HTMLImageElement) {
                imageElement = image;
            } else {
                // console.log("IMAGE URL! ",image);
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
                        if(context) {
                            context.tileTransparencyCheckedCounter = context.maxTilesForTransparencyCheck;
                        }
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

/**
 * Checks if `rect` inside `anotherRect`
 * @param rect 
 * @param anotherRect
 */
export const cesiumRectangleContained = (rect: Rectangle, anotherRect: Rectangle): boolean => {
    const {west, east, north, south} = rect;
    const {west: anotherWest, east: anotherEast, north: anotherNorth, south: anotherSouth} = anotherRect;

    const isRectInsideAnother =
        west >= anotherWest &&
        east <= anotherEast &&
        north <= anotherNorth &&
        south >= anotherSouth;

    return isRectInsideAnother;

}