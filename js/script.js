$( document ).ready(function() {
    // replace "toner" here with "terrain" or "watercolor"
    var layer = new L.StamenTileLayer("watercolor");
    var map = new L.Map("map", {
        center: new L.LatLng(0, 0),
        zoom: 2
    });
    map.addLayer(layer);

    function onMarkerClick(e) {
        $.getJSON("https://loc-books-yajhxrvxsa-ts.a.run.app/loc-books.json?sql=select+*+from+sentences+inner+join+books+on+sentences.book_id+%3D+books.id+where+sentences.country_id+%3D+%22" + e.target.countryID +"%22+ORDER+BY+RANDOM()+LIMIT+1&_shape=array", function(data) {
            $("#country-title").html("Visit " + e.target.country + "!");
            $("#quote").html(data[0].sentence);
            $("#book-cite").html("&ndash; <a href='https://www.loc.gov/item/" + data[0].book_id + "'>"  + data[0].title + "</a>, " + data[0].date);
        });
    }
    $.getJSON("https://loc-books-yajhxrvxsa-ts.a.run.app/loc-books.json?sql=select+*+from+countries+order+by+title&_shape=array", function(data) {
        $.each(data, function(i, country) {
            if (country.lat) {
                var marker = L.circleMarker([country.lat, country.lon]).addTo(map);
                marker.country = country.title;
                marker.countryID = country.id;
                marker.on('click', onMarkerClick);
            }
        });
    });


});