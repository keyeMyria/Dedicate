import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight, TouchableOpacity, BackHandler, Alert } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import Textbox from 'fields/Textbox';
import Button from 'buttons/Button';
import ButtonDots from 'buttons/ButtonDots';
import Realm from 'realm';
import Schema from 'db/Schema';
import Files from 'react-native-fs';
import {UserConfig} from 'dedicate/UserConfig';
import IconDatabases from 'icons/IconDatabases';

export default class DatabaseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: this.getFiles(),
            newDatabase:''
        };

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.navigate('Overview');
        return true;
    }

    Path = () => {
        var path = Realm.defaultPath;
        return path.substring(0, path.lastIndexOf('/') + 1);
    }

    getFiles = () => {
        var that = this;
        var path = this.Path();
        Files.readDir(path)
        .then((result) => {
            if(result != null){
                that.setState({
                    files:result.filter(a => a.isFile() == true && a.name.split('.').length == 2 && a.name.split('.')[1] =='realm')
                });
            }
        });
    }

    openDatabase = (name) => {
        var config = new UserConfig();
        config.setDefaultDatabase(name);
        Schema(name);
        this.props.navigation.navigate('Overview');
    }

    showAddDatabase = () => {
        var that = this;
        global.Modal.setContent('New Database', () => {
            return (
                <View style={[styles.modalContainer, {minWidth:300}]}>
                    <Text style={styles.fieldTitle}>Database Name</Text>
                    <Textbox 
                        ref="tasklabel"
                        value={that.state.newDatabase}
                        style={styles.inputField} 
                        placeholder="MyData"
                        returnKeyType={'done'}
                        onChangeText={that.onAddDatabaseTextChange}
                    />
                    <View style={styles.createDatabaseButton}>
                        <Button text="Create Database" onPress={() => that.onPressCreateDatabase()}/>
                    </View>
                </View>
            )
        });
        global.Modal.show();
    }

    onAddDatabaseTextChange = (value) => {
        this.setState({newDatabase:value.replace(' ', '')});
    }

    onPressCreateDatabase = () => {
        if(this.state.newDatabase == ''){
            Alert.alert('New Database', "Please specify a name for your new database");
            return;
        }
        if(this.state.files.filter(a => a.name.replace('.realm','') == this.state.newDatabase.toLowerCase()).length > 0){
            Alert.alert("New Database", "The databases you specified already exists");
            return;
        }
        this.openDatabase(this.state.newDatabase.replace(' ', ''));
    }

    showDatabaseMenu = (name) => {
        var that = this;
        global.Modal.setContent(name, () => {
            var i = 0;
            var items = [
                {label:'Delete', click: this.showDeleteDatabaseAlert},
                {label:'Rename', click: this.showRenameDatabase}
            ]
            return (
                <View style={styles.modalMenuContainer}>
                    {items.map((item) => {
                        i++;
                        return (
                            <TouchableOpacity key={i} onPress={() => {global.Modal.hide(); item.click.call(that, name);}}>
                            <View style={styles.modalItemContainer}>
                                <Text style={styles.modalItemText}>{item.label}</Text>
                            </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )
        });
        global.Modal.show();
    }

    showDeleteDatabaseAlert = (name) => {
        Alert.alert(
            'Delete Database',
            'Do you really want to permanently delete the database "' + name + '"?. This cannot be undone!',
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'Delete', onPress: () => {
                  if(global.database.name == name){
                      Alert.alert('Delete Database', 'Cannot delete currently loaded database. Switch to another database before deleting this one.');
                  }else{
                    //permanently delete database files
                    var path = this.Path();
                    try{ Files.unlink(path + name + '.realm').catch((err) => {}); }catch(ex){}
                    try{ Files.unlink(path + name + '.realm.management').catch((err) => {}); }catch(ex){}
                    try{ Files.unlink(path + name + '.realm.lock').catch((err) => {}); }catch(ex){}
                    try{ Files.unlink(path + name + '.realm.note').catch((err) => {}); }catch(ex){}
                    this.setState({files:this.getFiles()});
                  }
              }}
            ],
            { cancelable: true }
          )
    }

    showRenameDatabase = (name) => {
        var that = this;
        this.setState({newDatabase:name});
        global.Modal.setContent('Rename Database "' + name + '"', () => {
            return (
                <View style={[styles.modalContainer, {minWidth:300}]}>
                    <Text style={styles.fieldTitle}>Database Name</Text>
                    <Textbox 
                        ref="tasklabel"
                        value={that.state.newDatabase}
                        style={styles.inputField} 
                        placeholder="MyData"
                        returnKeyType={'done'}
                        onChangeText={that.onAddDatabaseTextChange}
                    />
                    <View style={styles.createDatabaseButton}>
                        <Button text="Rename Database" onPress={() => that.onPressRenameDatabase.call(that, name)}/>
                    </View>
                </View>
            )
        });
        global.Modal.show();
    }

    onPressRenameDatabase = (name) => {
        if(this.state.newDatabase == ''){
            Alert.alert('New Database', "Please specify a name for your new database");
            return;
        }
        if(this.state.files.filter(a => a.name.replace('.realm','') == this.state.newDatabase.toLowerCase()).length > 0){
            Alert.alert("New Database", "The databases you specified already exists");
            return;
        }
        if(global.database.name == name){
            //close active database to rename files
            global.realm = null;
        }
        var path = this.Path();
        var newname = this.state.newDatabase;
        try{ Files.moveFile(path + name + '.realm', path + newname + '.realm').catch((err) => {}); }catch(ex){}
        try{ Files.moveFile(path + name + '.realm.management', path + newname + '.realm.management').catch((err) => {}); }catch(ex){}
        try{ Files.moveFile(path + name + '.realm.lock', path + newname + '.realm.lock').catch((err) => {}); }catch(ex){}
        try{ Files.moveFile(path + name + '.realm.note', path + newname + '.realm.note').catch((err) => {}); }catch(ex){}
        this.setState({files:this.getFiles()});

        if(global.database.name == name){
            //reopen active database that was renamed
            Schema(newname);

            if(name == global.config.database){
                var config = new UserConfig();
                config.setDefaultDatabase(newname);
            }
        }
        global.Modal.hide();
    }

    render() {
        var that = this;
        var filelist;
        if(this.state.files != null){
            filelist = this.state.files.map((file) => {
                var name = file.name.replace('.realm', '');
                return (
                    <TouchableHighlight key={file.name} underlayColor={AppStyles.listItemPressedColor} onPress={() => {this.openDatabase.call(that, name)}}>
                        <View style={styles.databaseItemContainer}>
                            <View style={styles.databaseLabel}>
                                <View style={styles.databaseIcon}><IconDatabases size="xsmall"></IconDatabases></View>
                                <Text style={styles.databaseName}>{file.name.replace('.realm', '')}</Text>
                            </View>
                            <ButtonDots style={styles.btnDots} size="small" fill={AppStyles.buttonLightColor} onPress={() => {this.showDatabaseMenu.call(that, name)}}></ButtonDots>
                        </View>
                    </TouchableHighlight>
                );
            });
        }else{
            filelist = (<View></View>);
        }
        
        return (
            <Body {...this.props} style={styles.body} title="Available Databases" screen="Databases" buttonAdd={true} buttonRecord={false} onAdd={this.showAddDatabase}>
                <ScrollView>
                    {filelist}
                </ScrollView>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    databaseListContainer:{top:0, bottom:0, left:0, right:0},
    databaseItemContainer:{flex:1, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:30, paddingVertical:15, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
    databaseLabel:{flexDirection:'row', justifyContent:'flex-start'},
    databaseIcon:{paddingRight:10, paddingTop:2},
    databaseName:{fontSize:20},
    btnDots:{alignSelf:'flex-end'},

    inputField: {fontSize:20},
    fieldTitle: {fontSize:16, fontWeight:'bold'},

    //new database modal window
    modalContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%', padding:30},
    modalMenuContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%'},
    modalItemContainer:{paddingVertical:15, paddingHorizontal:30, borderBottomColor: AppStyles.separatorColor, borderBottomWidth:1},
});