const moment = require('moment');

module.exports.isValidDate = (date) => {
    return moment(date,'YYYY-MM-DD').isValid();
}

module.exports.getFormattedDate = (date) => {
    return moment(date,'YYYY-MM-DD').endOf('day');
}

module.exports.isAfterOrToday = (date) => {
    return moment(date,'YYYY-MM-DD').isSameOrAfter(moment().format('YYYY-MM-DD'));
}

module.exports.isTokenValid = (token,validTill) => {
    return moment(new Date()).isSameOrBefore(moment(token).add(validTill,'minutes'));
}

module.exports.isSecretCodeValid = (createdDate, validTill) => {
    return moment.utc(new Date()).isSameOrBefore(moment(createdDate).add(validTill, 'minutes'));
}