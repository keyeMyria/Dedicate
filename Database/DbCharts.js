import Db from 'db/Db';

export default class DbCharts extends Db{
    CreateChart(chart){
        let id = 1;
        let isnew = true;
        if(chart.id){
            //chart already exists in database
            id = chart.id;
            isnew = false;
            let uchart = global.realm.objects('Chart').filtered('id = $0', id)[0];

            if(chart.sources.length > 0){
                //update data sources
                let sourceid = 1;
                if(global.realm.objects('DataSource').length > 0){
                    //increment new data source id
                    sourceid = global.realm.objects('DataSource').sorted('id', true).slice(0,1)[0].id + 1;
                }
                //delete any unused data sources
                if(uchart.sources.length > 0){
                    let sources = uchart.sources.filter(a => chart.sources.map(a => a.id).indexOf(a.id) >= 0);
                    if(sources.length < uchart.sources.length){
                        global.realm.write(() => {
                            uchart.sources = sources;
                        });
                    }
                }

                for(let x = 0; x < chart.sources.length; x++){
                    let source = chart.sources[x];
                    if(source.isnewkey == true){
                        //generate id for new data source
                        source = {
                            id:sourceid,
                            taskId:source.taskId,
                            task:source.task,
                            style:source.style,
                            color:source.color,
                            inputId:source.inputId,
                            input:source.input,
                            dayoffset:source.dayoffset,
                            monthoffset:source.monthoffset,
                            filter:source.filter
                        };
                        global.realm.write(() => {
                            let sources = uchart.sources;
                            sources.push(global.realm.create('DataSource', source));
                            uchart.sources = sources;
                        });
                        sourceid++;
                    }else{
                        //update existing data source info
                        let existing = global.realm.objects('DataSource').filtered('id = $0', source.id)[0];
                        global.realm.write(() => {
                            existing.style = source.style,
                            existing.color = source.color,
                            existing.inputId = source.inputId;
                            existing.input = source.input,
                            existing.dayoffset = source.dayoffset;
                            existing.monthoffset = source.monthoffset;
                            existing.filter = source.filter;
                        });
                    }
                }
            }else if(uchart.sources.length > 0){
                //remove all data sources from chart
                global.realm.write(() => {
                    uchart.sources = [];
                });
            }

            //update chart info
            global.realm.write(() => {
                uchart.name = chart.name;
                uchart.type = chart.type;
                uchart.featured = chart.featured;
                uchart.index = chart.index;
            });

        }else{
            //generate id for chart
            if(global.realm.objects('Chart').length > 0){
                id = (global.realm.objects('Chart').sorted('id', true).slice(0,1)[0].id) + 1;
            }

            //generate ids for Data Sources
            if(chart.sources.length > 0){
                let sourceid = 1;
                if(global.realm.objects('DataSource').length > 0){
                    sourceid = global.realm.objects('DataSource').sorted('id', true).slice(0,1)[0].id + 1;
                }
                for(let x = 0; x < chart.sources.length; x++){
                    let source = chart.sources[x];
                    source = {
                        id:sourceid,
                        taskId:source.taskId,
                        task:source.task,
                        style:source.style,
                        color:source.color,
                        inputId:source.inputId,
                        input:source.input,
                        dayoffset:source.dayoffset,
                        monthoffset:source.monthoffset,
                        filter:source.filter
                    };
                    chart.sources[x] = source;
                    sourceid++;
                }
            }
        }
        

        //save chart (with sources) into the database
        if(isnew == true){
            global.realm.write(() => {
                chart = global.realm.create('Chart', {
                    id:id, 
                    name: chart.name, 
                    type:chart.type, 
                    featured:chart.featured || false,
                    index: chart.index || 0,
                    sources: chart.sources || []
                });
            });
        }
        return chart;
    }

    HasCharts(){
        return global.realm.objects('Chart').length > 0;
    }

    GetList(options){
        if(!options){
            options = {sorted:'index', descending:false, filtered:null}
        }
        
        let charts = global.realm.objects('Chart');
        if(options.sorted){
            charts = charts.sorted(options.sorted, options.descending ? options.descending : false)
        }else{
            charts = charts.sorted('id', true);
        }
        if(options.featured === true){
            charts = charts.filtered('featured = $0', true);
        }
        if(options.filtered != null){
            if(typeof options.filtered == 'string'){
                charts = charts.filtered(options.filtered);
            }else{
                charts = charts.filtered(...options.filtered);
            }
            
        }
        return charts;
    }

    GetFeaturedCharts(){
        return this.GetList({featured:true});
    }

    TotalCharts(filtered){
        let charts = global.realm.objects('Chart');
        if(filtered){charts = charts.filtered(...filtered);}
        return charts.length;
    }

    GetChart(chartId){
        let chart = global.realm.objects('Chart').filtered('id=' + chartId);
        return chart ? chart[0] : null;
    }

    DeleteChart(chartId){
        let chart = global.realm.objects('Chart').filtered('id=' + chartId)
      
        global.realm.write(() => {
            //delete chart data sources
            global.realm.delete(chart.sources);
            
            //finally, delete chart
            global.realm.delete(chart);
        });
    }
}