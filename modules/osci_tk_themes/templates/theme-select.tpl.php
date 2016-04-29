<?php
	drupal_add_css(drupal_get_path('module', 'osci_tk_themes') . '/css/osci_tk_themes.css');
?>

<div id="system-themes-page">
	<div class="system-themes-list system-themes-list-enabled clearfix">
		<div id="<?php echo $data['pub']['vid'] . '-theme-list'; ?>" class="theme-list">
			<h2>Current Theme</h2>
				<div class="theme-selector clearfix">
					<img class="screenshot" src="/osci-themes/dist/themes/<?php echo $data['pub']['themes']['current']['name'].'/'.$data['pub']['themes']['current']['screenshot']; ?>">
					<div class="theme-info">
						<h3><?php echo $data['pub']['themes']['current']['name']; ?></h3>
						<div class="theme-description"></div>
						<ul class="operations clearfix">
							<li class="0 first last">
								<a href="/admin/config/system/osci/<?php echo $data['pub']['vid']; ?>/theme-settings">Settings</a>
							</li>
						</ul>
					</div>
				</div>
			<hr><br>
			<h2>Available Themes</h2>
			<?php foreach ($data['pub']['themes']['others'] as $theme) : ?>
				<div class="theme-selector clearfix">
					<img class="screenshot" src="/osci-themes/dist/themes/<?php echo $theme['name'].'/'.$theme['screenshot']; ?>">
					<div class="theme-info">
						<h3><?php echo $theme['name']; ?></h3>
						<div class="theme-description"></div>
						<ul class="operations clearfix">
							<li class="0 first last">
								<form method="POST" action="<?php echo $_SERVER['REQUEST_URI'];?>">
									<input type="hidden" value="<?php echo $theme['name']; ?>" name="theme" />
									<input type="hidden" value="<?php echo $data['pub']['vid']; ?>" name="vid" />
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
	</div>
</div>