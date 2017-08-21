import Realm from 'realm'

 export default function Schema() {
    global.realm = new Realm({
        schema: [Task, Input, Category, Record, RecordInput],
        schemaVersion: 4,
        migration: function(oldRealm, newRealm) {
            //newRealm.deleteAll();
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
        type: {type: 'int', default: 0} //0 = number, 1 = string, 2 = datetime
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
        datecreated: {type: 'date', indexed: true},
        
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
        input: {type: 'Input'}
     }
 }