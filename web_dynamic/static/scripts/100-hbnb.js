$(document).ready(function () {
  const amenitiesChecked = [];
  const statesChecked = [];
  const citiesChecked = [];

  function updateStatus(status) {
    const apiStatusDiv = $('#api_status');

    if (status === 'OK') {
      apiStatusDiv.addClass('available');
    } else {
      apiStatusDiv.removeClass('available');
    }
  }

  function createArticlePlace(place) {
    return `
              <article>
              <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                  <div class="max_guest">${
                    place.max_guest
                  } Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${
                    place.number_rooms
                  } Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${
                    place.number_bathrooms
                  } Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
    
              <div class="description">
                  ${place.description}
              </div>
          </article>
              `;
  }

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    const status = data.status;
    updateStatus(status);
  });

  $('input[type="checkbox"]').on('change', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    if ($(this).prop('checked')) {
      if ($(this).closest('li').parent().parent().hasClass('locations')) {
        // If it's a state
        statesChecked.push({ id: id, name: name });
      } else if (
        $(this).closest('li').parent().parent().parent().hasClass('locations')
      ) {
        // If it's a city
        citiesChecked.push({ id: id, name: name });
      } else {
        // If it's an amenity
        amenitiesChecked.push({ id: id, name: name });
      }
    } else {
      if ($(this).closest('li').parent().parent().hasClass('locations')) {
        // If it's a state
        const index = statesChecked.findIndex((state) => state.id == id);
        if (index !== -1) {
          statesChecked.splice(index, 1);
        }
      } else if (
        $(this).closest('li').parent().parent().parent().hasClass('locations')
      ) {
        // If it's a city
        const index = citiesChecked.findIndex((city) => city.id == id);
        if (index !== -1) {
          citiesChecked.splice(index, 1);
        }
      } else {
        // If it's an amenity
        const index = amenitiesChecked.findIndex((amenity) => amenity.id == id);
        if (index !== -1) {
          amenitiesChecked.splice(index, 1);
        }
      }
    }

    const locationsList = [
      ...statesChecked.map((state) => state.name),
      ...citiesChecked.map((city) => city.name),
    ].join(', ');
    $('.locations h4').text(locationsList);

    const amenitiesList = amenitiesChecked
      .map((amenity) => amenity.name)
      .join(', ');
    $('.amenities h4').text(amenitiesList);
  });

  $('button').on('click', function () {
    const searchCriteria = {
      amenities: amenitiesChecked.map((amenity) => amenity.id),
      states: statesChecked.map((state) => state.id),
      cities: citiesChecked.map((city) => city.id),
    };

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify(searchCriteria),
      contentType: 'application/json',
      success: function (data) {
        const places = data;
        const section = $('.places');

        section.empty();

        places.forEach(function (place) {
          const article = createArticlePlace(place);
          section.append(article);
        });
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error('Error fetching places:', errorThrown);
      },
    });
  });
});
