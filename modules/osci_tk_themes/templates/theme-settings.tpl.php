<?php
	drupal_add_css(drupal_get_path('module', 'osci_tk_themes') . '/css/osci_tk_themes.css');
	drupal_add_js(drupal_get_path('module', 'osci_tk_themes') . '/js/osci_tk_themes.js');
?>

<h2><?php echo $data['publication']->title; ?> Theme Settings</h2>
<div id="help">
	<p>Help Text</p>
</div>
<form method="POST" action="<?php echo $_SERVER['REQUEST_URI'];?>">

<label>Theme Features</label>
<textarea></textarea>

<label>Toolbar Items</label>
<textarea></textarea>

<label>Paragraph Controls</label>
<textarea></textarea>

<div class="form-actions">
	<input type="submit" value="Save configuration" class="form-submit" />
</div>

</form>

