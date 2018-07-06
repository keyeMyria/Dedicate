import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Keyboard, Dimensions } from 'react-native';
import Text from 'text/Text';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import CheckBox from 'fields/CheckBox';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonSave from 'buttons/ButtonSave';
import ButtonClose from 'buttons/ButtonClose';
import ButtonPlus from 'buttons/ButtonPlus';
import ScreenBody from 'ui/Body';


export default class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            form:{
                height:250
            },
            islive:false,
            title:this.props.title,
            screenTitle:this.props.title,
            ButtonAddShow: true,
            ButtonInTitleBar: false,
            contentOffset:0,
            keyboardHeight:0
        }

        //bind methods
        this.keyboardDidShow = this.keyboardDidShow.bind(this);
        this.keyboardDidHide = this.keyboardDidHide.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onPressAddInput = this.onPressAddInput.bind(this);
        this.onPressSave = this.onPressSave.bind(this);
    }

    static Header = FormHeader;
    static Body = FormBody;

    // Component Events  //////////////////////////////////////////////////////////////////////////////////////
    componentWillMount(){
        Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        this.onLayoutChange();
        this.TitleBarButtons();
    }

    componentWillUnmount () {
        Keyboard.removeListener('keyboardDidShow', this.keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this.keyboardDidHide);
        this.onScrollView();
    }

    componentDidUpdate(prevProps){
        if(this.props.edited != prevProps.edited || this.props.onPressAddInput != prevProps.onPressAddInput) {
            this.TitleBarButtons();
        }
    }

    // Keyboard Events  //////////////////////////////////////////////////////////////////////////////////////
    keyboardDidShow (e) {
        this.setState({
            keyboardHeight: e.endCoordinates.height
        })
        this.onScrollView();
    }
    
    keyboardDidHide (e) {
        this.setState({
            keyboardHeight: 0
        })
        this.onScrollView();
    }  

    // Screen Orientation changes  //////////////////////////////////////////////////////////////////////////////////////
    onLayoutChange = () => {
        const {height, width} = Dimensions.get('window');
        if(width > height){
            //landscape
            this.setState({styles: stylesLandscape});
        }else{
            //portrait
            this.setState({styles: stylesPortrait});
        }
    }

    // Element Measurements  //////////////////////////////////////////////////////////////////////////////////////
    measureForm(event) {
        let form = this.state.form;
        form.height = Math.floor(event.nativeEvent.layout.height);
        this.setState({form:form});
    }

    // Child Events //////////////////////////////////////////////////////////////////////////////////////
    onScrollView = event => {
        const offset = event ? event.nativeEvent.contentOffset.y : this.state.contentOffset;
        const headerOffset = this.state.form.height + 15;
        if(offset > 0 && offset > headerOffset){
            if(this.state.ButtonInTitleBar == false){
                //lock button to top of screen
                this.setState({ButtonInTitleBar:true, screenTitle: this.props.bodyTitle}, () => {
                    this.TitleBarButtons();
                });
            }
        }else{
            if(this.state.ButtonInTitleBar == true){
                this.setState({ButtonInTitleBar:false, screenTitle: this.state.title}, () => {
                    this.TitleBarButtons();
                });
            }
        }
        this.setState({contentOffset:offset});
    }

    // TitleBar Button ////////////////////////////////////////////////////////////////////////////////////////
    TitleBarButtons = () => {
        this.setState({
            titlebarButtons:
                <View style={this.styles.titleBarButtons}>
                    {this.state.ButtonInTitleBar && this.props.onPressAddInput && (
                        <View key="buttonAdd" style={this.styles.titleBarButtonAddInput}>
                            <ButtonAdd onPress={this.onPressAddInput}
                            />
                        </View>
                    )}
                    {this.props.edited == true && (
                        <View key="buttonSave" style={this.styles.buttonSaveContainer}>
                            <ButtonSave size="smaller" style={this.styles.buttonSave} onPress={this.onPressSave} />
                        </View>
                    )}
                </View>
            }
        );
    }

    // Button Presses //////////////////////////////////////////////////////////////////////
    onPressAddInput(event){
        this.props.onPressAddInput(event);
        this.onLayoutChange(event);
    }

    onPressSave(){
        this.props.onPressSave();
    }

    render() {
        let header = this.props.children.filter(a => a.type.displayName == 'Header') || [];
        let body = this.props.children.filter(a => a.type.displayName == 'Body') || [];

        return (
            <ScreenBody {...this.props} style={this.styles.body} title={this.state.screenTitle} screen={this.props.screen} onLayout={this.onLayoutChange} 
                    titleBarButtons={this.state.titlebarButtons} onScroll={this.onScrollView}
                >
                <KeyboardAvoidingView behavior="padding">
                <View style={this.styles.headerContainer} onLayout={(event) => this.measureForm(event)}>
                    {header}
                </View>
                <View style={[this.styles.bodyContainer, {paddingBottom:this.state.keyboardHeight + 20}]}>
                    {this.props.bodyTitle &&
                        <View>
                            <Text style={this.styles.bodyTitle}>{this.props.bodyTitle}</Text>
                            {this.state.ButtonAddShow && this.props.onPressAddInput != null && this.state.ButtonInTitleBar == false &&
                                <ButtonAdd size="small" style={[this.styles.buttonAddInput]}
                                    outline={AppStyles.altBackgroundColor}
                                    onPress={this.onPressAddInput}
                                />
                            }
                        </View>
                    }
                    {body}
                </View>
                </KeyboardAvoidingView>
            </ScreenBody>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:AppStyles.altBackgroundColor},
        headerContainer:{minHeight:200, backgroundColor:AppStyles.backgroundColor},
        bodyContainer:{minHeight:100, paddingTop:15},
        bodyTitle: {fontSize:24, paddingTop:2, paddingRight:15, paddingLeft:20, paddingBottom:30 },
        buttonAddInput:{position:'absolute', right:12, zIndex:1},
    
        //title bar buttons
        titleBarButtons:{flexDirection:'row'},
        titleBarButtonAddInput:{paddingTop:3, paddingRight:8, zIndex:1002},
        buttonSaveContainer: {width:75, zIndex:1001, paddingLeft:10, paddingBottom:12, backgroundColor:AppStyles.headerDarkColor},
        buttonSave:{padding:12 },

    });
}

const stylesLandscape = StyleSheet.create({
    inputsDescription: {top:'-20%', maxWidth:'90%'}
});

const stylesPortrait = StyleSheet.create({
    inputsDescription: {top:'-10%', maxWidth:'100%'},
});

export class FormHeader extends React.Component{
    constructor(props){
        super(props);
    }

    static displayName = "Header"

    render = () => this.props.children;
}

export class FormBody extends React.Component{
    constructor(props){
        super(props);
    }

    static displayName = "Body"

    render = () => this.props.children;
}

