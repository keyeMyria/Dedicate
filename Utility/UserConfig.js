import Files from 'react-native-fs';

function Path(){
    if(typeof Files.MainBundlePath == 'undefined'){
        return Files.DocumentDirectoryPath;
    }else{
        return Files.MainBundlePath
    }
}

export async function getUserConfig(){
    var path = Path();
    var data = await Files.readFile(path + '/user.json').catch((err) => {});
    if(typeof data != 'undefined' && data != null){
        global.config = JSON.parse(data);
    }else{
        global.config = {
            database:'default'
        };
    }
}

export function saveUserConfig(json){
    var path = Path();
    Files.writeFile(path + '/user.json', JSON.stringify(json)).catch((err) => {});
}

export class UserConfig {
    setDefaultDatabase = (name) => {
        global.config.database = name;
        saveUserConfig(global.config);
    }
}