/*
Author: Shaunak Vairagare
Date: 03/20/2013
Use: This file handles all OpenLayers Marker events
*/

onPopupClose = function(evt) {
   this.map.getControlsBy('id_name','select')[0].unselect(selectedFeature);
};

onFeatureSelect = function(evt) {
    feature = evt.feature;
    selectedFeature = feature;

    popupString = "";
    $.each(feature.attributes, function(key, val) {
        popupString += key + " : " + val + "<br>";
    });

    popup = new OpenLayers.Popup.FramedCloud("Popup", feature.geometry.getBounds().getCenterLonLat(), null, "<div style='font-size:.8em'>" + popupString + " </div>", null, true, onPopupClose);
    feature.popup = popup;
    evt.object.map.addPopup(popup);
};

onFeatureUnselect = function(evt) {
    feature = evt.feature;
    evt.object.map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.popup = null;
};

featuresAddedEvent = function(evt){
    var m =  evt.object.map;
    var b =  evt.object.getDataExtent();
    m.setCenter(b.getCenterLonLat(), m.getZoomForExtent(b,false));
};