import 'package:flutter/material.dart';
import 'drawer.dart';

class PageSettings extends StatefulWidget {
  PageSettings({Key key, this.title}) : super(key: key);
  final String title;
  @override
  PageSettingsState createState() => new PageSettingsState();
}

class PageSettingsState extends State<PageSettings> {
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
