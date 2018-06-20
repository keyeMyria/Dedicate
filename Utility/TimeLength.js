export default TimeLength = function (datestart, dateend) {
    var diffMs = (dateend - datestart); // milliseconds between dates
    var diffMins =   Math.floor((diffMs / 1000) / 60); // total minutes
    var modSeconds = Math.floor((diffMs / 1000) % 60);
    var modMins =    Math.floor(diffMins % 60);
    var modHours =   Math.floor((diffMins / 60) % 24);
    var modDays =    Math.floor(diffMins / 1440);

    return 'Completed in' + 
        (modDays  > 0 ? ' ' + modDays + ' day' + (modDays != 1 ? 's' : '') + ', ' + modHours + ' hour' + (modHours != 1 ? 's' : '') + ', ' + modMins + ' minute' + (modMins != 1 ? 's' : '') :
        (modHours > 0 ? ' ' + modHours + ' hour' + (modHours != 1 ? 's' : '') + ', ' + modMins + ' minute' + (modMins != 1 ? 's' : '') :
        (modMins  > 0 ? ' ' + modMins + ' minute' + (modMins != 1 ? 's' : '') : 
        (modSeconds > 0 ? '' : ' no time')
        ))) + (modSeconds > 0 ? ' ' + modSeconds + ' second' + (modSeconds != 1 ? 's' : '') : '') + '.';
}