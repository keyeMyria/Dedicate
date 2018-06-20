export default DatesMatch = function(date, compare){
    return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() == 
    compare.getFullYear() + '/' + compare.getMonth() + '/' + compare.getDate();
}