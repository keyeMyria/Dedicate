import Realm from 'realm'

 export default class Schema {
     constructor(){
        global.realm = new Realm({
            schema: [Task, Input, Record, RecordInput]
        });
     }
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
        inputs: {type: 'list', objectType: 'Input', optional: true}
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
        taskId: {type: 'int', indexed: true},
        taskName: {type: 'linkingObjects', objectType: 'Task', property: 'name'},
        taskIcon: {type: 'linkingObjects', objectType: 'Task', property: 'icon'},
        taskColor: {type: 'linkingObjects', objectType: 'Task', property: 'color'}
     }
 }

 class RecordInput {}; /////////////////////////////////////////////////////
 RecordInput.schema = {
    name: 'RecordInput',
    properties: {
        value: {type: 'float', optional: true},
        str: {type: 'string', optional: true},
        date: {type: 'date', optional: true},

        //input information for record input
        inputId: {type: 'int', indexed: true},
        inputName: {type: 'linkingObjects', objectType: 'Input', property: 'name'},
        inputType: {type: 'linkingObjects', objectType: 'Input', property: 'type'}
     }
 }