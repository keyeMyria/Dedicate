import React from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import Text from 'text/Text';
import Textbox from 'fields/Textbox';
import Button from 'buttons/Button';
import ButtonClose from 'buttons/ButtonClose';
import Body from 'ui/Body';
import IconTasks from 'icons/IconTasks';
import DbCategories from 'db/DbCategories';

export default class CategoriesScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            categories:[],
            newcat:''
        }

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
        this.loadContent = this.loadContent.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.getCategoriesList = this.getCategoriesList.bind(this);
        this.onPressAddCategory = this.onPressAddCategory.bind(this);
        this.onNewCategoryTitleChangeText = this.onNewCategoryTitleChangeText.bind(this);
        this.onPressCreateCategory = this.onPressCreateCategory.bind(this);
        this.onRemoveCategory = this.onRemoveCategory.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();
        this.loadContent();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.navigate('Default');
        if(typeof global.updatePrevScreen != 'undefined'){ global.updatePrevScreen(); }
        return true;
    }

    loadContent(){
        this.setState({categories:this.getCategories()}, () => {
            this.getCategoriesList();
        });
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Task Catgories',
            buttonAdd:true, 
            buttonRecord:false, 
            bottomFade:true, 
            hasTasks:false, 
            hasRecords:false,
            footerMessage: '',
            onAdd:this.onPressAddCategory
        });
    }

    // Get Categories ////////////////////////////////////////////////////////////////////////////////////////////////////

    categories = ['Personal Tasks', 'Side Projects', 'Exercise Routines', 'Dieting', 'Shopping', 'Research', 
    'Web Design', 'College', 'Cooking Recipes', 'Video Games', 'Vacation', 'Before Bed', 'Good Morning', 
    'Finances', 'Vehicle Maintenance', 'Medicine', 'Cleaning', 'Conventions', 'Concerts', 'Weekend Projects'];
    
    getCategories(){
        const dbCat = new DbCategories;
        return dbCat.GetCategoriesList().map((cat) => {
            return {id:cat.id, name:cat.name}  
        });
    }

    getCategoriesList(){
        this.setState({
            categoriesList:this.state.categories.map(cat => { 
                return (
                    <View key={cat.name} style={this.styles.catItemContainer}>
                        <View style={this.styles.catIcon}><IconTasks size="xsmall"></IconTasks></View>
                        <Text style={this.styles.catName}>{cat.name}</Text>
                        <View style={this.styles.buttonRemoveContainer}>
                            <ButtonClose size="xxsmall" color={AppStyles.color} style={this.styles.buttonRemoveInput}
                                onPress={() => this.onRemoveCategory(cat)}
                            />
                        </View>
                    </View>
                );}
            )
        });
    }
    
    // Add Category ////////////////////////////////////////////////////////////////////////////////////////////////////

    onPressAddCategory = () => {
        this.setState({categoryIndex: Math.floor(Math.random() * (this.categories.length))});
        global.Modal.setContent('Add A New Category',(
            <View style={[this.styles.modalContainer, {minWidth:300}]}>
                <Text style={this.styles.fieldTitle}>Label</Text>
                <Textbox
                    style={this.styles.inputField}
                    placeholder={this.categories[this.state.categoryIndex]}
                    returnKeyType={'done'}
                    onChangeText={this.onNewCategoryTitleChangeText}
                    maxLength={25}
                />
                <View style={this.styles.createCategoryButton}>
                    <Button text="Create Category" onPress={this.onPressCreateCategory}/>
                </View>
            </View>
        ));
        global.Modal.show();
    }

    onNewCategoryTitleChangeText = (text) => {
        this.setState({newcat:text});
    }

    onPressCreateCategory(){
        if(this.state.newcat == ''){
            Alert.alert('Create Category Error', 'You must provide a label for your new category');
            return;
        }
        const dbCat = new DbCategories;
        dbCat.CreateCategory({name:this.state.newcat});
        this.setState({categories:this.getCategories()}, 
        () => {
            this.getCategoriesList();
            global.Modal.hide();
        });
    }
    
    // Remove Category ////////////////////////////////////////////////////////////////////////////////////////////////////

    onRemoveCategory(cat){
        Alert.alert(
            'Delete Category?',
            'Do you really want to delete this category? All tasks that use this category will no longer be categorized',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete Category', onPress: () => {
                    const db = new DbCategories();
                    db.DeleteCategory(cat.id);
                    global.overviewChanged = true;
                    this.loadContent();
                }}
            ],
            { cancelable: true }
            )
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Categories" backButton={this.hardwareBackPress}>
                <View style={this.styles.container}>
                    {this.state.categories.length > 0 ? this.state.categoriesList : 
                        <Text style={this.styles.nocats}>You haven't created any categories yet</Text>
                    }
                </View>
            </Body>
        )
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        nocats:{textAlign:'center', width:'100%', paddingTop:50},
        container:{paddingBottom:110},
        catItemContainer:{width:'100%', flexDirection:'row', padding:15, borderBottomWidth:1, borderBottomColor:AppStyles.separatorColor},
        catIcon:{paddingRight:10},
        catName:{fontSize:20},
        inputField: {fontSize:20},
        modalContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%', padding:30},
        buttonRemoveContainer:{position:'absolute', right:12, top:5},
        buttonRemoveInput:{paddingVertical:15, paddingHorizontal:10},
    });
}