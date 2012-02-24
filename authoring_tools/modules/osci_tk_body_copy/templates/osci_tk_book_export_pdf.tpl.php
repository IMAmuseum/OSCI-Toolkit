<!DOCTYPE HTML>
<html>
    <head>
        <title><?php print $title; ?></title>
        <?php print $head; ?>
        <base href="<?php print $base_url; ?>" />
        <link type="text/css" rel="stylesheet" href="misc/print.css" />
        <link type="text/css" rel="stylesheet" href="sites/default/modules/osci/css/osci_pdf.css" />
    </head>
    <body>
        <h1><?php print $title; ?></h1>
        <?php $div_close = ''; ?>
        <?php for ($i = 1; $i < $depth; $i++) : ?>
            <div class="section-<?php print $i; ?>">
            <?php $div_close .= '</div>'; ?>
        <?php endfor; ?>
        <?php print $contents; ?>
        <?php print $div_close; ?>
     </body>
</html>