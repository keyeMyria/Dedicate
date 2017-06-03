import 'package:flutter/material.dart';
import 'drawer.dart';

class PageProgress extends StatefulWidget {
  PageProgress({Key key, this.title}) : super(key: key);
  final String title;
  @override
  PageProgressState createState() => new PageProgressState();
}

class PageProgressState extends State<PageProgress> {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title)
      ),
      drawer: appDrawer
    );
  }
}
