angular.module('app').service('ContactsService', [
    '$http', '$state', 'Session', 'Database',
    function ($http, $state, Session, Database) {
        var that = this;

        this.Contacts = undefined;
        this.Contact = {};
        this.initialized = false;

        this.init = function () {
            if (!that.initialized) {
                that.getContacts(Session.id)
                    .then(function (response) {
                        if (response && response.data && response.data.data) {
                            that.Contacts = response.data.data;
                            that.initialized = true;
                        }
                    });
            }
        };

        this.getContacts = function () {
            return Database.select({
                table: "vw_contacts",
                fields: "userId",
                where: Session.id
            });
        };

        this.getContact = function (id) {
            if (that.Contacts && that.Contacts.length > 0) {
                return that.Contacts.find(function (contact) {
                    return contact.id === id;
                });
            } else {
                return Database.select({
                    table: "contacts",
                    fields: "id",
                    where: id
                });
            }
        };

        this.insertContact = function (Contact) {
            return Database.insert(Contact);
        };
    
        this.updateContact = function (Contact) {
            return Database.update(Contact)
        };
    
        this.deleteContact = function (Contact) {
            return Database.delete(Contact);
        };

    }
]); //ContactsService