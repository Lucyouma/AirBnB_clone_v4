$(document).ready(function () {
  const amenitiesChecked = [];

  function updateStatusClass(status) {
    const apiStatusDiv = $('#api_status');

    if (status == 'OK') {
      console.log('updating status');
      apiStatusDiv.addClass('available');
    } else {
      console.log('removing class');
      apiStatusDiv.removeClass('available');
    }
  }

  //   alert('moving to status');

  $.get('http://127.0.0.1:5001/api/v1/status/', function (data) {
    if (data.status) {
      //   alert('status is ', data.status);
      console.log(data.status);
      updateStatusClass(data.status);
    } else {
      console.error('Status not found in response:', data);
    }
  }).fail(function () {
    console.error('Failed to fetch status from server.');
  });

  $('input[type="checkbox"]').on('change', function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).prop('checked')) {
      amenitiesChecked.push({ id: amenityId, name: amenityName });
    } else {
      const ammenityIndex = amenitiesChecked.findIndex(
        (amenity) => amenity.id == amenityId,
      );
      if (ammenityIndex !== -1) {
        amenitiesChecked.splice(ammenityIndex, 1);
      }
    }
    const amenitiesList = amenitiesChecked
      .map(function (amenity) {
        return amenity.name;
      })
      .join(',');

    $('.amenities h4').text(amenitiesList);
  });
});
