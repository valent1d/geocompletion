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

document.addEventListener('DOMContentLoaded', function() {
    const AutocompleteAddress = {
        init: function() {
            console.log("AutocompleteAddress initialized");
            this.setupAllAddressFields();
        },

        setupAllAddressFields: function() {
            // Sélectionner tous les champs d'adresse potentiels
            const addressFields = document.querySelectorAll('textarea[name="address"], textarea[name="address1"], textarea[name^="address"], input[name="address"], input[name="address1"], input[name^="address"]');
            addressFields.forEach(field => {
                this.setupAutocomplete(field);
            });
        },

        setupAutocomplete: function(field) {
            // Créer et insérer le wrapper
            const wrapper = document.createElement('div');
            wrapper.classList.add('autocomplete-wrapper');
            field.parentNode.insertBefore(wrapper, field);
            wrapper.appendChild(field);

            // Ajouter la classe au champ
            field.classList.add('autocomplete-input');
            field.setAttribute('autocomplete', 'off');

            // Créer le conteneur de résultats
            const resultsContainer = document.createElement('div');
            resultsContainer.classList.add('autocomplete-results');
            wrapper.appendChild(resultsContainer);

            // Ajouter les écouteurs d'événements
            field.addEventListener('input', this.debounce(this.handleInput.bind(this, field), 300));
            field.addEventListener('focus', () => this.showResults(field));
            document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                    this.hideResults(field);
                }
            });

            // Observer les changements de taille du textarea
            const resizeObserver = new ResizeObserver(() => {
                this.adjustResultsContainerWidth(resultsContainer, field);
            });
            resizeObserver.observe(field);
        },

        adjustResultsContainerWidth: function(resultsContainer, field) {
            // Ajuster la largeur du conteneur de résultats pour correspondre à celle du champ d'adresse
            resultsContainer.style.width = `${field.offsetWidth}px`;
        },

        handleInput: function(field) {
            const query = field.value.trim();
            if (query.length < 3) {
                this.hideResults(field);
                return;
            }

            console.log("Autocomplete request sent for term:", query);
            fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`)
                .then(response => response.json())
                .then(data => this.displayResults(field, data.features))
                .catch(error => console.error("Autocomplete request failed:", error));
        },

    displayResults: function(field, features) {
        const resultsContainer = field.nextElementSibling;
        resultsContainer.innerHTML = '';
    
        if (features.length === 0) {
            this.hideResults(field);
            return;
        }
    
        const ul = document.createElement('ul');
        features.forEach((feature) => {
            const li = document.createElement('li');
            li.classList.add('autocomplete-item');
    
            // Extraction des informations
            const street = feature.properties.name || ''; // Rue
            const postcode = feature.properties.postcode || ''; // Code postal
            const city = feature.properties.city || ''; // Ville
    
            // Extraction du contexte pour obtenir le numéro et le nom du département
            const contextParts = feature.properties.context.split(',');
            const departmentCode = contextParts[0].trim(); // Numéro du département (ex: "80")
            const departmentName = contextParts[1].trim(); // Nom du département (ex: "Somme")
            const regionName = contextParts[2] ? contextParts[2].trim() : ''; // Nom de la région (ex: "Hauts-de-France")
    
            // Construction du texte d'affichage avec le département et la région
            const addressText = [street, postcode, city].filter(Boolean).join(', ') + ` (${departmentCode} ${departmentName}, ${regionName})`;
    
            li.innerHTML = this.highlightMatch(addressText, field.value);
            li.addEventListener('click', () => this.selectResult(field, feature.properties, departmentCode));
            ul.appendChild(li);
        });
    
        resultsContainer.appendChild(ul);
        this.adjustResultsContainerWidth(resultsContainer, field); // Ajuster la largeur ici aussi
        this.showResults(field);
    },



        highlightMatch: function(text, query) {
            const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<strong>$1</strong>');
        },

        selectResult: function(field, properties, departmentFormatted) {
            const form = field.closest('form');
            field.value = properties.name;
        
            // Mise à jour des champs associés (ville, code postal)
            const townInput = form.querySelector('input[name="town"], input[name^="town"][type="text"]');
            const zipInput = form.querySelector('input[name="zip"], input[name^="zip"][type="text"]');
            const departmentSelect = form.querySelector('select[name="state_id"]'); // Liste déroulante des départements
        
            if (townInput) townInput.value = properties.city;
            if (zipInput) zipInput.value = properties.postcode;
        
            // Sélection automatique du département
            if (departmentSelect) {
                const departmentCode = departmentFormatted.split(' ')[0]; // Extraire le code du département (ex: "75")
                
                // Parcourir toutes les options de la liste déroulante pour trouver celle qui correspond
                Array.from(departmentSelect.options).forEach(option => {
                    const optionText = option.textContent.trim();
                    if (optionText.startsWith(departmentCode)) {
                        option.selected = true; // Sélectionner l'option correspondante
                    }
                });
                
                // Si vous utilisez Select2, déclenchez un rafraîchissement visuel
                if ($(departmentSelect).hasClass('select2-hidden-accessible')) {
                    $(departmentSelect).trigger('change');
                }
            }
        
            this.hideResults(field);
        },


        showResults: function(field) {
            const resultsContainer = field.nextElementSibling;
            if (resultsContainer && resultsContainer.classList.contains('autocomplete-results')) {
                resultsContainer.style.display = 'block';
            }
        },

        hideResults: function(field) {
            const resultsContainer = field.nextElementSibling;
            if (resultsContainer && resultsContainer.classList.contains('autocomplete-results')) {
                resultsContainer.style.display = 'none';
            }
        },

        debounce: function(func, delay) {
            let timeoutId;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(context, args), delay);
            };
        }
    };

    AutocompleteAddress.init();
});
