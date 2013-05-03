window.dao =  {
    syncURL: "http://mosque-finder.com.au/directory/app-data/wp_postmeta_extended.json",

    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("syncdemodb", "1.0", "Sync Demo DB", 200000);

        // Testing if the table exists is not needed and is here for logging purpose only. We can invoke createTable
        // no matter what. The 'IF NOT EXISTS' clause will make sure the CREATE statement is issued only if the table
        // does not already exist.
        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='employee'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
                            console.log('Using existing Employee table in local SQLite database');
                        }
                        else
                        {
                            console.log('Employee table does not exist in local SQLite database');
                            self.createTable(callback);
                        }
                    });
            }
        )

    },
        
    createTable: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql =
                    "CREATE TABLE IF NOT EXISTS employee ( " +
                    "ID INTEGER PRIMARY KEY, " +
                    "post_title VARCHAR(50), " +
                    "post_status VARCHAR(50), " +
                    "post_type VARCHAR(50), " +
                    "Location VARCHAR(50), " +
                    "Longitude VARCHAR(50), " +
                    "Latitude VARCHAR(50), " +
                    "deleted INTEGER, " +
                    "lastModified VARCHAR(50))";
                tx.executeSql(sql);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CURRENTLOCATION(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, latitude VARCHAR(50), longitude VARCHAR(50), altitude VARCHAR(50), accuracy VARCHAR(50),altitudeAccuracy VARCHAR(50), heading VARCHAR(50), speed VARCHAR(50),timestamp VARCHAR(50))');

            },
            this.txErrorHandler,
            function() {
                console.log('Table employee successfully CREATED in local SQLite database');
                callback();
            }
        );
    },

    dropTable: function(callback) {
        this.db.transaction(
            function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS employee');
                tx.executeSql('DROP TABLE IF EXISTS CURRENTLOCATION');
            },
            this.txErrorHandler,
            function() {
                console.log('Table employee successfully DROPPED in local SQLite database');
                callback();
            }
        );
    },

    findAll: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM EMPLOYEE";
                console.log('Local SQLite database: "SELECT * FROM EMPLOYEE"');
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var len = results.rows.length,
                            employees = [],
                            i = 0;
                        for (; i < len; i = i + 1) {
                            employees[i] = results.rows.item(i);
                        }
                        console.log(len + ' rows found');
                        callback(employees);
                    }
                );
            }
        );
    },

    getLastSync: function(callback) {

        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(lastModified) as lastSync FROM employee";
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var lastSync = results.rows.item(0).lastSync;
						if (lastSync == null){
								alert('ls');
							lastSync = new Date();
						}
                        console.log('Last local timestamp is ' + lastSync);
                        callback(lastSync);
                    }
                );
            }
        );
    },

    sync: function(callback) {

        var self = this;
        console.log('Starting synchronization...');
        this.getLastSync(function(lastSync){
            self.getChanges(self.syncURL, lastSync,
                function (changes) {
                    if (changes.length > 0) {
                        self.applyChanges(changes, callback);
                    } else {
                        console.log('Nothing to synchronize');
                        callback();
                    }
                }
            );
        });

    },

    getChanges: function(syncURL, modifiedSince, callback) {

        $.ajax({
            url: syncURL,
            data: {modifiedSince: modifiedSince},
            dataType:"json",
            success:function (data) {
                console.log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                callback(data);
            },
            error: function(model, response) {
                alert(response.responseText);
            }
        });

    },

    applyChanges: function(employees, callback) {
        this.db.transaction(
            function(tx) {
                var l = employees.length;
                var sql =
                    "INSERT OR REPLACE INTO employee (ID, post_title, post_status, post_type, Location,Longitude ,Latitude ,deleted, lastModified) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                console.log('Inserting or Updating in local database:');
                var e;
                for (var i = 0; i < l; i++) {
                    e = employees[i];
                    console.log(e.ID + ' ' + e.post_title+ ' ' + e.post_status+ ' ' + e.post_type+ ' ' + e.Location+ ' ' +  ' ' + e.Longitude + ' ' +  ' ' + e.Latitude + ' ' + e.deleted + ' ' + e.lastModified);
                    var params = [e.ID, e.post_title, e.post_status, e.post_type, e.Location,e.Longitude,e.Latitude, e.deleted, e.lastModified];
                    tx.executeSql(sql, params);
                }
                console.log('Synchronization complete (' + l + ' items synchronized)');
            },
            this.txErrorHandler,
            function(tx) {
                callback();
            }
        );
    },

    txErrorHandler: function(tx) {
        alert(tx.message);
    }
};

dao.initialize(function() {
    console.log('database initialized');
});


function renderList(employees) {
    console.log('Rendering list using local SQLite data...');
    dao.findAll(function(employees) {
        $('#list').empty();
        var l = employees.length;
        for (var i = 0; i < l; i++) {
            var employee = employees[i];
             $('#employeeList').append("<li><a href='employeedetails.html?id="+employee.ID+"' ><h3 class='ui-li-heading'>" +employee.post_title+ "</h3><p class='ui-li-desc'>" + employee.Location +"</p><span class='ui-li-count ui-btn-up-c ui-btn-corner-all'>"+employee.ID+" km</span></a></li>");

                try {
                   $('#employeeList').listview('refresh');
                } catch(e) {
                    $('#employeeList').trigger("create");
                }
        }
    });
}


 // Cordova is ready
    //
function onDeviceReady() {
    dao.sync(renderList);
    $("#btnDelete").click(function() {
    dao.dropTable(renderList);
});    
}