import Realm from 'realm';
import Db from 'db/Db';

export default class DbTasks extends Db{
    CreateTask(task){
        try {
            //generate id for Task
            var id = 1;
            if(global.realm.objects('Task').length > 0){
                id = (global.realm.objects('Task').sorted('id', true).slice(0,1)[0].id) + 1;
            }
            
            //generate ids for Inputs
            if(task.inputs.length > 0){
                var inputid = 1;
                if(global.realm.objects('Input').length > 0){
                    inputid = global.realm.objects('Input').sorted('id', true).slice(0,1)[0].id + 1;
                }
                for(var x = 0; x < task.inputs.length; x++){
                    var input = task.inputs[x];
                    input.id = inputid;
                    task.inputs[x] = input;
                    inputid++;
                }
            }

            //save task (with inputs) into the database
            global.realm.write(() => {
                global.realm.create('Task', {
                    id:id, 
                    name: task.name, 
                    icon:task.icon || 0, 
                    color:task.color || 0,
                    inputs: task.inputs || []
                });
            });
        } catch (e) {
            console.log("Error on creation");
            console.log(e);
        }
    }

    HasTasks(){
        return global.realm.objects('Task').length > 0;
    }

    GetTasksList(options){
        if(!options){
            options = {sorted:'name', descending:false}
        }
        
        var tasks = global.realm.objects('Task').sorted('id', true)
        if(options.sorted){
            tasks.sorted(options.sorted, options.descending ? options.descending : false)
        }
        return tasks;
    }

    TotalTasks(filtered){
        var tasks = global.realm.objects('Task');
        if(filtered){tasks.filtered(filtered);}
        return tasks.length;
    }
}