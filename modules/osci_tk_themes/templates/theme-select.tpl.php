<?php
	drupal_add_css(drupal_get_path('module', 'osci_tk_themes') . '/css/osci_tk_themes.css');
	drupal_add_js(drupal_get_path('module', 'osci_tk_themes') . '/js/osci_tk_themes.js');
?>

<div id="system-themes-page">
	<h1>OSCI Themes</h1>
	<div class="system-themes-list system-themes-list-enabled clearfix">
		<div class="form-item form-type-select">
			<label>Select a Publication</label>
			<select id="OsciPubSelect" name="OsciPubId" class="form-select">
				<option selected disabled>Select a Publication</option>
				<?php foreach ($data['publications'] as $pub) : ?>
				<option value="<?php echo $pub['vid']; ?>"><?php echo $pub['title']; ?></option>
				<?php endforeach; ?>
			</select>
		</div>
		<div id="help">
			<p>Help Text</p>
		</div>
		<?php foreach ($data['publications'] as $pub) : ?>
		<div id="<?php echo $pub['vid'] . '-theme-list'; ?>" class="theme-list is-hidden">
			<h2>Current Theme</h2>
				<div class="theme-selector clearfix">
					<img class="screenshot" src="<?php echo $pub['themes']['current']['screenshot']; ?>">
					<div class="theme-info">
						<h3><?php echo $pub['themes']['current']['name']; ?></h3>
						<div class="theme-description"></div>
						<ul class="operations clearfix">
							<li class="0 first last">
								<a href="/admin/config/system/osci/<?php echo $pub['vid']; ?>/theme-settings">Settings</a>
							</li>
						</ul>
					</div>
				</div>
			<br><br>
			<h2>Available Themes</h2>
			<?php foreach ($pub['themes']['others'] as $theme) : ?>
				<div class="theme-selector clearfix">
					<img class="screenshot" src="<?php echo $theme['screenshot']; ?>">
					<div class="theme-info">
						<h3><?php echo $theme['name']; ?></h3>
						<div class="theme-description"></div>
						<ul class="operations clearfix">
							<li class="0 first last">
								<form method="POST" action="<?php echo $_SERVER['REQUEST_URI'];?>">
									<input type="hidden" value="<?php echo $theme['name']; ?>" name="theme" />
									<input type="hidden" value="<?php echo $pub['vid']; ?>" name="vid" />
									<a href='#' onclick='this.parentNode.submit(); return false;'>
										Set current
									</a>
								</form>
							</li>
						</ul>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php endforeach; ?>
	</div>
</div>