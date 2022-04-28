
const Database = require('better-sqlite3')
// const { open, Database } = require('sqlite');
const address = "testDB copy.db"
// const address = "abc.db"

const filter = {

    "config": NaN,
    "build": NaN,
    "program": NaN,
    "stress": NaN,
    "checkpoint": NaN,
    "serial_number": NaN,
    "serial_number_list": NaN,
    "wip": NaN,
    "failure_group": NaN,
    "failure_mode": NaN,
    "selected_row": NaN,
    "selected_pks": NaN,
    "station": NaN,
    "note": NaN,
    "file_creation_time": NaN
}

class DBsqlite {
    constructor(address) {
        this.memory_db = false
        try{
            this.db = new Database(address, {verbose: console.log});
        } catch (error){
            this.db = new Database(":memory:", {verbose: console.log});
            this.memory_db = true
            console.log("error access the file, creating a new database file instead")
        }
            
    }

    init(){
        // check if database can be used in app, if upgrade is needed.
        if (this.ok2use()){
            console.log("database initialized for app")
            return true
        } else {
            this.db = new Database(":memory:", {verbose: console.log});
            console.log("database is not compatible with the app, in memory db created")
        }
    }
    
    ok2use(){       
        try {
            const result = this.db.prepare("SELECT * FROM RelLog_T LIMIT 1").get();
            if (result){return true}
        } catch (error){
            return false
        }
    }

    tableau_output(){
        const sql = 'SELECT FailureMode_T.FailureGroup,FailureMode_T.FailureMode, Config_T.Program,Config_T.Build,Config_T.Config,\
        RelStress_T.RelStress,RelStress_T.RelCheckpoint, A.SerialNumber, A.StartTime,A.EndTime, A.FA_Details\
        from \
        (SELECT SerialNumber,  StartTime, EndTime, FK_RelStress, NULL as FK_FailureMode, NULL as FA_Details, WIP,StartTimestamp\
        From RelLog_T where removed = 0 \
        UNION\
        SELECT SerialNumber,  StartTime, StartTime  as EndTime, FK_RelStress, FK_FailureMode,FA_Details, NULL as WIP,StartTimestamp\
        From FALog_T where removed = 0\
		) as A \
        LEFT JOIN FailureMode_T on FailureMode_T.PK = A.FK_FailureMode\
        INNER JOIN Config_SN_T on Config_SN_T.SerialNumber = A.SerialNumber\
        INNER JOIN Config_T on Config_T.PK = Config_SN_T.Config_FK\
        INNER JOIN RelStress_T on RelStress_T.PK = A.FK_RelStress\
		order by A.StartTimestamp DESC';
        const result = this.db.prepare(sql).all();
        console.log(result)
    }
    
  }
    
const db_model = new DBsqlite(address)
db_model.init()
db_model.tableau_output()
// console.log (db_model.ok2use())