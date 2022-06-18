var tilesDb = {
    getItem: function (key) {
        return localforage.getItem(key);
    },

    saveTiles: function (tileUrls) {
        var self = this;

        var promises = [];

        for (var i = 0; i < tileUrls.length; i++) {
            var tileUrl = tileUrls[i];

            (function (i, tileUrl) {
                promises[i] = new Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open('GET', tileUrl.url, true);
                    request.responseType = 'blob';
                    request.onreadystatechange = function () {
                        if (request.readyState === XMLHttpRequest.DONE) {
                            if (request.status === 200) {
                                resolve(self._saveTile(tileUrl.key, request.response));
                            } else {
                                reject({
                                    status: request.status,
                                    statusText: request.statusText
                                });
                            }
                        }
                    };
                    request.send();
                });
            })(i, tileUrl);
        }

        return Promise.all(promises);
    },

    clear: function () {
        return localforage.clear();
    },

    _saveTile: function (key, value) {
        return this._removeItem(key).then(function () {
            return localforage.setItem(key, value);
        });
    },

    _removeItem: function (key) {
        return localforage.removeItem(key);
    }
};
var mymap = L.map('mapid').setView([54.584781, -5.922725], 15);
    
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(mymap);
    
      var polylinePoints = [
            new L.LatLng(54.584781, -5.922725),
            new L.LatLng(54.582173, -5.92162),
            new L.LatLng(54.582083, -5.920831),
            new L.LatLng(54.582073, -5.919496),
            new L.LatLng(54.582571, -5.917532),
            new L.LatLng(54.581881, -5.918004),
            new L.LatLng(54.581707, -5.918015),
            new L.LatLng(54.581486, -5.912141),
            new L.LatLng(54.583609, -5.911706),
            new L.LatLng(54.583062, -5.908316)
         ];
    
         //Parte offline
         var offlineLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tilesDb, {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    minZoom: 13,
    maxZoom: 19,
    crossOrigin: true
});
var offlineControl = L.control.offline(offlineLayer, tilesDb, {
    saveButtonHtml: '<i class="fa fa-download" aria-hidden="true"></i>',
    removeButtonHtml: '<i class="fa fa-trash" aria-hidden="true"></i>',
    confirmSavingCallback: function (nTilesToSave, continueSaveTiles) {
        if (window.confirm('Save ' + nTilesToSave + '?')) {
            continueSaveTiles();
        }
    },
    confirmRemovalCallback: function (continueRemoveTiles) {
        if (window.confirm('Remove all the tiles?')) {
            continueRemoveTiles();
        }
    },
    minZoom: 13,
    maxZoom: 19
});
offlineLayer.addTo(mymap);
offlineControl.addTo(mymap);
offlineLayer.on('offline:below-min-zoom-error', function () {
    alert('Can not save tiles below minimum zoom level.');
});

offlineLayer.on('offline:save-start', function (data) {
    console.log('Saving ' + data.nTilesToSave + ' tiles.');
});

offlineLayer.on('offline:save-end', function () {
    alert('All the tiles were saved.');
});

offlineLayer.on('offline:save-error', function (err) {
    console.error('Error when saving tiles: ' + err);
});

offlineLayer.on('offline:remove-start', function () {
    console.log('Removing tiles.');
});

offlineLayer.on('offline:remove-end', function () {
    alert('All the tiles were removed.');
});

offlineLayer.on('offline:remove-error', function (err) {
    console.error('Error when removing tiles: ' + err);
});
         //Fine parte offline
      var popup = L.popup();
    
      function onMapClick(e) {
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(mymap);
      }

    var marker = L.marker([54.581641, -5.914624]).addTo(mymap);
    marker.bindPopup("<button type='button' class='btn btn-light' data-toggle='modal' data-target='#exampleModal' >Dettagli</button>");
    var marker1 = L.marker([54.584762, -5.92274]).addTo(mymap);
    marker1.bindPopup("<button type='button' class='btn btn-light' data-toggle='modal' data-target='#ModalOrm' >Dettagli</button>");
    var marker2 = L.marker([54.582175, -5.921473]).addTo(mymap);
      mymap.on('click', onMapClick);
    marker2.bindPopup("<button type='button' class='btn btn-light' data-toggle='modal' data-target='#ModalPark' >Dettagli</button>");  
    var marker3 = L.marker([54.583046, -5.908358]).addTo(mymap);
    marker3.bindPopup("<button type='button' class='btn btn-light' data-toggle='modal' data-target='#ModalJohn' >Dettagli</button>");
    var polylineOptions = {
               color: '#3c86d0',
               weight: 6,
               opacity: 0.9
             };

         var polyline = new L.Polyline(polylinePoints, polylineOptions);

         mymap.addLayer(polyline);                        

         // zoom the map to the polyline
         mymap.fitBounds(polyline.getBounds());