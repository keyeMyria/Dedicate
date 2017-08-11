import Realm from 'realm'

export default class DbTasks{

    CreateTask = (task) => {
        try {
            //generate id for Task
            var id = (global.realm.objects('Task').max('id')) + 1;
            
            //generate ids for Inputs
            for(var x = 0; x < task.inputs.length; x++){
                var inputid = ((global.realm.objects('Input').max('id')) || 0) + 1;
                var input = task.inputs[x];
                input.id = inputid;
                task.inputs[x] = input;
            }

            //save task (with inputs) into the database
            global.realm.write(() => {
                global.realm.create('Task', {
                    id:id, 
                    name: task.name, 
                    icon:task.icon || '', 
                    color:task.color || '',
                    inputs: task.inputs
                });
            });
        } catch (e) {
            console.log("Error on creation");
        }
    }
}