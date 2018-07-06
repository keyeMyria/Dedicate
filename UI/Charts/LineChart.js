import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import Text from 'text/Text';
import AppStyles from 'dedicate/AppStyles';
import {Svg, Line, Polyline, Circle} from 'react-native-svg';

export default class LineChart extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            datestart: this.props.dateStart || (new Date()).setDate((new Date()).getDate() - 14),
            days: this.props.days || 14,
            chart:this.props.chart || {name:'Unknown'},
            records:this.props.records || [],
            width: this.props.width || 300,
            height: this.props.height || 120,
            padding: this.props.padding || 30,
            lines:[],
            line1:{min:'0', max:'1'},
            line2:{min:'', max:''},
            dots:[],
            legend:[],
            showLegendTaskNames: this.props.showLegendTaskNames || false,
            update:this.props.update || Math.round(999 * Math.random())
        }

        //bind methods
        this.getChart = this.getChart.bind(this);
        this.getPoints = this.getPoints.bind(this);
        this.getLine = this.getLine.bind(this);
        this.getDots = this.getDots.bind(this);
        this.getLegendLine = this.getLegendLine.bind(this);
        this.getLegendDot = this.getLegendDot.bind(this);
    }

    componentWillMount(){
        this.getChart();
    }

    componentDidUpdate(){
        if(this.props.update != null && this.state.update != this.props.update){
            this.setState({
                datestart: this.props.dateStart || (new Date()).setDate((new Date()).getDate() - 14),
                days: this.props.days || 14,
                chart: this.props.chart || {name:'Unknown'},
                records: this.props.records || [],
                width: this.props.width || 300,
                height: this.props.height || 120,
                padding: this.props.padding || 30,
                update: this.props.update
            }, () =>{
                this.getChart();
            });
        }
    }

    getChart(){
        let info = [];
        let lines = [];
        let dots = [];
        let legend = [];
        let line1 = {min:0, max:1};
        let line2 = {min:0, max:1};
        let linecount = 1;

        for(let x = 0; x < this.state.records.length; x++){
            let records = this.state.records[x];
            let source = this.state.chart.sources[x];
            let input = source.input;
            if(input != null){
                if(input.type == 0 || input.type == 7){ //number
                    let color = this.getColor(source.color);
                    info = this.getPoints(records, input);
                    lines = [this.getLine(info.points, info.min, info.max, x, color)].concat(lines);
                    legend.push(this.getLegendLine((this.state.showLegendTaskNames ? source.task.name + ': ' : '') + input.name, color));
                    if(linecount == 1){
                        line1 = {min:info.min, max:info.max};
                    }else{
                        line2 = {min:info.min, max:info.max};
                    }
                    linecount++;
                }else if(input.type == 6){ //yes/no
                    let color = AppStyles.chartDotFill;
                    dots.push(this.getDots(records, input, color));
                    legend.push(this.getLegendDot((this.state.showLegendTaskNames ? source.task.name + ': ' : '') + input.name, color));
                }
            }
        }
        this.setState({lines:lines, dots:dots, legend:legend, line1:line1, line2:line2});
    }

    getPoints = (records, input) => {
        let min = 999999;
        let max = 0;
        let points = [];
        let days = this.state.days;

        //get totals for each day
        for(let x = 0; x < days; x++){
            let count = 0;
            let date = new Date();
            date = new Date(date.setDate(date.getDate() - (days - 1 - x)));
            for(let y = 0; y < records.length; y++){
                let rec = records[y];
                if(DatesMatch(date, new Date(rec.datestart))){
                    let i = rec.inputs.map(a => a.inputId).indexOf(input.id);
                    if(rec.inputs.length > i){
                        if(rec.inputs[i].number != null){
                            count += rec.inputs[i].number;
                        }
                    }
                }
            }
            points.push(count);
        }

        //check totals for min & max
        for(let x = 0; x < points.length; x++){
            if(points[x] < min){ min = points[x];}
            if(points[x] > max){ max = points[x];}
        }

        if(max == 0){max = 1;}

        return {points:points, min:min, max:max};
    }

    getLine = (points, min, max, index, stroke) => {
        //draw lines
        let lines = [];
        let days = this.state.days;
        let width = this.state.width - this.state.padding;
        let height = this.state.height - 70;

        for(let x = 0; x < points.length; x++){
            lines.push(Math.round(((width / days) * x) + 10) + ',' + Math.round((height + 20) - ((height) / (max - min)) * (points[x] - min)));
        }

        return (
            <View style={[this.styles.chartLine, this.styles.chart, {height:this.state.height - 60}]} key={'line' + index}>
                <Svg width={width} height={height + 30}>
                    <Polyline key={'line'}
                        stroke={stroke}
                        strokeWidth="5"
                        fill="none"
                        points={lines.join(' ')}
                    ></Polyline>
                </Svg>
            </View>
        );
    }

    getDots = (records, input, color) => {
        let dots = [];
        let days = this.state.days;
        let width = this.state.width - this.state.padding;
        let height = this.state.height - 70;

        for(let x = 0; x < days; x++){
            let date = new Date();
            date = new Date(date.setDate(date.getDate() - (days - 1 - x)));
            for(let y = 0; y < records.length; y++){
                const rec = records[y];
                if(DatesMatch(date, new Date(rec.datestart))){
                    let i = rec.inputs.map(a => a.inputId).indexOf(input.id);
                    if(i >= 0){
                        if(rec.inputs[i].number != null){
                            if(rec.inputs[i].type == 6 && rec.inputs[i].number == 1){
                                dots.push(
                                    <Circle key={'dot' + x}
                                        cx={Math.round(((width / days) * x) + 10)}
                                        cy={height + 20}
                                        r={5}
                                        fill={color}
                                    ></Circle>
                                )
                            }
                        }
                    }
                }
            }
        }
        return (
            <View style={[this.styles.chartDots, this.styles.chart]} key={'dots'}>
                <Svg width={width} height={height + 30}>{dots}</Svg>
            </View>
        );
    }

    getLegendLine(name, color){
        return (
            <View style={this.styles.legendItem} key={name}>
                <View style={this.styles.legendItemIcon}>
                    <Svg width="20" height="10">
                        <Line x1="0" x2="20" y1="4" y2="4" strokeWidth="5" stroke={color}></Line>
                    </Svg>
                </View>
                <View style={this.styles.legendItemLabel}>
                    <Text style={this.styles.legendItemText}>{name}</Text>
                </View>
            </View>
        );
    }

    getLegendDot(name, color){
        return (
            <View style={this.styles.legendItem} key={name}>
                <View style={this.styles.legendItemIcon}>
                    <Svg width="20" height="10">
                        <Circle cx={10} cy={5} r={5} fill={color}></Circle>
                    </Svg>
                </View>
                <View style={this.styles.legendItemLabel}>
                    <Text style={this.styles.legendItemText}>{name}</Text>
                </View>
            </View>
        );
    }

    getColor(index){
        switch(index){
            case 1: default:
                return AppStyles.chartLine1Stroke;
            case 2:
                return AppStyles.chartLine2Stroke;
            case 3:
                return AppStyles.chartLine3Stroke;
            case 4:
                return AppStyles.chartLine4Stroke;
            case 5:
                return AppStyles.chartLine5Stroke;
            case 6:
                return AppStyles.chartLine6Stroke;
            case 7:
                return AppStyles.chartLine7Stroke;
            case 8:
                return AppStyles.chartLine8Stroke;
        }
    }

    render(){

        return (
            <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                <View style={[this.styles.chartContainer, {width:this.state.width, paddingHorizontal:this.state.padding - 5}]}>
                    <View style={{height:this.state.height, width:this.state.width - this.state.padding}}>
                        <View style={this.styles.chartLine1MinMax}>
                            <Text style={[this.styles.chartLabel, this.styles.chartLineMax]}>{this.state.line1.max}</Text>
                            <Text style={[this.styles.chartLabel, this.styles.chartLineMin]}>{this.state.line1.min}</Text>
                        </View>
                        <View style={this.styles.chartLine2MinMax}>
                            <Text style={[this.styles.chartLabel, this.styles.chartLineMax, this.styles.chartLabelEnd]}>{this.state.line2.max}</Text>
                            <Text style={[this.styles.chartLabel, this.styles.chartLineMin, this.styles.chartLabelEnd]}>{this.state.line2.min}</Text>
                        </View>
                        {this.state.lines}
                        {this.state.dots}
                        <Text style={this.styles.chartName}>{this.state.chart.name}</Text>
                    </View>
                </View>
                <View style={[this.styles.legendContainer, {width:this.state.width, height:this.state.height + 5, padding:this.state.padding}]}>
                    {this.state.legend}
                    <Text style={this.styles.legendName}>{this.state.chart.name}</Text>
                </View>
            </ScrollView>
        );
    }

    styles = StyleSheet.create({
        chartContainer: {paddingBottom:20, paddingTop:5, width:'100%'},
        chart:{top:15, left:-5},
        chartName: {position:'absolute', bottom:0, fontSize:20, width:'100%', textAlign:'center'},
        chartLine:{position:'absolute', height:'100%'},
        chartLineMax:{position:'absolute', top:0},
        chartLineMin:{position:'absolute', bottom:0},
        chartLine1MinMax:{position:'absolute', height:'100%'},
        chartLine2MinMax:{position:'absolute', height:'100%', right:20, alignItems:'flex-end'},
        chartLabel:{fontSize:20, opacity:0.5},
        chartLabelEnd:{textAlign:'right'},
        chartTextRight:{textAlign:'right'},
        chartDots:{position:'absolute'},

        legendContainer:{flex:1, flexDirection:'row', justifyContent:'space-between'},
        legendLines:{alignSelf:'flex-start'},
        legendDot:{alignSelf:'flex-end'},
        legendItem:{flex:1, flexDirection:'row'},
        legendItemIcon:{paddingRight:10, paddingTop:7, height:20},
        legendItemLabel:{},
        legendItemText:{fontSize:17},
        legendName:{position:'absolute', width:'100%', bottom:0, paddingLeft:55, fontSize:20, textAlign:'center', alignSelf:'center'}
    });
}