export default DatesMatch = function(date, compare){
    var d1 = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    var d2 = compare.getDate() + '/' + compare.getMonth() + '/' + compare.getFullYear();
    return d1 == d2;
}