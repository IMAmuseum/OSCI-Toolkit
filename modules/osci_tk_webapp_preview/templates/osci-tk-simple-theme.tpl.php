<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="fragment" content="!" />

    <title>OSCI Themes</title>

    <?php print $customHead; ?>

    <link rel="stylesheet" href="<?php print $basePath; ?>styles/css/main.css">

    <?php foreach($css as $cssPath): ?>
    <link href="<?php print $cssPath; ?>" rel="stylesheet" type="text/css" media="all">
    <?php endforeach; ?>

    <script src="<?php print $basePath; ?>scripts/vendor.js"></script>
    <script src="<?php print $basePath; ?>scripts/plugins.js"></script>
    <script src="<?php print $basePath; ?>scripts/main.js"></script>

    <?php foreach($js as $jsPath): ?>
    <script src="<?php print $jsPath; ?>" type="text/javascript"></script>
    <?php endforeach; ?>

    <script>
        jQuery(function() {
            // app.bootstrap({
            //     basePath: "<?php print $basePath; ?>",
            //     baseUrl: "<?php print $baseUrl; ?>",
            //     packageUrl: '<?php print $package_path; ?>',
            //     templateUrls: [
            //         <?php print strlen($customTemplatePath) ? "'" . $customTemplatePath . "'," : ''; ?>
            //         '<?php print $templatePath; ?>'
            //     ],
            //     endpoints: {
            //         <?php
            //         $first = true;
            //         foreach($endPoints as $k => $v) {
            //             if (!$first) {
            //                 print ",";
            //             }
            //
            //             print "'" . $k . "': '" . $v . "'";
            //
            //             $first = false;
            //         }
            //         ?>
            //     },
            //     toolbarItems: [<?php print $toolbarItems; ?>],
            //     sectionView: '<?php print $sectionView; ?>',
            //     sectionViewOptions: <?php print $sectionViewOptions; ?>,
            //     paragraphControls: <?php print $paragraphControls; ?>
            // });

            app.bootstrap({
                basePath: "<?php print $basePath; ?>",
                baseUrl: "<?php print $baseUrl; ?>",
                packageUrl: '<?php print $package_path; ?>',
                templateUrls: [
                    <?php print strlen($customTemplatePath) ? "'" . $customTemplatePath . "'," : ''; ?>
                    '<?php print $templatePath; ?>'
                ],
                endpoints: <?php print_r(json_encode ($endPoints));  ?>,
                toolbarItems: [
                    <?php print $toolbarItems; ?>
                ],
                themeFeatures: <?php print $themeFeatures; ?>,
                paragraphControls: <?php print $paragraphControls; ?>
            });
            app.run();

        <?php if ($section_id !== null) { ?>
            app.router.navigate("section/<?php print $section_id; ?>", {trigger: true});
        <?php } ?>
        });
    </script>
</head>
<body>
<!-- Content is injected here by backbone -->

<?php print $customFooter; ?>

</body>
</html>
