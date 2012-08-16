<?php

/**
 * Implements osci_tk_figure_asset_NODE_TYPE_options_form()
 *
 * Options for figure assets must be defined in a custom form
 * per node type.
 */
function osci_tk_figure_asset_NODE_TYPE_options_form() {
    $form['options'] = array(
        '#type'     => 'options',
        '#value'    => array(1,2,3,4),
    );

    return $form;
}
