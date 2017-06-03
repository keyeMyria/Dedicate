import 'package:flutter/material.dart';
import 'drawer.dart';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Day Calendar page
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class PageCalendarDay extends StatefulWidget {
  PageCalendarDay({Key key, this.title, this.date}) : super(key: key);
  final String title;
  final DateTime date;
  @override
  PageCalendarDayState createState() => new PageCalendarDayState();
}

class PageCalendarDayState extends State<PageCalendarDay> {
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