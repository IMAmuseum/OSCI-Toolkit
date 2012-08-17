OsciTk.templates['account-login'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2>Login</h2>\n<div class="form-error"></div>\n<form id="account-form">\n\t<label for="username">Username:</label>\n\t<input type="text" id="username" placeholder="Username" />\n\t<label for="password">Password:</label>\n\t<input type="password" id="password" placeholder="Password" />\n\t<button type="button" class="login">Log In</button>\n\t<div><a href="#" class="register">Register an account</a></div>\n</form>';
}
return __p;
}
OsciTk.templates['account-profile'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2>Profile</h2>\n<h3>'+
( username )+
'</h3>\n<h4>'+
( email )+
'</h4>\n<div><a href="#" class="logout">Log out</a></div>';
}
return __p;
}
OsciTk.templates['account-register'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2>Register</h2>\n<div class="form-error"></div>\n<form id="account-form">\n\t<label for="username">Username:</label>\n\t<input type="text" id="username" placeholder="Username" />\n\t<label for="password">Password:</label>\n\t<input type="password" id="password" placeholder="Password" />\n\t<label for="email">Email:</label>\n\t<input type="text" id="email" placeholder="Email" />\n\t<button type="button" class="register">Register</button>\n\t<div><a href="#" class="login">Already have an account?</a></div>\n</form>';
}
return __p;
}
OsciTk.templates['figure-reference'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#'+
( id )+
'" class="figure_reference">'+
( title )+
'</a>';
}
return __p;
}
OsciTk.templates['figures'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'figure-browser\'>\n\t<h2>Figures</h2>\n\t<div class=\'figure-tray\'>\n\t\t<div class=\'figure-reel\'>\n\t\t\t';
 _.each(figures, function(figure) {
;__p+='\n\t\t\t\t<figure class=\'thumbnail\' data-figure-id="'+
( figure.id )+
'">\n\t\t\t\t\t';
 if (figure.thumbnail_url != undefined) {
;__p+='\n\t\t\t\t\t\t<img class=\'figure-thumbnail\' src=\''+
( figure.thumbnail_url )+
'\'/>\n\t\t\t\t\t';
 } else {
;__p+='\n\t\t\t\t\t\t<div class=\'figure-thumbnail\'>&nbsp;</div>\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t\t<figcaption>'+
( figure.title )+
'</figcaption>\n\t\t\t\t</figure>\n\t\t\t';
 });
;__p+='\n\t\t</div>\n\t</div>\n</div>\n<div class=\'figure-previews\'>\n\t<div class=\'figure-nav prev\' title=\'Previous figure\'>&lt;</div>\n\t<div class=\'figure-nav next\' title=\'Next Figure\'>&gt;</div>\n\n\t<h2><span class=\'back-to-grid\'>&laquo; Figures</span> | <span class=\'title\'>TITLE</span></h2>\n\t<div class=\'figure-tray\'>\n\t\t<div class=\'figure-reel\'>\n\t\t\t';
 _.each(figures, function(figure) {
;__p+='\n\t\t\t\t<figure class=\'preview\' data-figure-id="'+
( figure.id )+
'">\n\t\t\t\t\t';
 if (figure.thumbnail_url != undefined) {
;__p+='\n\t\t\t\t\t\t<img class=\'figure-preview\' src=\''+
( figure.thumbnail_url )+
'\'/>\n\t\t\t\t\t';
 } else {
;__p+='\n\t\t\t\t\t\t<div class=\'figure-preview\'>&nbsp;</div>\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t\t<div class=\'figure-info\'>\n\t\t\t\t\t\t<!--<h3 class=\'title\'>Figure Title?</h3>-->\n\t\t\t\t\t\t<!--<p class=\'meta-info\'>meta info | more meta</p>-->\n\t\t\t\t\t\t<div class=\'caption\'>\n\t\t\t\t\t\t\t'+
( figure.caption )+
'\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<a class=\'view-in-context\'>View in context</a>\n\t\t\t\t</figure>\n\t\t\t';
 });
;__p+='\n\t\t</div>\n\t</div>\n</div>';
}
return __p;
}
OsciTk.templates['font'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2>Reading Settings</h2>\n<div class="font-control">\n\t<h3>Font Size</h3>\n\t<a href="#font-larger" class="larger font-button">A</a>\n\t<a href="#font-smaller" class="smaller font-button">A</a>\n</div>\n<div class="theme-control">\n\t<h3>Theme</h3>\n\t<a href="#normal" class="theme-button">Normal</a>\n\t<a href="#sepia" class="theme-button">Sepia</a>\n\t<a href="#night" class="theme-button">Night</a>\n</div>';
}
return __p;
}
OsciTk.templates['multi-column-column'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="column"></div>';
}
return __p;
}
OsciTk.templates['multi-column-figure'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="figure_content"></div>\n<figcaption>'+
( caption )+
'</figcaption>';
}
return __p;
}
OsciTk.templates['multi-column-section'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="pages"></div>';
}
return __p;
}
OsciTk.templates['navigation'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'header\'>'+
( chapter )+
'</div>\n<div class=\'prev-page side\'><div class=\'indicator\'>&lt;</div></div>\n<div class=\'next-page side\'><div class=\'indicator\'>&gt;</div></div>\n<div class=\'prev-page corner\'>\n\t<div class=\'label\'>Previous</div>\n\t<div class=\'button\'>&nbsp;</div>\n</div>\n<div class=\'pager\'><div class=\'head\'>&nbsp;</div></div>\n<div class=\'next-page corner\'>\n\t<div class=\'label\'>Next</div>\n\t<div class=\'button\'>&nbsp;</div>\n</div>';
}
return __p;
}
OsciTk.templates['notes'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2>Notes</h2>\n<ul>\n\t';
 _.each(notes, function(note) {
;__p+='\n\t\t<li>\n\t\t\t<p>P#'+
( note.paragraph_id )+
' - '+
( note.note )+
'<br>\n\t\t\t';
 if (note.tags.length > 0) {
;__p+='\n\t\t\t\t<small>tags: ';
 _.each(note.tags, function(tag) {
;__p+=''+
( tag )+
' ';
 });
;__p+='</small>\n\t\t\t';
 }
;__p+='\n\t\t\t</p>\n\t\t</li>\n\t';
 });
;__p+='\n</ul>';
}
return __p;
}
OsciTk.templates['page'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( content )+
'';
}
return __p;
}
OsciTk.templates['search-result'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="search-result-title">'+
( title )+
'</div>\n<div class="search-result-type type-'+
( type )+
'">'+
( type )+
'</div>\n<div class="search-result-content">'+
( content )+
'</div>';
}
return __p;
}
OsciTk.templates['search-results'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="search-summary">Result(s) for "'+
( keyword )+
'" ('+
( result_count )+
')</div>\n<div id="search-sort">\n\tSort By: \n\t<div id="search-sort-relevance" data-selected="0">Relevance</div>\n\t<div id="search-sort-type" data-selected="0">Type</div>\n</div>\n<div id="search-results">'+
( search_results )+
'</div>';
}
return __p;
}
OsciTk.templates['search'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="search-header">\n\t<div id="search-box">\n\t\t<form id="search-form" name="search-form" method="POST">\n\t\t\t<input type="text" name="keyword" id="search-keyword" placeholder="search" value="'+
( query )+
'"/>\n\t\t\t<input type="hidden" name="page" id="search-page" />\n\t\t</form>\n\t</div>\n</div>\n';
 if (searchResults.length > 0) {
;__p+='\n\t<div id="search-summary">Result(s) for "'+
( searchResults.keyword )+
'" ('+
( searchResults.length )+
')</div>\n\t<div id="search-sort">\n\t\tSort By: \n\t\t<div id="search-sort-relevance" data-selected="0">Relevance</div>\n\t\t<div id="search-sort-type" data-selected="0">Type</div>\n\t</div>\n\t<div id="search-results">\n\t\t<ul>\n\t\t\t';
 _.each(searchResults.models, function(result) {
;__p+='\n\t\t\t\t';
 if (result.get('bundle') === 'note') {
;__p+='\n\t\t\t\t\t<li>\n\t\t\t\t\t\t'+
( result.get('bundle_name') )+
' \n\t\t\t\t\t\tsec.'+
( result.get('im_field_section')[0] )+
' p.'+
( result.get('is_paragraph_id') )+
' - \n\t\t\t\t\t\t'+
( result.get('ss_body') )+
'\n\t\t\t\t\t</li>\n\t\t\t\t';
 } else {
;__p+='\n\t\t\t\t\t<li>'+
( result.get('bundle_name') )+
' - '+
( result.get('ss_body') )+
'</li>\n\t\t\t\t';
 }
;__p+='\n\t\t\t';
 });
;__p+='\n\t\t</ul>\n\t</div>\n';
 }
;__p+='';
}
return __p;
}
OsciTk.templates['toc'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2>Table of Contents</h2>\n<ul>\n\t';
 _.each(items, function(item) {
;__p+='\n\t\t<li class="toc-item">\n\t\t\t<a data-section-id="'+
( item.id )+
'" href="#">\n\t\t\t\t<div class="toc-item-thumbnail">\n\t\t\t\t\t';
 if (item.get('thumbnail')) {
;__p+='\n\t\t\t\t\t\t<img src="'+
( item.get('thumbnail') )+
'">\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t</div>\n\t\t\t\t<div class="toc-item-text">\n\t\t\t\t\t<h4>'+
( item.get('title') )+
'</h4>\n\t\t\t\t\t';
 if (item.get('subtitle')) {
;__p+='\n\t\t\t\t\t\t<h5>'+
( item.get('subtitle') )+
'</h5>\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t\t<hr>\n\t\t</li>\n\t';
 });
;__p+='\n</ul>';
}
return __p;
}
OsciTk.templates['toolbar-item'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( text )+
'';
}
return __p;
}
OsciTk.templates['toolbar'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="toolbar-close">Close</div>\n<div id="toolbar-content"></div>\n<div id="toolbar-handle"></div>';
}
return __p;
}