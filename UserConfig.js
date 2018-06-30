import Files from 'react-native-fs';
import {getColorScheme} from 'dedicate/AppStyles';

function Path(){
    if(typeof Files.MainBundlePath == 'undefined'){
        return Files.DocumentDirectoryPath;
    }else{
        return Files.MainBundlePath
    }
}

export async function getUserConfig(){
    if(typeof global.config != 'undefined'){return;}
    var path = Path();
    var data = await Files.readFile(path + '/user.json').catch((err) => {});
    if(typeof data != 'undefined' && data != null){
        global.config = JSON.parse(data);
    }else{
        global.config = {
            database:'default',
            theme:'LightPurple'
        };
    }

    //get user color scheme
    getColorScheme();
}

export function saveUserConfig(json){
    var path = Path();
    Files.writeFile(path + '/user.json', JSON.stringify(json)).catch((err) => {});
}

export class UserConfig {
    setDefaultDatabase(name) {
        global.config.database = name;
        saveUserConfig(global.config);
    }

    setTheme(theme){
        global.config.theme = theme;
        saveUserConfig(global.config);
        getColorScheme();
        global.reload();
    }
}