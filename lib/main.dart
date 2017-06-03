import 'package:flutter/material.dart';
import 'tasks.dart';
import 'day.dart';
import 'month.dart';
import 'progress.dart';
import 'settings.dart';

void main() {
  runApp(new DedicateApp());
}

class DedicateApp extends StatelessWidget {
  static const title = 'Dedicate';
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: title,
      theme: new ThemeData(
        primarySwatch: Colors.deepPurple,
        canvasColor: Colors.white,
      ),
      home: new PageCalendarDay(title: 'Today', date:new DateTime.now()),
      routes: <String, WidgetBuilder>{
        '/Tasks': (BuildContext context) => new PageTasks(title: 'Tasks'),
        '/Today': (BuildContext context) => new PageCalendarDay(title: 'Today', date:new DateTime.now()),
        '/Calendar': (BuildContext context) => new PageCalendarMonth(title: 'Calendar', date:new DateTime.now()),
        '/Progress': (BuildContext context) => new PageProgress(title: 'Progress'),
        '/Settings': (BuildContext context) => new PageSettings(title: 'Settings')
      }
    );
  }
}