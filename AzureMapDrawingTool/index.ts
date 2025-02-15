import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as atlas from "azure-maps-control";
import * as atlasDrawing from "azure-maps-drawing-tools";

export class AzureMapDrawingTool implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /* #region Globals */

    //Component Framework...
    private _context: ComponentFramework.Context<IInputs>;
    private _container: HTMLDivElement;
    private _notifyOutputChanged: () => void;

    //Atlas Map...
    private _map: atlas.Map;
    private _drawingManager: atlasDrawing.drawing.DrawingManager;

    //Data Source...

    //Data Elements...
    private _latitude: number;
    private _longitude: number;
    private _geoJson: string
    private _zoom: number;

    //HTML...
    private _mapContainer: HTMLDivElement;
    private _eventPanel: HTMLDivElement;
    private _eventContent: HTMLFieldSetElement;

    /* #endregion */

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement

    ): void {
        try {
            console.log("init");

            this._notifyOutputChanged = notifyOutputChanged;
            this._context = context;
            this._container = container;

            this._mapContainer = document.createElement('div');
            this._mapContainer.setAttribute("id", "myMap");
            this._mapContainer.setAttribute("style", "position:relative;width:100%;min-width:290px;height:800px;");

            this._eventPanel = document.createElement('div');
            this._eventPanel.setAttribute("id", "eventPanel");
            this._eventPanel.setAttribute("style", "background-color: color: #ac560e;position:relative;width:100%;min-width:290px;height:100px;margin-top:10px;");

            this._eventContent = document.createElement('fieldset');
            this._eventContent.setAttribute("id", "eventContent");
            this._eventContent.setAttribute("style", "width:calc(100% - 30px);min-width:290px;margin-top:10px;");
            this._eventContent.innerHTML = "<legend>Drawing Tool Events</legend>";

            container.append(this._mapContainer);
            container.append(this._eventPanel);
            this._eventPanel.append(this._eventContent);

        }
        catch (error) {
            console.log(error);
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        console.log("updateView");

        try {
            this.getData();
            this.renderMap(context);
        }
        catch (error) {
            console.log(error);
        }
    }

    public getOutputs(): IOutputs {
        try {
            console.log("getOutputs");
        }
        catch (error) {
            console.log(error);
        }
        return {};
    }

    public destroy(): void {
        try {
            console.log("destroy");
        }
        catch (error) {
            console.log(error);
        }
    }

    /* #region Custom Methods */
    public renderMap(context: ComponentFramework.Context<IInputs>): void {
        try {
            const map = this.initializeMap();
            this.setupDrawingManager(map);
            this.handleEvents(map);
            this._map = map;
            this._notifyOutputChanged();

        } catch (error) {
            console.error("Error rendering map:", error);
        }
    }

    private initializeMap(): atlas.Map {
        const map = new atlas.Map('myMap', {
            view: 'Auto',
            center: [this._latitude, this._longitude],
            zoom: this._zoom,
            language: 'en-US',
            style: 'satellite_road_labels',
            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: 'YOUR_AZURE_MAPS_SUBSCRIPTION_KEY' // Replace with a secure approach
            },
            enableAccessibility: false,
        });

        return map;
    }

    private setupDrawingManager(map: atlas.Map): void {
        map.events.add('ready', () => {
            const drawingManager = new atlasDrawing.drawing.DrawingManager(map, {
                toolbar: new atlasDrawing.control.DrawingToolbar({
                    buttons: ['draw-polygon', 'draw-circle', 'draw-rectangle', 'edit-geometry', 'erase-geometry'],
                    position: 'top-right',
                    style: 'light'
                })
            });

            /* #region Drawing Manager Rendering Layer Options */
            const layers = drawingManager.getLayers();
            layers.pointLayer?.setOptions({ iconOptions: { image: 'marker-blue', size: 1 } });
            layers.lineLayer?.setOptions({ strokeColor: 'orange', strokeWidth: 2 });
            layers.polygonLayer?.setOptions({ fillColor: 'green' });
            layers.polygonOutlineLayer?.setOptions({ strokeColor: 'orange' });
            /* #endregion */

            /* #region Drawing Manager Preview Layer Options */
            const previewLayers = drawingManager.getPreviewLayers();
            previewLayers.lineLayer?.setOptions({ strokeColor: 'orange', strokeWidth: 2 });
            previewLayers.polygonOutlineLayer?.setOptions({ strokeColor: 'orange' });
            /* #endregion */

            /* #region Set Drawing Manager Options */
            drawingManager.setOptions({
                //Primary drag handle that represents coordinates in the shape.
                dragHandleStyle: {
                    anchor: 'center',
                    htmlContent: '<svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer"><rect x="0" y="0" width="15" height="15" style="stroke:black;fill:white;stroke-width:2px;"/></svg>',
                    draggable: true
                },

                //Secondary drag handle that represents mid-point coordinates that users can grab to add new cooridnates in the middle of segments.
                secondaryDragHandleStyle: {
                    anchor: 'center',
                    htmlContent: '<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer"><rect x="0" y="0" width="10" height="10" style="stroke:white;fill:black;stroke-width:2px;"/></svg>',
                    draggable: true
                }
            });
            /* #endregion */

            this._drawingManager = drawingManager;

        });
    }

    private handleEvents(map: atlas.Map): void {
        map.events.add('ready', () => {

            map.events.add('drawingcomplete', this._drawingManager, (e) => {
                this.drawingComplete('drawingcomplete', e);
            });

            map.events.add('drawingcomplete', this._drawingManager, (e) => {
                console.log("Drawing Mode Changed:", e);
            });
            
        });
    }

    private drawingComplete(eventType: string, e: any): void {
        console.log("Drawing Complete:", e);
        //TODO: Pass GeoJSon to Property Bag...
        //this._context.parameters.azureMapField.raw = JSON.stringify(e);
        this._notifyOutputChanged();
    }

    private countDecimalPlaces(decimal: number) {
        const decimalIndex = decimal.toString().indexOf('.');
        console.log(decimal.toString().length - decimalIndex - 1);
        return decimalIndex >= 0 ? decimal.toString().length - decimalIndex - 1 : 0;
    }

    public getData(): void {
        console.log("getData");
        try {
            //Load Existing GeoJson, Latitude and Logintude Fields...
            this._latitude = this._context.parameters.latitudeField.raw ? this._context.parameters.latitudeField.raw : 0;
            this._longitude = this._context.parameters.longitudeField.raw ? this._context.parameters.longitudeField.raw : 0;
            this._geoJson = this._context.parameters.azureMapField.raw || "";

            //Calculate the Zoom...
            this._zoom = this.countDecimalPlaces(this._latitude);

            if (this._geoJson === "val") {
                console.log("NO GeoJson data found!");
                console.log("Latitude: " + this._latitude);
                console.log("Longitude: " + this._longitude);
            }

            else {
                if (this._geoJson) {
                    console.log("geojsonData: " + this._geoJson);
                }
                else {
                    console.log("NO GeoJson data found!");
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    /* #endregion */

}
