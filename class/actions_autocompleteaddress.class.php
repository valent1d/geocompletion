<?php
/*
 * Copyright (C) 2024 Digibleo
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, please contact: hello@digibleo.com
 */

class ActionsAutocompleteAddress
{
    public function addJsFiles($parameters)
    {
        global $conf;

        $context = $parameters['context'];

        if (in_array($context, array('thirdpartycard', 'contactcard', 'membercard', 'propalcard', 'ordercard', 'invoicecard', 'formaddress'))) {
            $this->resPrint = '<script type="text/javascript" src="'.dol_buildpath('/autocompleteaddress/js/autocompleteaddress.js', 1).'"></script>';
            $this->resPrint .= '<link rel="stylesheet" type="text/css" href="'.dol_buildpath('/autocompleteaddress/css/autocompleteaddress.css', 1).'">';
        }

        return 0;
    }

    public function formObjectOptions($parameters, &$object, &$action, $hookmanager)
    {
        global $conf, $user, $langs;

        $out = '';

        if (in_array('thirdpartycard', explode(':', $parameters['context'])) ||
            in_array('contactcard', explode(':', $parameters['context'])) ||
            in_array('membercard', explode(':', $parameters['context'])) ||
            in_array('propalcard', explode(':', $parameters['context'])) ||
            in_array('ordercard', explode(':', $parameters['context'])) ||
            in_array('invoicecard', explode(':', $parameters['context'])) ||
            in_array('formaddress', explode(':', $parameters['context']))) {
            $out .= '<script type="text/javascript">';
            $out .= 'jQuery(document).ready(function() {';
            $out .= '    AutocompleteAddress.init();';
            $out .= '});';
            $out .= '</script>';
        }

        $this->results = array('out' => $out);
        return 0;
    }
}