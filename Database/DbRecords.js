import Db from 'db/Db';

export default class DbRecords extends Db{
    CreateRecord(record){
        //generate id for Record
        let id = 1;
        let exists = false;
        if(typeof record.id != 'undefined' && record.id != null && record.id > 0){
            id = record.id;
            exists = true;
        } else {
            if(global.realm.objects('Record').length > 0){
                id = (global.realm.objects('Record').sorted('id', true)[0].id) + 1;
            }
            record.id = id;
        }
        
        const time = (record.dateend - record.datestart) / 1000;

        //validate input content
        for(let x = 0; x < record.inputs.length; x++){
            //update all inputs for record
            let input = record.inputs[x];
            switch(input.type){
                case 0: case 6: case 7: //number, yes/no, 5 stars
                    if(input.number == null){
                        input.number = 0;
                    }
                    break;
                case 1: case 8: case 9: case 10: case 11: //text, location, url link, photo, video
                    if(input.text == null){
                        input.text = '';
                    }
                    break;
                case 2: case 3: case 4: //date, time, date & time
                    if(input.date == null){
                        input.date = new Date();
                    }
                    break;
            }
        }

        //save record (with inputs) into the database
        if(exists == false){
            //record doesn't exist in database yet
            global.realm.write(() => {
                global.realm.create('Record', {
                    id:id, 
                    taskId: record.taskId,
                    datestart: record.datestart,
                    dateend: record.dateend,
                    time: time,
                    timer: record.timer,
                    inputs: record.inputs || [],
                    task: record.task || global.realm.objects('Task').filtered('id = $0', record.taskId)[0]
                });
            });
        }else{
            //record exists in database
            let rec = global.realm.objects('Record').filtered('id = $0', id)[0];
            
            global.realm.write(() => {
                rec.datestart = record.datestart;
                rec.dateend = record.dateend;
                rec.time = time;
                rec.timer = record.timer;

                for(let x = 0; x < record.inputs.length; x++){
                    //update all inputs for record
                    let input = record.inputs[x];
                    const i = rec.inputs.map(a => a.inputId).indexOf(input.inputId);
                    if(i >= 0){
                        //input exists in record
                        rec.inputs[i].number = input.number;
                        rec.inputs[i].text = input.text;
                        rec.inputs[i].date = input.date;
                        if(rec.inputs[i].input == null){
                            rec.inputs[i].input = global.realm.objects('Input').filtered('id = $0', input.inputId)[0];
                        }
                    }else{
                        //input doesn't exist in record yet
                        rec.inputs.push(input);
                    }
                }
            });
        }
    }

    hasRecords(){
        return global.realm.objects('Record').length > 0;
    }

    GetRecord(id){
        let result = global.realm.objects('Record').filtered('id = $0', id);
        if(result.length == 1){
            return result[0];
        }else{
            return null;
        }
    }

    GetList(options){
        let dateend = new Date();
        let datestart = new Date(dateend.getDate());
        datestart.setYear(datestart.getFullYear() - 100);
        dateend.setYear(dateend.getFullYear() + 100);
        if(!options){
            options = {
                sorted:'datestart', 
                descending:true,
                startDate: datestart,
                endDate: dateend
            }
        }
        if(typeof options.sorted == 'undefined'){
            options.sorted = 'datestart';
            options.descending = true;
        }
        if(typeof options.startDate == 'undefined' || options.startDate == null || typeof options.endDate == 'undefined' || options.endDate == null){
            options.startDate = datestart;
            options.endDate = dateend;
        }
        
        let records = global.realm.objects('Record')   
        .filtered('datestart >= $0 AND dateend <= $1', options.startDate, options.endDate);

        if(typeof options.taskId != 'undefined'){
            records = records.filtered('taskId = $0', options.taskId);
        }

        if(options.sorted){
            records = records.sorted(options.sorted, options.descending === true ? true : false)
        }

        if(typeof options.start != 'undefined'){
            //set start position of records returned
            records = records.slice(options.start);
        }

        if(typeof options.length != 'undefined'){
            //set length of records returned
            records = records.slice(0, options.length);
        }

        return records;
    }

    GetListByTask(options){
        let records = this.GetList(options);
        let tasks = [];
        for(let x = 0; x < records.length; x++){
            let rec = records[x];
            let index = tasks.map(a => a.id).indexOf(rec.taskId);
            if(index < 0){
                tasks.push({
                    name:rec.task.name,
                    id:rec.taskId,
                    task:rec.task,
                    records: []
                });
            }
            let task = tasks[tasks.map(a => a.id).indexOf(rec.taskId)];
            task.records.push(rec);
        }
        return tasks;
    }

    GetActiveTimers(){
        return this.GetList().filtered('timer = true');
    }

    TotalRecords(filtered){
        let records = global.realm.objects('Record');
        if(filtered){
            records = records.filtered(filtered);
        }
        return records.length;
    }

    DeleteRecord(record){
        global.realm.write(() => {
            if(typeof record.inputs != 'undefined' && record.inputs != null && record.inputs.length > 0){
                for(let x = 0; x < record.inputs.length;x++){
                    //delete all input records within record
                    global.realm.delete(record.inputs[x]);
                    x--;
                    if(typeof record.inputs == 'undefined'){
                        break;
                    }
                }
            }
            
            //finally, delete record
            global.realm.delete(record);
        });
    }
}