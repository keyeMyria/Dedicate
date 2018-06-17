import Realm from 'realm';
import Db from 'db/Db';
import DateFormat from 'utility/DateFormat';

export default class DbTaskAnalytics extends Db{
    GetTaskChart(options){
        if(!options){
            options = {descending:true}
        }
        if(!options.sorted){options.sorted = 'datestart';}
        if(!options.datestart){options.datestart = new Date(+new Date - 12096e5);}
        if(!options.dateend){options.dateend = new Date();}
        if(!options.taskId){options.taskId = 0;}
        var chart = {days:[], inputs:[]};
        var i = -1;
        var date = null;
        global.realm.objects('Record')
            .filtered('datestart >= $0 && datestart <= $1 && task.id=$2', options.datestart, options.dateend, options.taskId)
            .sorted(options.sorted, options.descending === true ? options.descending : false)
            .map((record) => {
                if(chart.inputs.length == 0 && record.inputs.length > 0){
                    //get info about list of inputs
                    var numbers = 0;
                    var text = 0;
                    var dates = 0;
                    for(var x = 0; x < record.inputs.length; x++){
                        var item = record.inputs[x];
                        var index = 0;
                        var datatype = 0;
                        if(Number.isInteger(item.number)){
                            index = numbers;
                            numbers += 1;
                        }else if(item.text != null){
                            index = text;
                            datatype = 1;
                            text += 1;
                        }else if(item.date != null){
                            index = dates;
                            datatype = 2;
                            dates += 1;
                        }
                        chart.inputs.push({name:item.input.name, type:item.input.type, index, datatype})
                    }
                }

                //find day in chart (if it exists)
                var day = parseInt(DateFormat(record.datestart, 'd').toString())
                var x = chart.days.findIndex(a => a.day == day);
                if(x < 0){
                    //add new day to chart
                    date = record.datestart;
                    i++;
                    x = chart.days.length;
                    chart.days[x] = {numbers:[], text:[], dates:[], day: day};
                }
                for(var x = 0; x < record.inputs.length; x++){
                    //populate day with input data
                    var item = record.inputs[x];
                    if(Number.isInteger(item.number)){
                        chart.days[i].numbers[x] = item.number;
                    }else if(item.text != null){
                        chart.days[i].text[x] = item.text;
                    }else if(item.date != null){
                        chart.days[i].dates[x] = item.date;
                    }
                }
            }
        );
        return chart;
    }

    GetChart(options){
        if(!options){
            options = {descending:true}
        }
        if(!options.sorted){options.sorted = 'datestart';}
        if(!options.datestart){options.datestart = new Date(+new Date - 12096e5);}
        if(!options.dateend){options.dateend = new Date();}
        var ids = '';
        if(options.taskIds && options.taskIds.length > 0){
            ids = ' && (';
            for(var x = 0; x < options.taskIds.length; x++){
                if(x > 0 ){ids += ' OR ';}
                ids += 'task.id = ' + options.taskIds[x];
            }
            ids += ')';
        }
        var chart = {days:[], inputs:[]};
        var i = -1;
        var date = null;
        var records = global.realm.objects('Record')
            .filtered('datestart >= $0 && datestart <= $1' + ids, options.datestart, options.dateend, options.taskId).slice();
        records.sort((a, b) => a.task.id > b.task.id && a.datestart > b.datestart);

        //get a list of unique tasks
        var uniqueTasks = [];
        var numbers = 0;
        var text = 0;
        var dates = 0;
        for(var x = 0; x < records.length; x++){
            var record = records[x];
            if(uniqueTasks.findIndex((a) => a.id == record.task.id) < 0){
                uniqueTasks.push(record.task);

                //get info about list of inputs for all unique tasks
                for(var y = 0; y < record.inputs.length; y++){
                        var item = record.inputs[y];
                        var index = 0;
                        var datatype = 0;
                        if(Number.isInteger(item.number)){
                            index = numbers;
                            numbers += 1;
                        }else if(item.text != null){
                            index = text;
                            datatype = 1;
                            text += 1;
                        }else if(item.date != null){
                            index = dates;
                            datatype = 2;
                            dates += 1;
                        }
                        chart.inputs.push({name:item.input.name, type:item.input.type, taskId:record.task.id, inputIndex:y, index, datatype})
                    }
            }
        }

        records.map((record) => {
                //find day in chart (if it exists)
                var day = record.datestart.getDate()
                var month = record.datestart.getMonth() + 1;
                var x = chart.days.findIndex(a => a.day == day);
                if(x < 0){
                    //add new day to chart
                    i++;
                    date = record.datestart;
                    x = chart.days.length;
                    chart.days[x] = {numbers:[], text:[], dates:[], month:month, day:day};
                }
                for(var y = 0; y < record.inputs.length; y++){
                    //populate day with input data
                    var input = chart.inputs.filter(a => a.taskId == record.task.id && a.inputIndex == y)[0];
                    var item = record.inputs[y];
                    var e = input.index;
                    if(Number.isInteger(item.number)){
                        if(!chart.days[x].numbers[e]){chart.days[x].numbers[e] = 0;}
                        chart.days[x].numbers[e] += item.number;
                    }else if(item.text != null){
                        chart.days[x].text[e] += item.text + ' ';
                    }else if(item.date != null){
                        if(chart.days[x].dates[e] == null){
                            chart.days[x].dates[e] = [];
                        }
                        chart.days[x].dates[e].push(item.date);
                    }
                }
            }
        );
        return chart;
    }
}