import 'package:flutter/material.dart';

final appDrawer = new AppDrawer();
class AppDrawer extends StatefulWidget {
  @override
  AppDrawerState createState() => new AppDrawerState();
}

class AppDrawerState extends State<AppDrawer> {
  @override
  Widget build(BuildContext context) {
    return new Drawer(
      child: new ListView(
        children: [
          new AppDrawerHeader(title: 'Dedicate'),
          new ListTile(title: new Text('Tasks'), leading: new Icon(Icons.timer), onTap:onDrawerLinkPressedForTasks),
          new ListTile(title: new Text('Today'), leading: new Icon(Icons.today), onTap:onDrawerLinkPressedForToday),
          new ListTile(title: new Text('Calendar'), leading: new Icon(Icons.calendar_today), onTap:onDrawerLinkPressedForCalendar),
          new ListTile(title: new Text('Progress'), leading: new Icon(Icons.timeline), onTap:onDrawerLinkPressedForProgress),
          new ListTile(title: new Text('Settings'), leading: new Icon(Icons.settings), onTap:onDrawerLinkPressedForSettings)
        ]
      )
    );
  }

  void onDrawerLinkPressedForTasks(){
    Navigator.pop(context); //hide drawer menu
    Navigator.pushNamed(context, '/Tasks');
  }
  
  void onDrawerLinkPressedForToday(){
    Navigator.pop(context); //hide drawer menu
    Navigator.pushNamed(context, '/Today');
  }

  void onDrawerLinkPressedForCalendar(){
    Navigator.pop(context); //hide drawer menu
    Navigator.pushNamed(context, '/Calendar');
  }

  void onDrawerLinkPressedForProgress(){
    Navigator.pop(context); //hide drawer menu
    Navigator.pushNamed(context, '/Progress');
  }

  void onDrawerLinkPressedForSettings(){
    Navigator.pop(context); //hide drawer menu
    Navigator.pushNamed(context, '/Settings');
  }
}

class AppDrawerHeader extends StatelessWidget {
  const AppDrawerHeader({Key key, this.title}) : super(key:key);
  final String title;

  @override
  Widget build(BuildContext context){
    final ThemeData theme = Theme.of(context);
    return new Container(
      margin: new EdgeInsets.only(top:35.0, bottom:30.0, left:15.0),
      padding: new EdgeInsets.only(bottom:15.0),
      decoration: new BoxDecoration(
        border: new Border(
          bottom: new BorderSide(
            color: theme.dividerColor,
            width: 1.0
          )
        )
      ),
      child: new Center(
        child: new Text(
          title,
          style: new TextStyle(
            fontSize: 20.0,
            color:Colors.deepOrange
          )
        )
      )
    );
  }
}