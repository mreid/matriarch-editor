
function createTable(parameters) {

    parameters.forEach(function(param) {
        let row = $('<tr/>', {id: 'row_' + param.id, class: 'disabled'});
        row.append($('<td/>', {text: param.id, class: 'param_id'}));
        row.append($('<td/>', {text: param.name, class: 'param_name'}))
        if (param.notes) {
            row.find('.param_name').append(`<br/><small>${param.notes}</small>`);
        }
        let value_cell = $('<td/>', {class: 'param_value'});
        if (param.display_value) {
            value_cell.append(
                $('<div/>', {class: 'param_value_with_display'})
                    .append(param.values)
                    .append($('<span/>', {class: 'param_display_value'}))
            );
        } else {
            value_cell.append(param.values);
        }
        row.append(value_cell);
        const el = row[0];
        el.update_defaultness = () => {
            const current_value = $(el).find('select,input').val();
            const default_value = $(el).find('select,input')[0].default_value;
            console.log('toggleClass', current_value != default_value);
           $(el).toggleClass('non_default', current_value != default_value);
        };
        el.update_display_value = () => {
            if (!param.display_value) {
                return;
            }
            const current_value = $(el).find('select,input').val();
            $(el).find('.param_display_value').text(param.display_value(current_value));
        };
        param.values.on('input', () => el.update_display_value());
        el.update_display_value();
        $('#parameters').append(row);
    });
}
