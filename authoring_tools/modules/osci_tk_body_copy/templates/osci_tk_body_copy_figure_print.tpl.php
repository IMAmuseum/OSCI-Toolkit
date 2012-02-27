<div id="<?php print $figure['id']; ?>" <?php print $data; ?> class="<?php print $type; ?> figure">
    <a name="<?php print $figure['id']; ?>"></a>
    <div class="figureContent">
        <?php print $content; ?>
    </div>
    <div class="figureCaption">
        <span class="figure_number">Fig. <?php print isset($figure['figCount']) ? $figure['figCount'] : $figure['id']; ?></span>
        <?php print $caption; ?>
    </div>
</div>
