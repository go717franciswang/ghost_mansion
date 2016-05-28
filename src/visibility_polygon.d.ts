declare class VisibilityPolygon {
    static compute(position, segments): any;
    static computeViewPort(position, segments, viewportMinCorner, viewportMaxCorner): any;
    static inPolygon(position, polygon): boolean;
    static convertToSegments(polygons): any;
    static breakIntersections(segments): any;
}

    
