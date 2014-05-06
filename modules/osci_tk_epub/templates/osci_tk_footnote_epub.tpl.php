<section epub:type='footnotes' id="footnotes">
	<?php
    //sort array by footnote_index
    function cmp($a, $b)
    {
        $myindex1 = (int)$a['footnote_index'];
        $myindex2 = (int)$b['footnote_index'];
        return $myindex1 > $myindex2;
    }
    usort($items, "cmp");
    ?>
	<?php for($i = 0; $i < count($items); $i++):?>
		<aside epub:type='footnote' id="<?php print $items[$i]['fn_id']; ?>" class="footnote" data-footnote_index="<?php print $items[$i]['footnote_index']; ?>">
		  <?php print $items[$i]['value']; ?>
		</aside>
	<?php endfor; ?>	
</section>
