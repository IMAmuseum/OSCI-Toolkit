<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

	<title>OSCI TK Web</title>

	<link rel="stylesheet" href="<?php print $webapp_css_dependencies_path; ?>" />
	<link rel="stylesheet" href="<?php print $webapp_css_path; ?>" />

	<?php if (!empty($webapp_default_theme)): ?>
	<link rel="stylesheet" href="<?php print $webapp_default_theme; ?>" />
	<?php endif; ?>

    <script type='text/javascript' src="<?php print $webapp_js_dependencies_path; ?>"></script>
    <script type='text/javascript' src="<?php print $webapp_js_path; ?>"></script>

    <script>
		jQuery(function() {
			app.bootstrap({
				packageUrl: '<?php print $package_path; ?>',
				templateUrls: [
					'js/oscitk/templates/'
				],
				endpoints: {
					'OsciTkNotes': '/api/notes/',
					'OsciTkNote': '/api/notes/',
					'OsciTkSearch': '/api/search/',
					'OsciTkOpenSearch': '/api/opensearch/',
					'OsciTkAccount': '/api/users/',
					'OsciTkCitation': '/api/citations/'
				},
				toolbarItems: [
					{view: 'Toc', text: 'ToC'},
					{view: 'Notes', text: 'Notes'},
					{view: 'Figures', text:' Figures'},
					{view: 'Search', text: 'Search'},
					{view: 'Font', text: 'Font'},
					{view: 'Account', text: 'Account'}
				],
				sectionView: 'MultiColumnSection',
				sectionViewOptions: {
					minColumnWidth : 200,
					maxColumnWidth : 300,
					gutterWidth : 40,
					minLinesPerColumn : 5,
					defaultLineHeight: 16
				},
				paragraphControls: {
					'toggleNoteDialog': 'note',
					'toggleCiteDialog': 'cite'
				}
			});

            app.zotero.init();
			app.run();

			<?php if ($section_id !== null) { ?>
				app.router.navigate("section/<?php print $section_id; ?>", {trigger: true});
			<?php } ?>
		});
	</script>
</head>
<body>
	<!-- Content is injected here by backbone -->
</body>
</html>