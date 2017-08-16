import Realm from 'realm';
import Db from 'db/Db';

export default class DbTaskAnalytics extends Db{
    GetTaskChart(options){
        if(!options){
            options = {descending:true}
        }
        if(!options.sorted){options.sorted = 'datecreated';}
        if(!options.datestart){options.datestart = new Date(+new Date - 12096e5);}
        if(!options.dateend){options.dateend = new Date();}
        var chart = {days:[]};
        var i = -1;
        var date = null;
        global.realm.objects('Record')
            .filtered('datecreated >= $0 && datecreated <= $1', options.datestart, options.dateend)
            .sorted(options.sorted, options.descending === true ? options.descending : false)
            .map((record) => {
                if(date == null || date != record.datecreated){
                    //add new day to chart
                    date = record.datecreated;
                    i++;
                    chart.days[i] = {numbers:[], text:[], dates:[]};
                }
                for(var x = 0; x < record.inputs.length; x++){
                    //populate day with input data
                    if(isNumeric(record.inputs[x].number)){
                        chart.days[i].numbers[x] = record.inputs[x].number;
                    }else if(record.inputs[x].text != null){
                        chart.days[i].text[x] = record.inputs[x].text;
                    }else if(record.inputs[x].date != null){
                        chart.days[i].dates[x] = record.inputs[x].date;
                    }
                }
            }
        );
        console.log(chart);
        return chart;
    }
}