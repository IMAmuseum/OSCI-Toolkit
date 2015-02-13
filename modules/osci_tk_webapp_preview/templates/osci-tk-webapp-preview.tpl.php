<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<link rel="shortcut icon" href="/sites/default/files/favicon.ico" type="image/vnd.microsoft.icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="fragment" content="!" />

    <title>Online Scholarly Catalogues at the Art Institute of Chicago</title>

    <?php foreach($css as $cssPath): ?>
    <link href="<?php print $cssPath; ?>" rel="stylesheet" type="text/css" media="all">
    <?php endforeach; ?>

    <?php foreach($js as $jsPath): ?>
    <script src="<?php print $jsPath; ?>" type="text/javascript"></script>
    <?php endforeach; ?>

    <script>
        jQuery(function() {
            app.bootstrap({
                basePath: "<?php print $basePath; ?>",
                baseUrl: "<?php print $baseUrl; ?>",
                packageUrl: '<?php print $package_path; ?>',
                templateUrls: [
                    <?php print strlen($customTemplatePath) ? "'" . $customTemplatePath . "'," : ''; ?>
                    '<?php print $templatePath; ?>'
                ],
                endpoints: {
                    <?php 
                    $first = true; foreach($endPoints as $k => $v) { 
                        if (!$first) {
                            print ",";
                        }
                        print "'" . $k . "': '" . $v . "'";
                        $first = false;
                    } ?>
                },
                toolbarItems: [<?php print $toolbarItems; ?>],
                sectionView: '<?php print $sectionView; ?>',
                sectionViewOptions: <?php print $sectionViewOptions; ?>,
                paragraphControls: <?php print $paragraphControls; ?>
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
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-WV5SX7"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WV5SX7');</script>
<!-- End Google Tag Manager -->

<!-- Content is injected here by backbone -->
</body>
</html>