import Realm from 'realm';
import Db from 'db/Db';

export default class DbRecords extends Db{
    CreateRecord(record){
        try {
            //generate id for Record
            var datecreated = new Date();
            var id = 1;
            if(global.realm.objects('Record').length > 0){
                id = (global.realm.objects('Record').sorted('id', true).slice(0,1)[0].id) + 1;
            }

            //get Task from task Id
            var task = global.realm.objects('Task').filtered('id=' + record.taskId);

            //save record (with inputs) into the database
            global.realm.write(() => {
                global.realm.create('Record', {
                    id:id, 
                    datecreated: datecreated,
                    inputs: record.inputs || [],
                    task: task
                });
            });
        } catch (e) {
            console.log("Error on creation");
            console.log(e);
        }
    }

    HasRecords(){
        return global.realm.objects('Record').length > 0;
    }

    GetRecordsList(options){
        if(!options){
            options = {sorted:'name', descending:false}
        }
        
        var tasks = global.realm.objects('Record').sorted('id', true)
        if(options.sorted){
            tasks.sorted(options.sorted, options.descending ? options.descending : false)
        }
        return tasks;
    }

    TotalRecords(filtered){
        var tasks = global.realm.objects('Record');
        if(filtered){tasks.filtered(filtered);}
        return tasks.length;
    }
}