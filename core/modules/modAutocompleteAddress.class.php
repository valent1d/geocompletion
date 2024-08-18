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


include_once DOL_DOCUMENT_ROOT .'/core/modules/DolibarrModules.class.php';

class modAutocompleteAddress extends DolibarrModules
{
    public function __construct($db)
    {
        global $langs, $conf;

        $this->db = $db;
        $this->numero = 47891630;
        $this->rights_class = 'autocompleteaddress';
        $this->family = "crm";
        $this->module_position = 500;
        $this->editor_name = 'Digibleo';
        $this->editor_url = 'https://www.digibleo.com';
        $this->name = preg_replace('/^mod/i', '', get_class($this));
        $this->description = "Autocomplétion intelligente des adresses françaises";
        $this->descriptionlong = "Module d'autocomplétion des adresses françaises utilisant l'API adresse.data.gouv.fr pour un remplissage rapide et précis des formulaires d'adresse dans Dolibarr.";
        $this->version = '1.0';
        $this->const_name = 'MAIN_MODULE_' . strtoupper($this->name);
        $this->picto = 'autocompleteaddress@autocompleteaddress';
        $this->module_parts = array(
            'hooks' => array(
                'formaddress',
                'thirdpartycard',
                'contactcard',
                'membercard',
                'propalcard',
                'ordercard',
                'invoicecard'
            ),
            'css' => array(
                '/autocompleteaddress/css/autocompleteaddress.css',
            ),
            'js' => array(
                '/autocompleteaddress/js/autocompleteaddress.js'
            ),
        );
        
        // Config page
        $this->config_page_url = array("setup.php@autocompleteaddress");
        
        //Modules .md files
        $this->docs = array(
        'readme' => array('README.md'),
        'changelog' => array('ChangeLog.md')
        );
    
        // Dependencies
        $this->hidden = false;
        $this->depends = array();
        $this->requiredby = array();
        $this->conflictwith = array();
        $this->langfiles = array("autocompleteaddress@autocompleteaddress");

        // Constants
        $this->const = array();

        // Array to add new pages in new tabs
        $this->tabs = array();

        // Dictionaries
        $this->dictionaries = array();

        // Boxes/Widgets
        $this->boxes = array();

        // Cronjobs (List of cron jobs entries to add when module is enabled)
        $this->cronjobs = array();

        // Permissions provided by this module
        $this->rights = array();

        // Main menu entries to add
        $this->menu = array();

    }

    public function init($options = '')
    {
        $sql = array();
        return $this->_init($sql, $options);
        $langs->load("autocompleteaddress@autocompleteaddress");
    }
}