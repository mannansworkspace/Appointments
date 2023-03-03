import moment from 'moment';

const timingOptionList = (from, to, interval) => {
    var startTime = new Date();
    startTime.setHours(from.split(':')[0], from.split(':')[1])

    var endTime = new Date();
    endTime.setHours(to.split(':')[0], to.split(':')[1])

    const optionList = [];
    while (startTime.getTime() <= endTime.getTime()) {
        optionList.push(<option key={startTime} value={moment(startTime).format('HH:mm')}>{moment(startTime).format('LT')}</option>);
        startTime.setMinutes(startTime.getMinutes() + interval)
    }

    return optionList
}

export default timingOptionList;