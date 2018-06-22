import DayInYear from 'utility/DayInYear';

export default function DateSentence(date){
    const today = new Date();
    var d1 = DayInYear(today);
    var d2 = DayInYear(date);
    const days = d1 - d2;
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if(days == -1){
        return "Tomorrow";
    }else if(days == 0){
        return 'Today';
    }else if(days == 1){
        return 'Yesterday';
    }else if( days < 7){
        return 'Last ' + day[date.getDay()];
    }

    nth = (d) => {
    if(d>3 && d<21) return 'th';
    switch (d % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    } 

    return day[date.getDay()] + ', ' + month[date.getMonth()] + ' ' + date.getDate() + nth(date.getDate()) + ', ' + date.getFullYear();
}