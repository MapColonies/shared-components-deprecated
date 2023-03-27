import {
    Request,
    ImageryProvider,
    UrlTemplateImageryProvider,
    WebMapServiceImageryProvider,
    WebMapTileServiceImageryProvider,
    ImageryLayer
} from "cesium";
import { get, isEmpty } from "lodash";
import { ICesiumImageryLayer } from "../layers-manager";
import { CesiumViewer } from "../map";
import { imageHasTransparency } from "./utils";

interface CustomImageryProvider extends ImageryProvider {
    readonly layerListInstance: ICesiumImageryLayer[];
    tileTransparencyCheckedCounter: number;
    mapViewer: CesiumViewer;
}

const NUMBER_OF_TILES_TO_CHECK = 3;

function customCommonRequestImage(
    this: CustomImageryProvider,
    requestImageFn: ImageryProvider["requestImage"],
    x: number,
    y: number,
    level: number,
    request?: Request | undefined
): Promise<HTMLImageElement | HTMLCanvasElement> | undefined {
    // custom Logic
    setTimeout(() => {
        // console.log("customProvider called!", this, x, y, level);

        const requestedLayerMeta = this.layerListInstance.find(
            /* eslint-disable */
            (layer: ImageryLayer): boolean => {
                return (
                    (layer as any)._imageryProvider._resource._url === (this as any)._resource._url
                );
            }
            /* eslint-enable */
        )?.meta;

        const layerHasTransparency = !isEmpty(get(requestedLayerMeta, "hasTransparency"));
        if (
            this.tileTransparencyCheckedCounter < NUMBER_OF_TILES_TO_CHECK &&
            !layerHasTransparency
        ) {
            // console.log("requestedLayerMeta", requestedLayerMeta);

            void imageHasTransparency(request?.url as string).then((hasTransparency) => {
                if (hasTransparency) {
                    this.mapViewer.layersManager?.addMetaToLayer(
                        { hasTransparency },
                        /* eslint-disable */
                        (layer: ImageryLayer): boolean => {
                            return (
                                (layer as any)._imageryProvider._resource._url ===
                                (this as any)._resource._url
                            );
                        }
                        /* eslint-enable */
                    );
                    this.tileTransparencyCheckedCounter = NUMBER_OF_TILES_TO_CHECK;
                } else {
                    this.tileTransparencyCheckedCounter++;
                }
            });
        }
    }, 0);

    return requestImageFn(x, y, level, request);
}

export class CustomUrlTemplateImageryProvider extends UrlTemplateImageryProvider {
    public readonly layerListInstance: ICesiumImageryLayer[];
    public readonly mapViewer: CesiumViewer;

    public tileTransparencyCheckedCounter = 0;

    public constructor(
        opts: UrlTemplateImageryProvider.ConstructorOptions,
        layerListInstance: ICesiumImageryLayer[],
        mapViewer: CesiumViewer
    ) {
        super(opts);
        this.layerListInstance = layerListInstance;
        this.mapViewer = mapViewer;
    }

    public requestImage(
        x: number,
        y: number,
        level: number,
        request?: Request | undefined
    ): Promise<HTMLImageElement | HTMLCanvasElement> | undefined {
        return customCommonRequestImage.call(
            this,
            super.requestImage.bind(this),
            x,
            y,
            level,
            request
        );
    }
}

export class CustomWebMapServiceImageryProvider extends WebMapServiceImageryProvider {
    public readonly layerListInstance: ICesiumImageryLayer[];
    public readonly mapViewer: CesiumViewer;

    public tileTransparencyCheckedCounter = 0;

    public constructor(
        opts: WebMapServiceImageryProvider.ConstructorOptions,
        layerListInstance: ICesiumImageryLayer[],
        mapViewer: CesiumViewer
    ) {
        super(opts);
        this.layerListInstance = layerListInstance;
        this.mapViewer = mapViewer;
    }

    public requestImage(
        x: number,
        y: number,
        level: number,
        request?: Request | undefined
    ): Promise<HTMLImageElement | HTMLCanvasElement> | undefined {
        return customCommonRequestImage.call(
            this,
            super.requestImage.bind(this),
            x,
            y,
            level,
            request
        );
    }
}

export class CustomWebMapTileServiceImageryProvider extends WebMapTileServiceImageryProvider {
    public readonly layerListInstance: ICesiumImageryLayer[];
    public readonly mapViewer: CesiumViewer;

    public tileTransparencyCheckedCounter = 0;

    public constructor(
        opts: WebMapTileServiceImageryProvider.ConstructorOptions,
        layerListInstance: ICesiumImageryLayer[],
        mapViewer: CesiumViewer
    ) {
        super(opts);
        this.layerListInstance = layerListInstance;
        this.mapViewer = mapViewer;
    }

    public requestImage(
        x: number,
        y: number,
        level: number,
        request?: Request | undefined
    ): Promise<HTMLImageElement | HTMLCanvasElement> | undefined {
        console.log(request);
        return customCommonRequestImage.call(
            this,
            super.requestImage.bind(this),
            x,
            y,
            level,
            request
        );
    }
}
