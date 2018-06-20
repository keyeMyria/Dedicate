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

            //save record (with inputs) into the database
            global.realm.write(() => {
                global.realm.create('Record', {
                    id:id, 
                    taskId: record.taskId,
                    datestart: record.datestart,
                    dateend: record.dateend,
                    inputs: record.inputs || [],
                    task: record.task || null
                });
            });
        } catch (e) {
            console.error(e);
        }
    }

    HasRecords(){
        return global.realm.objects('Record').length > 0;
    }

    GetList(options){
        if(!options){
            var dateend = new Date();
            var datestart = new Date(dateend.getDate());
            datestart.setDate(datestart.getDate() - 14);
            options = {
                sorted:'datestart', 
                descending:true,
                startDate: datestart, //past 14 days of records
                endDate: dateend
            }
        }
        if(!options.sorted){
            options.sorted = 'datestart';
            options.descending = true;
        }
        
        var records = global.realm.objects('Record')
            .filtered('datestart >= $0 AND dateend <= $1', options.startDate, options.endDate);

        if(options.sorted){
            records.sorted(options.sorted, options.descending ? true : false)
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
        if(filtered){records.filtered(filtered);}
        return records.length;
    }
}