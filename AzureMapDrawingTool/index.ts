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
    //private _drawingManager: atlasDrawing.drawing.DrawingManager;

    //Data Source...
    //private _dataSource: atlas.source.DataSource;
    //private _setData: EventListenerOrEventListenerObject;
    //private _dataBounds: atlas.data.BoundingBox;

    //Data Elements...
    //private _latitude: number;
    //private _longitude: number;
    //private _geoJson: string
    //private _zoom: number;

    //HTML...
    private _mapContainer: HTMLDivElement;
    //private _eventPanel: HTMLDivElement;
    private _inputElement: HTMLInputElement;

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
        }
        catch (error) {
            console.log(error);
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        try { 
            console.log("updateView");            
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
}
