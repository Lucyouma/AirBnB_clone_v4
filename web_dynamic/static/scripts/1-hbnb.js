$(document).ready(function () {
  const amenitiesChecked = [];

  $('input[type="checkbox"]').on('change', function () {
    const amenityName = $(this).data('name');
    const amenityId = $(this).data('id');

    if ($(this).prop('checked')) {
      amenitiesChecked.push({ name: amenityName, id: amenityId });
    } else {
      const amenityIndex = amenitiesChecked.findIndex(
        (amenity) => amenity.id === amenityId,
      );
      if (amenityIndex !== -1) {
        amenitiesChecked.splice(amenityIndex, 1);
      }
    }

    const listOfAmenities = amenitiesChecked
      .map(function (amenity) {
        return amenity.name;
      })
      .join(', ');

    console.log(listOfAmenities);
    $('.amenities h4').text(listOfAmenities);
  });
});
