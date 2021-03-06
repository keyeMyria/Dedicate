import Realm from 'realm';
import {Alert} from 'react-native';
import Db from 'db/Db';

export default class DbCategories extends Db{
    CreateCategory(category, updateExisting){
        //generate id for Category
        let id = 1;
        let len = global.realm.objects('Category').length
        if(category.id != null){
            id = category.id;
        }else{
            if(len > 0){
                id = (global.realm.objects('Category').sorted('id', true).slice(0,1)[0].id) + 1;
            }
        }
        if(len > 0){
            let hasname = global.realm.objects('Category').filtered('name = "' + category.name + '"');
            if(hasname.length > 0){
                Alert.alert('Error Creating Category', 'The category "' + category.name + '" already exists');
                return;
            };
        }

        //save category into the database
        global.realm.write(() => {
            global.realm.create('Category', {
                id:id, 
                name: category.name
            }, updateExisting || false);
        });
        return id;
    }

    HasCategories(){
        return global.realm.objects('Category').length > 0;
    }

    GetCategoriesList(options){
        if(!options){
            options = {sorted:'name', descending:false, filtered:null}
        }
        
        let categories = global.realm.objects('Category').sorted('id', true)
        if(options.sorted){
            categories.sorted(options.sorted, options.descending ? options.descending : false)
        }
        if(options.filtered != null){
            if(typeof options.filtered == 'string'){
                categories = categories.filtered(options.filtered);
            }else{
                categories = categories.filtered(...options.filtered);
            }
            
        }
        return categories;
    }

    TotalCategories(filtered){
        let categories = global.realm.objects('Category');
        if(filtered){categories.filtered(...filtered);}
        return categories.length;
    }

    GetCategory(categoryId){
        let category = global.realm.objects('Category').filtered('id=' + categoryId);
        return category ? category[0] : null;
    }

    DeleteCategory(categoryId){
        global.realm.write(() => {
            //finally, delete category
            global.realm.delete(global.realm.objects('Category').filtered('id=' + categoryId));
        });
    }
}