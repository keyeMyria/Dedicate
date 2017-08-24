import Realm from 'realm';
import Db from 'db/Db';

export default class DbTasks extends Db{
    CreateTask(task, updateExisting){
        try {
            //generate id for Task
            var id = 1;
            if(task.id){
                id = task.id;
            }else{
                if(global.realm.objects('Task').length > 0){
                    id = (global.realm.objects('Task').sorted('id', true).slice(0,1)[0].id) + 1;
                }
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
                task = global.realm.create('Task', {
                    id:id, 
                    name: task.name, 
                    icon:task.icon || 0, 
                    color:task.color || 0,
                    inputs: task.inputs || [],
                    category: task.category
                }, updateExisting || false);
            });
        } catch (e) {
            console.log("Error on creation");
            console.log(e);
        }
        return task;
    }

    HasTasks(){
        return global.realm.objects('Task').length > 0;
    }

    GetTasksList(options){
        if(!options){
            options = {sorted:'name', descending:false, filtered:null}
        }
        
        var tasks = global.realm.objects('Task')
        if(options.sorted){
            tasks = tasks.sorted(options.sorted, options.descending ? options.descending : false)
        }else{
            tasks = tasks.sorted('id', true);
        }
        if(options.filtered != null){
            if(typeof options.filtered == 'string'){
                tasks = tasks.filtered(options.filtered);
            }else{
                tasks = tasks.filtered(...options.filtered);
            }
            
        }
        return tasks;
    }

    TotalTasks(filtered){
        var tasks = global.realm.objects('Task');
        if(filtered){tasks = tasks.filtered(...filtered);}
        return tasks.length;
    }

    GetTask(taskId){
        var task = global.realm.objects('Task').filtered('id=' + taskId);
        return task ? task[0] : null;
    }

    DeleteTask(taskId){
        global.realm.write(() => {
            //delete task recordings
            global.realm.delete(global.realm.objects('Record').filtered('task.id=' + taskId));
            //finally, delete task
            global.realm.delete(global.realm.objects('Task').filtered('id=' + taskId));
        });
    }
}