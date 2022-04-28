require( 'datatables.net-dt' )();
require( 'datatables.net-colreorder-dt' )();
require( 'datatables.net-rowgroup-dt' )();
require( 'datatables.net-select-dt' )();

$(document).ready(function(){
    $("p").click(function(){
      $(this).hide();
    });
  });
$(document).ready(function() {
    $('#example').DataTable({
        "paging":   false,
        "ordering": false,
        "info":     false
    });
} );
