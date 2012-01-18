<?php
$classes = '';
if (isset($element['#attributes']['class'])) {
    $classes = ' class="' . implode(' ', $element['#attributes']['class']) . '"';
}
?>
<div <?php print $classes; ?>>
    <?php if ($element['#title'] === 'Footnotes') { ?>
        <h2><?php print $element['#title']; ?></h2>
    <?php } ?>
    <div class="content">
        <?php print $element[0]['#markup']; ?>
    </div>
</div>
