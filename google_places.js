var _google_places_service = null;

/**
 * Implements hook_menu().
 */
function google_places_menu() {
  try {
    var items = {};
    items['google/places/%/%'] = {
      title: 'Place',
      page_callback: 'google_places_page',
      pageshow: 'google_places_pageshow',
      page_arguments: [2, 3]
    }
    return items;
  }
  catch (error) { console.log('google_places_menu - ' + error); }
}

/**
 *
 */
function google_places_page(place_id, map) {
  try {
    var content = {};
    content['place'] = {
      markup: '<div id="google_places_' + place_id + '"></div>'
    }; 
    return content;
  }
  catch (error) { console.log('google_places_page - ' + error); }
}

/**
 *
 */
function google_places_pageshow(place_id, map) {
  try {
    if (!_google_places_service) {
      _google_places_service = new google.maps.places.PlacesService(window[map]);
    }
    _google_places_service.getDetails(
      { placeId: place_id },
      google_places_get_details_callback
    );
  }
  catch (error) { console.log('google_places_pageshow - ' + error); }
}

/**
 *
 */
function google_places_get_details_callback(place, status) {
  try {
    var html = 'Failed to load place!';
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(place);
      html = theme('google_place', { place: place });
    }
    $('#google_places_' + place.place_id).html(html).trigger('create');
  }
  catch (error) { console.log('google_places_get_details_callback - ' + error); }
}

/**
 *
 */
function theme_google_place(variables) {
  try {
    var html = '';
    var place = variables.place;
    
    // Name.
    html += '<div data-role="header" data-theme="b"><h2>' + place.name + '</h2></div>'
    
    // Address and directions.
    html += '<p>' + place.formatted_address + '</p>';
    var directions_link = 'https://www.google.com/maps/dir//' +
      encodeURIComponent(place.name) + ',' +
      encodeURIComponent(place.formatted_address);
    html += bl('Directions', directions_link, {
        InAppBrowser: true,
        attributes: {
          'data-icon': 'navigation'
        }
    });
    
    // Phone.
    if (drupalgap.settings.mode == 'web-app') {
      html += '<div data-role="header"><h3>' + place.formatted_phone_number + '</h3></div>';
    }
    else {
      var phone = place.international_phone_number;
      phone = phone.replace(' ', '');
      phone = phone.replace('-', '');
      html += bl(place.formatted_phone_number, null, {
          attributes: {
            href: 'tel:' + phone,
            'data-icon': 'phone'
          }
      });
    }
    
    // Website.
    if (!empty(place.website)) {
      bl(place.website, place.website, {
          InAppBrowser: true
      });
    }
    
    
    
    return html;
  }
  catch (error) { console.log('theme_google_place - ' + error); }
}

