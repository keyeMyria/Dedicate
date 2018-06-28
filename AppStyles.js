import LightPurple from 'themes/LightPurple';

getColorScheme = (theme) => {
    var result = {};
    switch(theme){
        default: case 'LightPurple':
            result = LightPurple;
        break;
    }
    return result;
}

export default AppStyles = getColorScheme('LightPurple');
