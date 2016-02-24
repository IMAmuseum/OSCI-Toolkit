(function($){
$(document).ready(function(){

$( "#OsciPubSelect" ).change(function() {
    publication = $(this).val();
    publicationList = "#"+publication+"-theme-list";
    $( ".theme-list" ).addClass( "is-hidden" );
    $( publicationList ).removeClass( "is-hidden" );
});

});
})(jQuery);