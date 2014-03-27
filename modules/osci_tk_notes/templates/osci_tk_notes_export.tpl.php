<!DOCTYPE html>
<html>
    <head>
        <title>Notes</title>
        <style type="text/css">
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
    <body>
        <div id="notes">
            <h1>Notes</h1>
            <?php foreach ($notes as $pub) { ?>
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
                                    <div class="pnum">p. <?php print $note->pnum; ?></div> | <div class="note_tags">Tags: <?php print $note->tags; ?></div>
                                </div>
                            </div>
                        </li>
                    <?php } ?>
                    </ul>
                </div>
                <?php } ?>
            </div>
            <?php } ?>
        </div>
    </body>
</html>