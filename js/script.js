$( document ).ready(function() {

    // replace "toner" here with "terrain" or "watercolor"
    var layer = new L.StamenTileLayer("watercolor");
    var map = new L.Map("map", {
        center: new L.LatLng(20, 10),
        zoom: 2
    });
    map.addLayer(layer);
    var markers = L.featureGroup().addTo(map);
    var selectedMarker = L.featureGroup().addTo(map);
    function getQuote(countryID, countryTitle) {
        $("#book-ref").hide();
        $("#quote-loading").show();
        $.getJSON("https://loc-books-yajhxrvxsa-ts.a.run.app/loc-books.json?sql=select+*+from+sentences+inner+join+books+on+sentences.book_id+%3D+books.id+where+sentences.country_id+%3D+%22" + countryID +"%22+ORDER+BY+RANDOM()+LIMIT+1&_shape=array", function(data) {
            $("#quote-loading").hide();
            $("#book-ref").show();
            $("#country-title").html(countryTitle);
            $("#quote").html(data[0].sentence);
            $("#book-cite").html("&ndash; <a href='https://www.loc.gov/item/" + data[0].book_id + "'>"  + data[0].title + "</a>, " + data[0].date);
            $("#book-thumb").prop("src", data[0].image_url);
        });
    }

    function onMarkerClick(e) {
        markers.setStyle({"color":"#3388ff", "weight": 1, "fillOpacity":0.4, "fillColor": "#3388ff"});
        e.target.setStyle({"color": "#D63230", "weight": 3, "fillColor": "#D63230", "fillOpacity": 0.6})
        getQuote(e.target.countryID, e.target.country);
    }

    $.getJSON("https://loc-books-yajhxrvxsa-ts.a.run.app/loc-books.json?sql=select+*+from+countries+order+by+title&_shape=array", function(data) {
        $("#sidebar-loading").hide();
        $("#sidebar").show();
        $.each(data, function(i, country) {
            if (country.lat) {
                var marker = L.circleMarker([country.lat, country.lon], options={"weight": 1, "fillOpacity":0.4, "fillColor": "#3388ff"}).addTo(markers);
                marker.country = country.title;
                marker.countryID = country.id;
                marker.on('click', onMarkerClick);
                marker.bindTooltip(country.title);
            }
            $("#select-country").append($("<option>", {value: country.id, text: country.title, "data-lat": country.lat, "data-lon": country.lon}));
        });
    });

    $("#select-country").change(function(){
        map.removeLayer(markers);
        selectedMarker.clearLayers();
        var selected = $(this).find("option:selected");
        var lat = selected.data("lat");
        var lon = selected.data("lon");
        var countryID = selected.val();
        var countryTitle = selected.text();
        if (lat && lon) {
            var marker = L.circleMarker([lat, lon], options={"color": "#D63230", "weight": 3, "fillColor": "#D63230", "fillOpacity": 0.6}).addTo(selectedMarker);
            marker.country = countryTitle;
            marker.countryID = countryID;
            marker.on('click', onMarkerClick);
            marker.bindTooltip(countryTitle);
        }
        getQuote(countryID, countryTitle);
     });

});