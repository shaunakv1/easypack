/*
Author: Shaunak Vairagare
Date: 03/20/2013
Use: Example of using ArcGIS 9+ Rest end points with Vector data in OpenLayers.
*/

var map;

$(function() {
	map = new OpenLayers.Map({
		div: 'map',
		projection: "EPSG:900913",
		eventListeners: {
			"addlayer": layerAddedEvent
		}
	});

	map.addLayer(
	new OpenLayers.Layer.XYZ('esri', 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${y}/${x}', {
		transitionEffect: "resize",
		sphericalMercator: true,
		format: "image/jpg"
	}));
	map.setCenter(new OpenLayers.LonLat(-2054627.3200196, 1291480.0297267), 3);

	map.zoomProxy = map.zoomTo;
	map.zoomTo =  function (zoom,xy){
		console.log(map.getZoom());

		if(zoom <=7 ) return;
		map.zoomProxy(zoom,xy);
	};

	addLayer({
		url: 'http://gis.boemre.gov/arcgis/rest/services/BOEM_BSEE/MMC_Layers/MapServer/16/query?text=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&where=1%3D1&returnGeometry=true&outSR=&outFields=&f=pjson',
		proj: 'EPSG:3857',
		map: map,
		name: 'Test Layer 1'
	});
});

addLayer = function(options) {
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

	var vectors = new OpenLayers.Layer.Vector("Vector");

	var formatter = new OpenLayers.Format.GeoJSON({
		'internalProjection': new OpenLayers.Projection('EPSG:900913'),
		'externalProjection': new OpenLayers.Projection('EPSG:4326')
	});

	//ajax call
	fetchDataCrossDomain(options.url, function(esriJson) {
		geoJson = toGeoJSON(esriJson);

		//** FIX AND DELETE ASAP BEGIN
        // ** to understand this check Fairfax City, VA. Its either a bug in esri2geo.js or OpenLayers geoJSON formatter
        //need to figure this out. but till then, the below if is an adjustment
            if(geoJson.features[0].geometry.type === 'Polygon' && geoJson.features[0].geometry.coordinates[0].length > 1 && geoJson.features[0].geometry.coordinates[0][0].length > 2)
            {
                geoJson.features[0].geometry.type = "MultiPolygon";
            }
    	//** FIX AND DELETE ASAP END
		features = formatter.read(geoJson);
		vectors.addFeatures(features);
	});

	vectors.name = options.name;
	vectors.mashup_type = 'vector';
	vectors.events.on({
		'featureselected': onFeatureSelect,
		'featureunselected': onFeatureUnselect,
		'featuresadded': featuresAddedEvent
	});

	options.map.addLayer(vectors);
	return vectors;
};

layerAddedEvent = function(options) {
	if (options.layer.mashup_type == 'vector') {
		selectControl = new OpenLayers.Control.SelectFeature(options.layer);
		selectControl.id_name = 'select';
		map.addControl(selectControl);
		selectControl.activate();
	}
};

fetchDataCrossDomain = function(URL, successFunction) {
	console.log('Fetching JSON');
	$.ajax({
		url: URL,
		dataType: 'jsonp',
		success: successFunction,
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
};