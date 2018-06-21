import LightPurple from 'themes/LightPurple';

getColorScheme = (theme) => {
    var result = {};
    switch(theme){
        default: case 'LightPurple':
            result = LightPurple;
        break;
    }
    console.warn(JSON.stringify(result, null, 4));
    return result;
}

export default AppStyles = getColorScheme('LightPurple');
