<?php
	drupal_add_css(drupal_get_path('module', 'osci_tk_themes') . '/css/osci_tk_themes.css');
	drupal_add_js(drupal_get_path('module', 'osci_tk_themes') . '/js/osci_tk_themes.js');
?>

<h2><?php echo $data['publication']->title; ?> Theme Settings</h2>
<div id="help">
	<p>Help Text</p>
</div>
<form method="POST" action="<?php echo $_SERVER['REQUEST_URI'];?>">
<input type="hidden" value="<?php echo $data['publication']->vid; ?>" name="vid" />
<div class="form-item">
	<label>Theme Settings</label>
	<div class="form-textarea-wrapper resizable textarea-processed resizable-textarea">
		<textarea class="form-textarea" name="theme-settings" cols="60" rows="30">
			<?php echo $data['publication']->field_osci_tk_theme_settings['und'][0]['value']; ?>
		</textarea>
	</div>
</div>


<div class="form-actions">
	<input type="submit" value="Save configuration" class="form-submit" />
</div>

</form>

