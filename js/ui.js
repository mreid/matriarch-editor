
function createTable(parameters) {

    parameters.forEach(function(param) {
        let row = $('<tr/>', {id: 'row_' + param.id, class: 'disabled'});
        row.append($('<td/>', {text: param.id, class: 'param_id'}));
        row.append($('<td/>', {text: param.name, class: 'param_name'}))
        if (param.notes) {
            row.find('.param_name').append(`<br/><small>${param.notes}</small>`);
        }
        row.append($('<td/>', {class: 'param_value'}).append(param.values));
        const el = row[0];
        el.update_defaultness = () => {
            const current_value = $(el).find('select,input').val();
            const default_value = $(el).find('select,input')[0].default_value;
            console.log('toggleClass', current_value != default_value);
           $(el).toggleClass('non_default', current_value != default_value);
        };
        $('#parameters').append(row);
    });
}

