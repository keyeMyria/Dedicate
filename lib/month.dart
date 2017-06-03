import 'package:flutter/material.dart';
import 'drawer.dart';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Day Calendar page
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class PageCalendarMonth extends StatefulWidget {
  PageCalendarMonth({Key key, this.title, this.date}) : super(key: key);
  final String title;
  final DateTime date;
  @override
  PageCalendarMonthState createState() => new PageCalendarMonthState();
}

class PageCalendarMonthState extends State<PageCalendarMonth> {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title)
      ),
      drawer: appDrawer,
      floatingActionButton: new FloatingActionButton(
        onPressed: onPressedAchievedGoal,
        tooltip: 'Achieved Goal',
        child: new Icon(Icons.add),
      ),
    );
  }

  void onPressedAchievedGoal(){

  }
}