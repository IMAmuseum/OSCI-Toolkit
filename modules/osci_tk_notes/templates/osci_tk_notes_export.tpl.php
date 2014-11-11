<!DOCTYPE html>
<html>
    <head>
        <title>Notes | Online Scholarly Catalogues | The Art Institute of Chicago</title>
        <style type="text/css">
			body {
				margin: 0;
				}
			#osci_header {
				background: #464646 url('/sites/all/themes/osci/images/bg-header-bar-left.png') no-repeat;   
				height: 26px;
				position: absolute;
				width: 100%;
				top: 0;
				max-width: 100%;
				
				}
			#osci_header h1 {
				font-size: 14px; 
				border: 0px;  
				margin: 0;
				color: #d8d8d8;
				display: inline-block;
				text-align: left!important;
				color: #d8d8d8;
				padding: 5px 0 0 40px;
			}
			#page-wrapper {
			  min-height: 100%;
			  min-width: 960px;
				}
				
			#notes {
				position: relative;
				top: 20px;	
				margin: 0 0 0 20px;
			}
			h2 {
				margin:0;
				border-bottom: 1px solid #CCC;
            }
            h3 {
                margin: 0 0 0 20px;
                color: #777;
            }
            ul {
                list-style-type: none;
            }
            div {
                max-width: 800px;
            }
            .note {
                max-width: 600px;
                background-color: #EEE;
                padding: 20px;
            }
            .note_meta {
                margin: 10px 0 0 0;
                color: #777;
            }
            .note_meta * {
                display: inline;
            }
        </style>
    </head>
    <body class="html not-front not-logged-in no-sidebars page-user page-user-register">
    <div id="page-wrapper"><div id="page">

  <div id="osci_header" class="with-secondary-menu"><div class="section clearfix">
    <h1>Online Scholarly Catalogues | The Art Institute of Chicago</h1>
  </div></div> <!-- /.section, /#header -->
        <div id="notes">
            <h1>Your Notes</h1>
            <?php if (!$notes) {
					print 'No notes have been taken at this time.';
					break;
			}else {foreach ($notes as $pub) { ?>
            <div class="publication">
                <h2><?php print $pub['title']; ?></h2>
                <?php foreach ($pub['sections'] as $section) { ?>
                <div class="section">
                    <h3><?php print $section['title']; ?></h3>
                    <ul>
                    <?php foreach ($section['notes'] as $note) { ?>
                        <li>
                            <div class="note" data-pid="<?php print $note->cid; ?>">
                                <div class="note_text"><?php print $note->body; ?></div>
                                <div class="note_meta">
                                    <div class="pnum">Paragraph <?php print $note->pnum; ?></div> | <div class="note_tags">Tags: <?php print $note->tags; ?></div>
                                </div>
                            </div>
                        </li>
                    <?php } ?>
                    </ul>
                </div>
                <?php } ?>
            </div>
            <?php } }?>
        </div>
        </div></div> <!-- /#page, /#page-wrapper -->
  </body>
</html>