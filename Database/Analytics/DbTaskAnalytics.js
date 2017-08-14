import Realm from 'realm';
import Db from 'db/Db';

export default class DbTaskAnalytics extends Db{
    GetTaskChart(options){
        if(!options){
            options = {descending:true}
        }
        if(!options.sorted){options.sorted = 'datecreated';}
        if(!options.datestart){options.datestart = new Date(+new Date - 12096e5);}
        if(!options.days){options.days = 14;}
        console.log(options);
        
        var tasks = global.realm.objects('Record').filtered('datecreated >= $0', options.datestart );
        if(tasks.length > 0){
            tasks.sorted(options.sorted, true).slice(0,options.days);
        }
        if(options.sorted){
            tasks.sorted(options.sorted, options.descending === true ? options.descending : false)
        }
        return tasks;
    }
}