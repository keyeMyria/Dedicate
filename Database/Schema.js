import Realm from 'realm'

 export default function Schema(name = "Default") {
    var path = Realm.defaultPath;
    path = path.substring(0, path.lastIndexOf('/') + 1) + name + '.realm';
    global.realm = new Realm({
        path: path,
        schema: [Task, Input, Category, Record, RecordInput, Chart, DataSource],
        schemaVersion: 10, //update version when schema changes dramatically
        migration: function(oldRealm, newRealm) {
            //newRealm.deleteAll();
        }
    });
    global.database = {
        name: name,
        path: path
    };
 }

 ///////////////////////////////////////////////////////////////////////////
 // Schema Classes /////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 class Task {}; ////////////////////////////////////////////////////////////
 Task.schema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        icon: {type: 'int', default: 0},
        color: {type: 'int', default: 0},
        inputs: {type: 'list', objectType: 'Input'},
        category: {type: 'Category'}
    }
 };

 class Input {}; ////////////////////////////////////////////////////////////
 Input.schema = {
    name: 'Input',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        type: {type: 'int', default: 1}
        //0 = Number
        //1 = Text
        //2 = Date
        //3 = Time
        //4 = Date & Time
        //5 = Stop Watch
        //6 = Yes/No
        //7 = 5 Stars
        //8 = Location
        //9 = URL Link
        //10 = Photo
        //11 = Video
     }
 }

 class Category {};
 Category.schema = {
    name: 'Category',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string'
     }
 }

 class Record {}; ///////////////////////////////////////////////////////////
 Record.schema = {
    name: 'Record',
    primaryKey: 'id',
    properties: {
        id: 'int',
        taskId: {type: 'int', indexed: true},

        //recorded date & time range
        datestart: {type: 'date', indexed: true},
        dateend: {type: 'date'},
        time: {type: 'int'}, //total time in seconds
        timer: {type: 'bool', indexed: true}, //determines if timer is currently running
        
        //list of inputs & their values
        inputs: {type: 'list', objectType: 'RecordInput'},

        //task information for record
        task: {type: 'Task'}
     }
 }

 class RecordInput {}; /////////////////////////////////////////////////////
 RecordInput.schema = {
    name: 'RecordInput',
    properties: {
        number: {type: 'float', optional: true},
        text: {type: 'string', optional: true},
        date: {type: 'date', optional: true},
        type: {type: 'int'},

        //input information for record input
        taskId: {type: 'int', indexed:true},
        inputId: {type: 'int', indexed:true},
        input: {type: 'Input'}
     }
 }

 class Chart {}; /////////////////////////////////////////////////////
 Chart.schema = {
     name: 'Chart',
     primaryKey: 'id',
     properties:{
        id: 'int',
        name:'string',
        type: {type: 'int', default: 1}, //1 = line chart, 2 = time graph, 3 = pie chart
        featured: 'bool',
        index: 'int',
        sources: {type: 'list', objectType: 'DataSource'}
     }
 }

 class DataSource {}; /////////////////////////////////////////////////////
 DataSource.schema = {
     name: 'DataSource',
     primaryKey: 'id',
     properties:{
        id: 'int',
        style: {type:'int', default:1}, //1 = solid thick, 2 = solid thin, 3 = dotted line (for line chart)
        taskId: 'int',
        task:{type:'Task'},
        inputId:{type: 'int', optional:true},
        input:{type:'Input', optional:true},
        dayoffset:{type:'int', optional:true},
        monthoffset:{type:'int', optional:true},
        filter:{type:'string', optional:true}
     }
 }

 