import Db from 'db/Db';

export default class DbRecords extends Db{
    CreateRecord(record){
            //generate id for Record
            var id = 1;
            if(global.realm.objects('Record').length > 0){
                id = (global.realm.objects('Record').sorted('id', true).slice(0,1)[0].id) + 1;
            }
            var time = (record.dateend - record.datestart) / 1000;

            //save record (with inputs) into the database
            global.realm.write(() => {
                global.realm.create('Record', {
                    id:id, 
                    taskId: record.taskId,
                    datestart: record.datestart,
                    dateend: record.dateend,
                    time: time,
                    timer: record.timer,
                    inputs: record.inputs || [],
                    task: record.task || null
                });
            });
    }

    HasRecords(){
        return global.realm.objects('Record').length > 0;
    }

    GetList(options){
        var dateend = new Date();
        var datestart = new Date(dateend.getDate());
        datestart.setYear(datestart.getFullYear() - 100);
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
        
        var records = global.realm.objects('Record')   
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
        var records = this.GetList(options);
        var tasks = [];
        for(var x = 0; x < records.length; x++){
            var rec = records[x];
            var index = tasks.map(a => a.id).indexOf(rec.taskId);
            if(index < 0){
                tasks.push({
                    name:rec.task.name,
                    id:rec.taskId,
                    records: []
                });
            }
            var task = tasks[tasks.map(a => a.id).indexOf(rec.taskId)];
            task.records.push(rec);
        }
        return tasks;
    }

    TotalRecords(filtered){
        var records = global.realm.objects('Record');
        if(filtered){
            records = records.filtered(filtered);
        }
        return records.length;
    }
}