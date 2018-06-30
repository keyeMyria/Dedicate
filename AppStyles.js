import {getUserConfig} from 'dedicate/UserConfig';
import LightPurple from 'themes/LightPurple';
import DarkPurple from 'themes/DarkPurple';

export async function getColorScheme(){
    await getUserConfig();
    var theme = {};
    switch(global.config.theme){
        default: case 'LightPurple':
            theme = LightPurple;
            break;
        case 'DarkPurple':
            theme = DarkPurple;
            break;
    }
    global.theme = theme;
    global.styles = AppStyles;
}

function getColor(color){
    if(global.theme){
        //loaded theme
        return global.theme[color];
    }else{
        //default theme
        return LightPurple[color];
    }
}

getStyles= () => {
    const styles = {
        //fonts
        get color(){ return getColor('color');},
        get textColor(){ return getColor('textColor');},
        get linkColor(){ return getColor('linkColor');},
        get numberColor(){ return getColor('numberColor');},

        //inputs
        get placeholderColor(){ return getColor('placeholderColor');},
        get underlineColor(){ return getColor('underlineColor');},
        get stopWatchColor(){ return getColor('stopWatchColor');},

        //header
        get headerColor(){ return getColor('headerColor');},
        get headerDarkColor(){ return getColor('headerDarkColor');},
        get headerTextColor(){ return getColor('headerTextColor');},

        //background
        get backgroundColor(){ return getColor('backgroundColor');},
        get separatorColor(){ return getColor('separatorColor');},
        get altBackgroundColor(){ return getColor('altBackgroundColor');},
        get altSeparatorColor(){ return getColor('altSeparatorColor');},

        //buttons
        get buttonColor(){ return getColor('buttonColor');},
        get buttonTextColor(){ return getColor('buttonTextColor');},
        get buttonPressedColor(){ return getColor('buttonPressedColor');},
        get buttonPressedTextColor(){ return getColor('buttonPressedTextColor');},
        get buttonOutlineColor(){ return getColor('buttonOutlineColor');},
        get buttonOutlineTextColor(){ return getColor('buttonOutlineTextColor');},
        get buttonOutlinePressedColor(){ return getColor('buttonOutlinePressedColor');},
        get buttonOutlinePressedTextColor(){ return getColor('buttonOutlinePressedTextColor');},
        get buttonLightColor(){ return getColor('buttonLightColor');},

        // list item styling /////////////////////
        get listItemSelectedColor(){ return getColor('listItemSelectedColor');},
        get listItemSelectedTextColor(){ return getColor('listItemSelectedTextColor');},
        get listItemPressedColor(){ return getColor('listItemPressedColor');},
        get listItemPressedTextColor(){ return getColor('listItemPressedTextColor');},

        // star color //////////////////////////
        get starColor(){ return getColor('starColor');},

        // chart styling /////////////////////////
        get chartLine1Stroke(){ return getColor('chartLine1Stroke');},
        get chartLine2Stroke(){ return getColor('chartLine2Stroke');},
        get chartDotFill(){ return getColor('chartDotFill');}
    }
    global.styles = styles;
    return styles;
}

export default AppStyles = global.styles || getStyles();