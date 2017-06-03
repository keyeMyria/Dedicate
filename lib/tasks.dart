import 'package:flutter/material.dart';
import 'drawer.dart';

class PageTasks extends StatefulWidget {
  PageTasks({Key key, this.title}) : super(key: key);
  final String title;
  @override
  PageTasksState createState() => new PageTasksState();
}

class PageTasksState extends State<PageTasks> {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title)
      ),
      drawer: appDrawer,
      floatingActionButton: new FloatingActionButton(
        onPressed: onPressedNewTask,
        tooltip: 'New Task',
        child: new Icon(Icons.add),
      ),
    );
  }

  void onPressedNewTask(){

  }
}
