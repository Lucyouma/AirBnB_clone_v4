$(document).ready(function () {
  const amenitiesChecked = [];

  function updateStatus(status) {
    const apiStatusDiv = $('#api_status');

    if (status == 'OK') {
      apiStatusDiv.addClass('available');
    } else {
      apiStatusDiv.removeClass('available');
    }
  }

  function createArticlePlace(place) {
    return `
            <article>
            <div class="title_box">
                <h2>{{ place.name }}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
                <div class="max_guest">{{ place.max_guest }} Guest{% if place.max_guest != 1 %}s{% endif %}</div>
                <div class="number_rooms">{{ place.number_rooms }} Bedroom{% if place.number_rooms != 1 %}s{% endif
                    %}</div>
                <div class="number_bathrooms">{{ place.number_bathrooms }} Bathroom{% if place.number_bathrooms != 1
                    %}s{% endif %}</div>
            </div>
  
            <div class="description">
                {{ place.description | safe }}
            </div>
        </article>
            `;
  }

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    const status = data.status;
    alert('Status is');
    updateStatus(status);
  });

  $('input[type="checkbox"]').on('change', function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).prop('checked')) {
      amenitiesChecked.push({ id: amenityId, name: amenityName });
    } else {
      const amenityIndex = amenitiesChecked.findIndex(
        (amenity) => amenity.id == amenityId,
      );
      if (amenityIndex !== -1) {
        amenitiesChecked.splice(amenityIndex, 1);
      }
    }
    const amenitiesList = amenitiesChecked
      .map(function (amenity) {
        return amenity.name;
      })
      .join(',');
    console.log(amenitiesList);

    $('.amenities h4').text(amenitiesList);
  });

  $('button').on('click', function () {
    $.post('http://0.0.0.0:5001/api/v1/places_search/', {}, function (data) {
      const places = data;
      const section = $('.places');

      section.empty();

      places.forEach(function (place) {
        const placeArticle = createArticlePlace(place);
        section.append(placeArticle);
      });
    }).fail(function (xhr, textStatus, errorThrown) {
      console.error('Error fetching places:', errorThrown);
    });
  });
});
