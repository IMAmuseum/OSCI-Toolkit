<?php print '<?xml version="1.0" encoding="UTF-8" ?>'; ?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<LongName><?php print $long_name; ?></LongName>  
	<ShortName><?php print $short_name; ?></ShortName>
	<Description><?php print $description; ?></Description>
	<Tags><?php print $tags; ?></Tags>
	<Contact><?php print $contact; ?></Contact>
	<Url type="text/html" 
		xmlns:apachesolr="http://drupal.org/project/apachesolr/7.x-1.0"
		template="<?php print $base_url; ?>/api/search/{searchTerms}?page={startPage?}&amp;filters={apachesolr:filters?}"/>
	<Url type="application/rss+xml"
		xmlns:apachesolr="http://drupal.org/project/apachesolr/7.x-1.0"
		template="<?php print $base_url; ?>/api/opensearch/{searchTerms}?page={startPage?}&amp;filters={apachesolr:filters?}"/>
	<Url type="application/opensearchdescription+xml" rel="self" template="<?php print $base_url; ?>/opensearch/document" />
	<SyndicationRight>open</SyndicationRight>
	<AdultContent><?php print $adult_content; ?></AdultContent>
	<Language><?php print $language; ?></Language>
	<InputEncoding>UTF-8</InputEncoding>
	<OutputEncoding>UTF-8</OutputEncoding>
</OpenSearchDescription>