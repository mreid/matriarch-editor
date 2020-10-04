
function createTable(parameters) {

    parameters.forEach(function(param) {
        let row = $('<tr/>', {id: 'row_' + param.id, class: 'disabled'});
        row.append($('<td/>', {text: param.id, class: 'param_id'}));
        row.append($('<td/>', {text: param.name, class: 'param_name'}));
        row.append($('<td/>', {class: 'param_value'}).append(param.values));
        $('#parameters').append(row);
    });
}

