import Db from 'db/Db';
import DbRecords from './DbRecords';

export default class DbTasks extends Db{
    CreateTask(task){
        let id = 1;
        let isnew = true;
        if(task.id){
            //task already exists in database
            id = task.id;
            isnew = false;
            let utask = global.realm.objects('Task').filtered('id = $0', id)[0];

            if(utask.category.id != task.category.id){
                //update category id for existing task
                global.realm.write(() => {
                    let cat = global.realm.objects('Category').filtered('id = $0', task.category.id);
                    if(cat.length > 0){
                        cat = cat[0];
                    }else{
                        cat = null;
                    }
                    utask.category = cat;
                });
            }

            if(task.inputs.length > 0){
                //update inputs
                let inputid = 1;
                if(global.realm.objects('Input').length > 0){
                    inputid = global.realm.objects('Input').sorted('id', true).slice(0,1)[0].id + 1;
                }
                //delete any unused inputs
                if(utask.inputs.length > 0){
                    let taskinputs = task.inputs.map(a => a.key);
                    let inputs = utask.inputs.filter(a => taskinputs.indexOf(a.id) >= 0);
                    let deleted = utask.inputs.filter(a => taskinputs.indexOf(a.id) < 0);

                    //delete inputs from all recorded tasks
                    let records = global.realm.objects('Record').filtered('taskId = $0', id);
                    if(records.length > 0){
                        global.realm.write(() => {
                            for(let x = 0; x < records.length; x++){
                                for(let y = 0; y < deleted.length; y++){
                                    let i = records[x].inputs.map(a => a.inputId).indexOf(deleted[y].id);
                                    if(i >= 0){
                                        records[x].inputs.splice(i, 1);
                                    }
                                }
                            }
                        });
                    }

                    if(inputs.length < utask.inputs.length){
                        global.realm.write(() => {
                            utask.inputs = inputs;
                        });
                    }
                }

                for(let x = 0; x < task.inputs.length; x++){
                    let input = task.inputs[x];
                    if(input.isnewkey == true){
                        //generate ids for new Inputs
                        input = {name:input.name, type:input.type, id:inputid};
                        global.realm.write(() => {
                            let inputs = utask.inputs;
                            inputs.push(global.realm.create('Input', input));
                            utask.inputs = inputs;
                        });
                        inputid++;
                    }else{
                        //update input name
                        input = global.realm.objects('Input').filtered('id = $0', input.key)[0];
                        if(input.name != task.inputs[x].name){
                            global.realm.write(() => {
                                if(input.name != task.inputs[x].name){
                                    input.name = task.inputs[x].name;
                                }
                            });
                        }
                    }
                }
            }else if(utask.inputs.length > 0){
                //remove all inputs from task
                global.realm.write(() => {
                    utask.inputs = [];
                });
            }

            //update task name
            if(task.name != utask.name){
                global.realm.write(() => {
                    utask.name = task.name;
                });
            }

        }else{
            //generate id for Task
            if(global.realm.objects('Task').length > 0){
                id = (global.realm.objects('Task').sorted('id', true).slice(0,1)[0].id) + 1;
            }

            //generate ids for Inputs
            if(task.inputs.length > 0){
                let inputid = 1;
                if(global.realm.objects('Input').length > 0){
                    inputid = global.realm.objects('Input').sorted('id', true).slice(0,1)[0].id + 1;
                }
                for(let x = 0; x < task.inputs.length; x++){
                    let input = task.inputs[x];
                    input = {name:input.name, type:input.type, id:inputid};
                    task.inputs[x] = input;
                    inputid++;
                }
            }
        }
        

        //save task (with inputs) into the database
        if(isnew == true){
            let cat = null;
            if(task.category.id > 0){
                cat = global.realm.objects('Category').filtered('id = $0', task.category.id)[0];
            }
            global.realm.write(() => {
                task = global.realm.create('Task', {
                    id:id, 
                    name: task.name, 
                    icon:task.icon || 0, 
                    color:task.color || 0,
                    inputs: task.inputs || [],
                    category: cat
                });
            });

            if(task.category.id > -1){
                //update category with total task count
                let total = this.TotalTasks(['category.id=$0',task.category.id]);
                global.realm.write(()=>{
                    task.category.tasks = total;
                });
            }
        }
        return task;
    }

    HasTasks(){
        return global.realm.objects('Task').length > 0;
    }

    GetList(options){
        if(!options){
            options = {sorted:'name', descending:false, filtered:null}
        }
        
        let tasks = global.realm.objects('Task');
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
        let tasks = global.realm.objects('Task');
        if(filtered){tasks = tasks.filtered(...filtered);}
        return tasks.length;
    }

    GetTask(taskId){
        let task = global.realm.objects('Task').filtered('id=' + taskId);
        return task ? task[0] : null;
    }

    DeleteTask(taskId){
        
        //delete task recordings
        let db = new DbRecords();
        let records = global.realm.objects('Record').filtered('task.id=' + taskId);
        if(records.length > 0){
            records = records.map(a => a.id);
            for(let x = 0; x < records.length;x++){
                //delete all records for task
                db.DeleteRecord(global.realm.objects('Record').filtered('id = $0', records[x]));
            }
        }
        
        //finally, delete task
        global.realm.write(() => {
            global.realm.delete(global.realm.objects('Task').filtered('id=' + taskId));
        });
    }
}