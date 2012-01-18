<figure id="<?php print $figure['id']; ?>" <?php print $data; ?> class="<?php print $type; ?>">
    <a name="<?php print $figure['id']; ?>"></a>
    <div class="figureContent">
        <?php print $content; ?>
    </div>
    <?php if (isset($thumbnail)) { ?>
    <div class="figureThumbnail" data-figure_id="<?php print $figure['id']; ?>" data-pager_display="<?php print $figure['catalogNumber'] . '.' . $figure['figCount']; ?>">
        <?php print $thumbnail; ?>
        <span class="figure_number"><?php print isset($figure['number_template']) ? $figure['number_template'] : $figure['id']; ?></span>
    </div>
    <?php } ?>
    <figcaption class="<?php print $figure['id']; ?>">
        <span class="figure_number"><?php print isset($figure['number_template']) ? $figure['number_template'] : $figure['id']; ?></span>
        <?php print $caption; ?>
    </figcaption>
</figure>
