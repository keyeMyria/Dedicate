import Realm from 'realm';

export default class Db{
    Wipe() {
        global.realm.write(() => {
            global.realm.deleteAll();
        });
    }
}