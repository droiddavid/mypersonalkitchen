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

        this.getContacts = function (id) {
            return Database.select({
                table: "contacts",
                fields: "userId",
                where: Session.id
            });
        };
    }
]); //ContactsService