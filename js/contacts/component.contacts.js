angular.module('app').component('contacts', {
    templateUrl: 'partials/contacts/contacts.html',
    controller: [
    '$http', '$state', '$stateParams', 'Session', 'Database','ToolbarService', 'ContactsService', 
    function (
    $http, $state, $stateParams, Session, Database, ToolbarService, ContactService) {
        'use strict';

        var that = this;
        this.messages = [];

        this.$onInit = function () {           
            ToolbarService.init({
                btnPrevious: {
                    id: 'btnPrevious',
                    class: 'glyphicon glyphicon-chevron-left brand',
                    state: 'sendFlyerActivity',
                    style: 'color: white;'
                },
                btnBrand: {
                    id: 'btnBrand',
                    class: 'brand',
                    state: 'sendFlyerActivity',
                    style: 'color: white;',
                    value: 'Contacts'
                },
                menu: [
                    { name: 'HOME (logout)', state: 'index' },
                    { name: 'Invitations', state: 'invitations' },
                    { name: 'Memberships', state: 'memberships' },
                    { name: 'Profile', state: 'profile' }
                ]
            }); //ToolbarService.init(...)
        };
        this.addContact = function () {
            $state.go('addContactActivity');
        };
    }]
});