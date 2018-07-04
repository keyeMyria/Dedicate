import React from 'react';
import { View, StyleSheet, ScrollView, TouchableHighlight, TouchableOpacity, BackHandler, Alert, PermissionsAndroid } from 'react-native';
import Text from 'ui/Text';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import Textbox from 'fields/Textbox';
import Button from 'buttons/Button';
import ButtonDots from 'buttons/ButtonDots';
import Realm from 'realm';
import Schema from 'db/Schema';
import Files from 'react-native-fs';
import {UserConfig} from 'dedicate/UserConfig';
import IconDatabases from 'icons/IconDatabases';
import { zip, unzip } from 'react-native-zip-archive';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import FileUtils from 'react-native-file-utils';

export default class DatabaseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files:[],
            fileList:[],
            newDatabase:''
        };

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.openDatabase = this.openDatabase.bind(this);
        this.showDatabaseMenu = this.showDatabaseMenu.bind(this);
        this.showImportDatabase = this.showImportDatabase.bind(this);
        this.showRenameDatabase = this.showRenameDatabase.bind(this);
        this.exportDatabase = this.exportDatabase.bind(this);
        this.exportJson = this.exportJson.bind(this);
        this.showDeleteDatabaseAlert = this.showDeleteDatabaseAlert.bind(this);
        this.onPressCreateDatabase = this.onPressCreateDatabase.bind(this);
        this.onPressRenameDatabase = this.onPressRenameDatabase.bind(this);
        this.updateExportModal = this.updateExportModal.bind(this);
        this.errorExporting = this.errorExporting.bind(this);
        this.onImportDatabaseTextChange = this.onImportDatabaseTextChange.bind(this);
        this.onPressImportDatabase = this.onPressImportDatabase.bind(this);
        this.getFiles = this.getFiles.bind(this);
        this.onPressOptions = this.onPressOptions.bind(this);
    }
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        //get list of databases
        setTimeout(() => {
            this.getFiles();
        }, 10);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.navigate('Overview');
        return true;
    }

    Path = () => {
        const path = Realm.defaultPath;
        return path.substring(0, path.lastIndexOf('/') + 1);
    }

    getFiles = () => {
        let path = this.Path();
        Files.readDir(path)
        .then((result) => {
            if(result != null){
                let filelist = [];
                let files = [];
                if(this.state.files != null){
                    files = result.filter(a => a.isFile() == true && a.name.split('.').length == 2 && a.name.split('.')[1] =='realm');
                    filelist = files.map((file) => {
                        const name = file.name.replace('.realm', '');
                        return (
                            <TouchableHighlight key={file.name} underlayColor={AppStyles.listItemPressedColor} 
                                onPress={() => {
                                    this.openDatabase(name); 
                                    this.props.navigation.navigate('Overview');}
                                }
                            >
                                <View style={this.styles.databaseItemContainer}>
                                    <View style={this.styles.databaseLabel}>
                                        <View style={this.styles.databaseIcon}><IconDatabases size="xsmall"></IconDatabases></View>
                                        <Text style={this.styles.databaseName}>{file.name.replace('.realm', '')}</Text>
                                    </View>
                                    <ButtonDots style={this.styles.btnDots} size="small" fill={AppStyles.buttonLightColor} onPress={() => {this.showDatabaseMenu(name)}}></ButtonDots>
                                </View>
                            </TouchableHighlight>
                        );
                    });
                }else{
                    filelist = (<View></View>);
                }
                this.setState({files:files, fileList:filelist});
            }
        });
    }
    
    // Menus //////////////////////////////////////////////////////////////////////////////////////////////////////
    onPressOptions(){
        let i = 0;
        let items = [
            {label:'Import Database', click: this.showImportDatabase}
        ]
        global.Modal.setContent("Database Options", (
            <View style={this.styles.modalMenuContainer}>
                {items.map((item) => {
                    i++;
                    return (
                        <TouchableOpacity key={i} onPress={() => {global.Modal.hide(); item.click();}}>
                        <View style={this.styles.modalItemContainer}>
                            <Text style={this.styles.modalItemText}>{item.label}</Text>
                        </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        ));
        global.Modal.show();
    }

    showDatabaseMenu = (name) => {
        let i = 0;
        let items = [
            {label:'Rename', click: this.showRenameDatabase},
            {label:'Export Database', click: this.exportDatabase},
            {label:'Export JSON', click: this.exportJson},
            {label:'Delete', click: this.showDeleteDatabaseAlert}
        ]
        global.Modal.setContent(name, (
            <View style={this.styles.modalMenuContainer}>
                {items.map((item) => {
                    i++;
                    return (
                        <TouchableOpacity key={i} onPress={() => {global.Modal.hide(); item.click(name);}}>
                        <View style={this.styles.modalItemContainer}>
                            <Text style={this.styles.modalItemText}>{item.label}</Text>
                        </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        ));
        global.Modal.show();
    }
    
    // Open Database //////////////////////////////////////////////////////////////////////////////////////////////////////

    openDatabase = (name) => {
        let config = new UserConfig();
        config.setDefaultDatabase(name);
        Schema(name);
    }
    
    // Create Database //////////////////////////////////////////////////////////////////////////////////////////////////////

    showAddDatabase = () => {
        global.Modal.setContent('New Database', (
            <View style={[this.styles.modalContainer, {minWidth:300}]}>
                <Text style={this.styles.fieldTitle}>Database Name</Text>
                <Textbox
                    defaultValue={this.state.newDatabase}
                    style={this.styles.inputField} 
                    placeholder="MyData"
                    returnKeyType={'done'}
                    onChangeText={this.onAddDatabaseTextChange}
                />
                <View style={this.styles.createDatabaseButton}>
                    <Button text="Create Database" onPress={() => this.onPressCreateDatabase()}/>
                </View>
            </View>
        ));
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
        this.getFiles();
        global.Modal.hide();
    }
    
    // Rename Database //////////////////////////////////////////////////////////////////////////////////////////////////////

    showRenameDatabase = (name) => {
        this.setState({newDatabase:name});
        global.Modal.setContent('Rename Database "' + name + '"', (
            <View style={[this.styles.modalContainer, {minWidth:300}]}>
                <Text style={this.styles.fieldTitle}>Database Name</Text>
                <Textbox
                    defaultValue={this.state.newDatabase}
                    style={this.styles.inputField} 
                    placeholder="MyData"
                    returnKeyType={'done'}
                    onChangeText={this.onRenameDatabaseTextChange}
                />
                <View style={this.styles.createDatabaseButton}>
                    <Button text="Rename Database" onPress={() => this.onPressRenameDatabase(name)}/>
                </View>
            </View>
        ));
        global.Modal.show();
    }

    onRenameDatabaseTextChange = (value) => {
        this.setState({newDatabase:value});
    }

    onPressRenameDatabase = (name) => {
        name = name.replace(' ', '');
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
        let path = this.Path();
        let newname = this.state.newDatabase;
        try{ Files.moveFile(path + name + '.realm', path + newname + '.realm').catch((err) => {}); }catch(ex){}
        try{ Files.moveFile(path + name + '.realm.management', path + newname + '.realm.management').catch((err) => {}); }catch(ex){}
        try{ Files.moveFile(path + name + '.realm.lock', path + newname + '.realm.lock').catch((err) => {}); }catch(ex){}
        try{ Files.moveFile(path + name + '.realm.note', path + newname + '.realm.note').catch((err) => {}); }catch(ex){}
        this.getFiles();

        if(global.database.name == name){
            //reopen active database that was renamed
            Schema(newname);

            if(name == global.config.database){
                let config = new UserConfig();
                config.setDefaultDatabase(newname);
            }
        }
        global.Modal.hide();
    }
    
    // Delete Database //////////////////////////////////////////////////////////////////////////////////////////////////////

    showDeleteDatabaseAlert = (name) => {
        Alert.alert(
            'Delete Database',
            'Do you really want to permanently delete the database "' + name + '"? This cannot be undone!',
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'Delete', onPress: () => {
                  if(global.database.name == name){
                      Alert.alert('Delete Database', 'Cannot delete currently loaded database. Switch to another database before deleting this one.');
                  }else{
                    //permanently delete database files
                    let path = this.Path();
                    try{ Files.unlink(path + name + '.realm').catch((err) => {}); }catch(ex){}
                    try{ Files.unlink(path + name + '.realm.management').catch((err) => {}); }catch(ex){}
                    try{ Files.unlink(path + name + '.realm.lock').catch((err) => {}); }catch(ex){}
                    try{ Files.unlink(path + name + '.realm.note').catch((err) => {}); }catch(ex){}
                    this.getFiles();
                    Alert.alert('Database Deleted', 'The database "' + name + '" has been succcessfully deleted');
                  }
              }}
            ],
            { cancelable: true }
          )
    }

    // Export Database //////////////////////////////////////////////////////////////////////////////////////////////////////

    exportDatabase = (name) => {
        let path = this.Path();
        let download = FileUtils.DownloadsDirectoryPath + '/';
        let exportFile = download + 'Dedicate_' + name.replace(/\s/g, '_') + '.zip';
        let exportPath = path + 'export/';
        let copyerr = 'Could not copy all required files';

        requestFilePermission((access) => {
            if(access == true){
                this.updateExportModal(<View><Text>Copying database files...</Text></View>);

                //make a temporary directory used to generate a zip file with
                Files.mkdir(exportPath);
                Files.mkdir(download);

                //copy database files into temporary export folder
                const tasks = [];
                const files = [
                    [path + name + '.realm', exportPath + 'default.realm'],
                    [path + name + '.realm.lock', exportPath + 'default.realm.lock'],
                    //[path + name + '.realm.note', exportPath + name + '.realm.note'],
                    //[path + name + '.realm.management', exportPath + name + '.realm.management'],
                ];
                for (let i = 0; i < files.length; i++) {
                    if(Files.exists(files[i][0])){
                        tasks.push(Files.copyFile(files[i][0], files[i][1]));
                    }
                }
                Promise.all(tasks).then(() => {
                    
                    //zip temporary export folder and save to device Download folder
                    this.updateExportModal(<View><Text>Creating zip file...</Text></View>);
                    zip(path + 'export', exportFile)
                    .then((finalPath) => {
                        //finally, delete temporary folder
                        Files.unlink(exportPath);
                        global.Modal.hide();
                        Alert.alert('Export Success', 'Database "' + name + '" successfully exported to "' + finalPath + '"');
                    }).catch(() => {this.errorExporting('Could not compress database into a zip file');});
                }).catch(() => {this.errorExporting(copyerr);});
            }
        });
        
        
    }

    updateExportModal = (content) => {
        global.Modal.setContent("Export Database", (
            <View style={this.styles.modalMenuContainer}>
                {content}
            </View>
        ));
    }

    errorExporting(msg){
        global.Modal.hide();
        Alert.alert("Error!", "An error ocurred while exporting the database! " + msg);
    }

    // Export JSON //////////////////////////////////////////////////////////////////////////////////////////////////////

    exportJson = (name) => {
        let download = FileUtils.DownloadsDirectoryPath + '/';
        let exportFile = download + 'Dedicate_' + name.replace(/\s/g, '_') + '.json';

        requestFilePermission((access) => {
            if(access == true){
                this.updateExportModal(<View><Text>Generating JSON file...</Text></View>);

                //make sure export directory exists
                Files.mkdir(download);

                //generate JSON file
                try{
                    let json = JSON.stringify({
                        tasks: global.realm.objects('Task'),
                        categories: global.realm.objects('Category'),
                        records: global.realm.objects('Record').map(a => {return {
                            //strip records of redundant information by specifying selective properties
                            id:a.id,
                            taskId:a.taskId,
                            datestart:a.datestart,
                            dateend:a.dateend,
                            time:a.time,
                            timer:a.timer,
                            inputs:a.inputs.map(b =>{ return {
                                number:b.number,
                                text:b.text,
                                date:b.date,
                                type:b.type,
                                inputId:b.inputId
                            };})
                        };})
                    }, null, 4);
    
                    Files.writeFile(exportFile, json);
                    global.Modal.hide();
                    Alert.alert('Export Success', 'The database "' + name + '" has been exported in JSON format to ' + exportFile);
                }catch(ex){
                    Alert.alert('Export Error', 'An error ocurred while trying to generate the exported JSON file');
                    console.error(ex);
                }
            }
        });
        
        
    }

    updateExportModal = (content) => {
        global.Modal.setContent("Export Database", (
            <View style={this.styles.modalMenuContainer}>
                {content}
            </View>
        ));
    }

    errorExporting(msg){
        global.Modal.hide();
        Alert.alert("Error!", "An error ocurred while exporting the database! " + msg);
    }
    
    // Import Database //////////////////////////////////////////////////////////////////////////////////////////////////////
    
    showImportDatabase(){
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
          },(error,file) => {
              if(file != null){
                //validate file
                if(file.fileName.indexOf('.zip') < 0){
                    Alert.alert('Import Error', 'The database must be contained within a ZIP file');
                    return;
                }

                //show modal so user can specify a name for their newly imported database
                let name = '';
                if(file.fileName.indexOf('Dedicate_') == 0){
                    name = file.fileName.replace('Dedicate_', '').replace('.zip', '');
                }

                global.Modal.setContent('Import Database', (
                    <View style={[this.styles.modalContainer, {minWidth:300}]}>
                        <Text style={this.styles.fieldTitle}>Database Name</Text>
                        <Textbox 
                            defaultValue={name}
                            style={this.styles.inputField} 
                            placeholder="MyData"
                            returnKeyType={'done'}
                            onChangeText={(value) => this.onImportDatabaseTextChange(value)}
                        />
                        <View style={this.styles.createDatabaseButton}>
                            <Button text="Import Database" onPress={() => this.onPressImportDatabase(file)}/>
                        </View>
                    </View>
                ));
                global.Modal.show();
              }
          });
    }

    onImportDatabaseTextChange(value){
        this.importName = value;
    }

    onPressImportDatabase(file){
        global.Modal.hide();
        let path = this.Path();
        let name = this.importName.toString().replace(/\s/g, '');
        //TODO: Check name for special characters
        delete this.importName;
        if(this.state.files.filter(a => a.name.replace('.realm' , '').toLowerCase() == name.toLowerCase()).length > 0){
            if(global.database.name.toLowerCase() == name.toLowerCase()){
                Alert.alert('Existing Database', 'The database you wish to import is currently loaded. Load a different database before overriding the currently loaded database with a newly imported one.');
                return;
            }
        }

        //unzip database and try to import
        FileUtils.getPathFromURI(file.uri).then(f => {
            let importPath = path + 'import/';
            
            //make temp import folder
            Files.mkdir(importPath).then(() => {
                unzip(f, importPath).then(() => {
                    //move files from the import folder
                    const tasks = [];
                    const files = [
                        [importPath + 'default.realm', path + name + '.realm'],
                        [importPath + 'default.realm.lock', path + name + '.realm.lock'],
                        //[importPath + 'default.realm.note', path + name + '.realm.note'],
                        //[importPath + 'default.realm.management', path + name + '.realm.management'],
                    ];
                    for (let i = 0; i < files.length; i++) {
                        if(Files.exists(files[i][0])){
                            tasks.push(Files.moveFile(files[i][0], files[i][1]));
                        }
                    }
                    Promise.all(tasks).then(() => {
                        //delete import folder
                        Files.unlink(importPath);
        
                        //reload database list
                        this.getFiles();
                        Alert.alert('Import Success', 'The database "' + name + '" was imported successfully');
                    }).catch(() => {Alert.alert('Import Error', 'Could not move unzipped database files');});
        
                }).catch((ex) => { console.error(ex); Alert.alert('Import Error', 'Could not unzip database file');}); 
            }).catch(() => { Alert.alert('Import Error', 'Could not create import folder');}); 
    
            
        });
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Available Databases" screen="Databases" buttonAdd={true} buttonRecord={false} onAdd={this.showAddDatabase}
                titleBarButtons={<ButtonDots style={this.styles.titlebarOptions} size="small" fill={AppStyles.headerTextColor} onPress={() => this.onPressOptions()}/>}
                footerMessage={this.state.fileList.length <= 3 ? "Create a new database and start recording a separate experiment" : ''}
            >
                <ScrollView>
                    {this.state.fileList}
                </ScrollView>
            </Body>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        titlebarOptions:{paddingTop:13, paddingRight:15},
        databaseListContainer:{top:0, bottom:0, left:0, right:0},
        databaseItemContainer:{flex:1, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:15, paddingVertical:15, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
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
        modalItemText:{fontSize:17},
        createDatabaseButton:{paddingTop:10}
    });
}


async function requestFilePermission(callback) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'File System Permissions',
          'message': 'Dedicate needs access to your file system before exporting your database'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        callback(true);
      } else {
        callback(false);
      }
    } catch (err) {
      callback(false);
    }
  }