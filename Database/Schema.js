import Realm from 'realm'

 export default function Schema() {
    global.realm = new Realm({
        schema: [Task, Input, Category, Record, RecordInput],
        schemaVersion: 5,
        migration: function(oldRealm, newRealm) {
            newRealm.deleteAll();
        }
    });
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
        name: 'string',
        tasks: {type:'int', default:0}
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
        inputtId: {type: 'int', indexed:true},
        input: {type: 'Input'}
     }
 }