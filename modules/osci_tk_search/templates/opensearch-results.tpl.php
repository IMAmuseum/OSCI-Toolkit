<?php print '<?xml version="1.0" encoding="utf-8" ?>'; ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" 
	xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" 
	xmlns:relevance="http://a9.com/-/opensearch/extensions/relevance/1.0/">
	<channel>
		<title><?php print $title; ?>: <?php print $keywords; ?></title>
		<link><?php print $link; ?></link>
		<description><?php print $description; ?></description>
		<language><?php print $language; ?></language>
		<opensearch:totalResults><?php print $result_count; ?></opensearch:totalResults>
		<opensearch:startIndex><?php print $start_index; ?></opensearch:startIndex>
		<opensearch:itemsPerPage><?php print $items_per_page; ?></opensearch:itemsPerPage>
		<atom:link rel="self" href="<?php print $self; ?>" type="application/rss+xml" />
		<atom:link rel="search" href="<?php print $search; ?>" type="application/opensearchdescription+xml" />
		<atom:link rel="alternate" href="<?php print $alternate; ?>" type="text/html" />
		<opensearch:Query role="request" searchTerms="<?php print $keywords; ?>" />
		<?php print $content; ?>
	</channel>
</rss>