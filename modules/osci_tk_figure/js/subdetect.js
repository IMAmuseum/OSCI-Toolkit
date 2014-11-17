$(function() {
    // detect sub=1 in querystring
    if (window.location.search.indexOf('sub=1') > 0) {
        $('#edit-save-edit').remove();
        $('#edit-preview').remove();

        $('.node-form').submit(function(evt) {
            var form = $('.node-form').first();
            console.log('test');
            $.ajax({
                type: "POST",
                url: form.attr('action'),
                data: form.serialize(), // serializes the form's elements.
                success: function(data)
                {
                    var title = $('#edit-title').val();
                    alert(title + ' has been saved'); // show response from the php script.
                    window.close();
                }
            });
            return false;
        });
    }
});