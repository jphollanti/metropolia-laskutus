$(function() {
  $("#customer").change(function() {
    // load people belonging to this customer
    $.getJSON(
      "/invoice/people?customer=" + $("#customer option:selected").val()
      , function(data) {
          $("#person").empty();
          
          $.each( data, function(index, person) {
            $("#person").append('<option value="' + person._id + '">' + person.firstname + ' ' + person.lastname + '</option>');
          });
        }
    );
  });
});
