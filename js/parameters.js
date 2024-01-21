function Value(id, name) {
    this.id = id;
    this.name = name;
}

function Param(id, name, values, notes) {
    this.id = id;
    this.name = name;
    this.values = values;
    this.notes = notes;
    this.values.attr('id', 'param_'+id);
    this.values.change(async function() {
        console.log('Parameter ' + id + ' changed to ' + $(this).val());
        const row = $('#row_'+id);
        row.addClass('disabled').find('select,input').prop('disabled', true);
        set_param(id, parseInt($(this).val()));
        await sleep(100);
        while(true) {
            read_param(id);
            await sleep(100);
            if (!is_waiting_for(id)) {
                break;
            }
        }
    })
}

function Slider(start, end, default_value) {
    let input = $('<input/>', {class: 'custom-range', type: 'range', tooltip: 'always', min: start, max: end, disabled: true});
    input[0].default_value = default_value;
    return input;
}

function Options(values, default_value, default_note) {
    let selector = $('<select/>', {class: 'custom-select', disabled: true});
    selector[0].default_value = default_value;
    let default_str = 'Default';
    if(default_note) { default_str += ' – ' + default_note}
    for(let i = 0; i < values.length; i++) {
        let value_str = values[i];
        if(i === default_value) { value_str += ' (' + default_str + ')' }
        selector.append($('<option/>', {value: i, text: value_str}));
    }
    return selector;
}

function Range(start, end) {
    return [...Array(end - start + 1).keys()].map(i => i + start);
}

let params = [
    new Param(0, 'Unit ID', Options(Range(0, 15), 0)),
    new Param(1, 'Tuning Scale', Options(Range(0, 31), 0, '12-TET')),
    new Param(2, 'Knob Mode', Options(['Snap', 'Pass-Thru', 'Relative'], 0), 'Actual default different to documented'),
    new Param(3, 'Note Priority', Options(['Low', 'High', 'Last Note'], 2)),
    new Param(4, 'Transmit Program Change', Options(['Off', 'On'], 0)),
    new Param(5, 'Receive Program Change', Options(['Off', 'On'], 1)),
    new Param(6, 'MIDI Input Ports',
        Options(['none', 'DIN only', 'USB only', 'Both DIN and USB'], 3)),
    new Param(7, 'MIDI Output Ports',
        Options(['none', 'DIN only', 'USB only', 'Both DIN and USB'], 3)),
    new Param(8, 'MIDI Echo USB In',
        Options(['Off', 'Echo USB In to DIN Out', 'Echo USB In to USB Out',
            'Echo USB In to Both DIN and USB Out'], 0)),
    new Param(9, 'MIDI Echo DIN In',
        Options(['Off', 'Echo DIN In to DIN Out', 'Echo DIN In to USB Out',
            'Echo DIN In to Both DIN and USB Out'], 0)),
    new Param(10, 'MIDI Channel In', Options(Range(1, 16).map(i => 'Channel ' + i), 0)),
    new Param(11, 'MIDI Channel Out', Options(Range(1, 16).map(i => 'Channel ' + i), 0)),
    new Param(12, 'MIDI Out Filter - Keys', Options(['Off', 'On'], 1)),
    new Param(13, 'MIDI Out Filter - Wheels', Options(['Off', 'On'], 1)),
    new Param(14, 'MIDI Out Filter - Panel', Options(['Off', 'On'], 1)),
    new Param(15, 'Output 14-bit MIDI CCs', Options(['Off', 'On'], 0)),
    new Param(16, 'Local Control: Keys', Options(['Off', 'On'], 1)),
    new Param(17, 'Local Control: Wheels', Options(['Off', 'On'], 1)),
    new Param(18, 'Local Control: Panel', Options(['Off', 'On'], 0), 'Actual default different to documented'),
    new Param(19, 'Local Control: Arp/Seq', Options(['Off', 'On'], 1)),
    new Param(20, 'Sequence Transpose Mode',
        Options(['Relative to First Note', 'Relative to Middle C'], 0)),
    new Param(21, 'Arp/Seq Keyed Timing Reset', Options(['Off', 'On'], 1), 'Actual default different to documented'),
    new Param(22, 'Arp FW/BW Repeats',
        Options(["Don't Repeat end notes", 'Repeat end notes'], 1)),
    new Param(23, 'Arp/Seq Swing', Slider(819, 15565, 8192)),
    new Param(24, 'Sequence Keyboard Control', Options(['Off', 'On'], 1)),
    new Param(25, 'Delay Sequence Change', Options(['Off', 'On'], 0)),
    new Param(26, 'Sequence Latch Restart', Options(['Off', 'On'], 1), 'Actual default different to documented'),
    new Param(27, 'Arp/Seq Clock Input Mode',
        Options(['Clock', 'Step-Advance Trigger'], 0)),
    new Param(28, 'Arp/Seq Clock Output',
        Options(['Always', 'Only When Playing'], 1)),
    new Param(29, 'Arp MIDI Output', Options(['Off', 'On'], 1)),
    new Param(30, 'Send MIDI Clock', Options(['Off', 'Only When Playing'], 0)),
    new Param(31, 'Send MIDI Start/Stop', Options(['Off', 'On'], 0)),
    new Param(32, 'Follow MIDI Clock', Options(['Off', 'On'], 1)),
    new Param(33, 'Follow MIDI Start/Stop', Options(['Off', 'On'], 1)),
    new Param(34, 'Follow Song Position Pointer', Options(['Off', 'On'], 1)),
    new Param(35, 'Clock Input PPQN Index',
        Options(["1 PPQN", "2 PPQN", "3 PPQN", "4 PPQN", "5 PPQN", "6 PPQN", "7 PPQN", "8 PPQN", "9 PPQN", "10 PPQN", "11 PPQN", "12 PPQN", "24 PPQN", "48 PPQN"], 3, 'sixteenth notes')),
    new Param(36, 'Clock Output PPQN Index',
        Options(["1 PPQN", "2 PPQN", "3 PPQN", "4 PPQN", "5 PPQN", "6 PPQN", "7 PPQN", "8 PPQN", "9 PPQN", "10 PPQN", "11 PPQN", "12 PPQN", "24 PPQN", "48 PPQN"], 3, 'sixteenth notes')),
    new Param(37, 'Pitch Bend Range (Semitones)',
        Options(Range(0, 12), 2)),
    new Param(38, 'Keyboard Octave Transpose',
        Options(['-2', '-1', '0', '1', '2'], 2, 'no transpose')),
    new Param(39, 'Delayed Keyboard Octave Transpose', Options(['Off', 'On'], 1)),
    new Param(40, 'Glide Type',
        Options(['Linear Constant Rate', 'Linear Constant Time', 'Exponential'], 0)),
    new Param(41, 'Gated Glide', Options(['Off', 'On'], 1)),
    new Param(42, 'Legato Glide', Options(['Off', 'On'], 0), 'Actual default different to documented'),
    new Param(43, 'Osc 2 Freq Knob Range',
        Options(Range(0, 24).map(i => i + ' Semitones'), 7)),
    new Param(44, 'Osc 3 Freq Knob Range',
        Options(Range(0, 24).map(i => i + ' Semitones'), 7)),
    new Param(45, 'Osc 4 Freq Knob Range',
        Options(Range(0, 24).map(i => i + ' Semitones'), 7)),
    new Param(46, 'Hard Sync Enable', Options(['Off', 'On'], 0)),
    new Param(47, 'Osc 2 Hard Sync', Options(['Off', 'On'], 0)),
    new Param(48, 'Osc 3 Hard Sync', Options(['Off', 'On'], 0)),
    new Param(49, 'Osc 4 Hard Sync', Options(['Off', 'On'], 0)),
    new Param(50, 'Delay Ping Pong', Options(['Off', 'On'], 0)),
    new Param(51, 'Delay Sync', Options(['Off', 'On'], 0)),
    new Param(52, 'Delay Filter Brightness', Options(['Dark', 'Bright'], 1)),
    new Param(53, 'Delay CV Sync-Bend', Options(['Off', 'On'], 0)),
    new Param(54, 'Tap-Tempo Clock Division Persistence', Options(['Off', 'On'], 0)),
    new Param(55, 'Paraphony Mode', Options(['Mono', 'Duo', 'Quad'], 2), 'Actual default different to documented'),
    new Param(56, 'Paraphonic Unison', Options(['Off', 'On'], 0)),
    new Param(57, 'Multi Trig', Options(['Off', 'On'], 0)),
    new Param(58, 'Pitch Variance',
        Options(Range(0, 400).map(i => '± ' + (i / 10) + ' cents'), 0)),
    new Param(59, 'KB CV OUT Range', Options(['-5V to +5V', '0V to +10V'], 0)),
    new Param(60, 'Arp/Seq CV OUT Range', Options(['-5V to +5V', '0V to +10V'], 0)),
    new Param(61, 'KB VEL OUT Range', Options(['0V to +5V', '0V to +10V'], 0)),
    new Param(62, 'Arp/Seq VEL OUT Range', Options(['0V to +5V', '0V to +10V'], 0)),
    new Param(63, 'KB AT OUT Range', Options(['0V to +5V', '0V to +10V'], 0)),
    new Param(64, 'MOD WHL OUT Range', Options(['0V to +5V', '0V to +10V'], 0)),
    new Param(65, 'KB GATE OUT Range', Options(['+5V', '+10V'], 0)),
    new Param(66, 'Arp/Seq GATE OUT Range', Options(['+5V', '+10V'], 0)),
    new Param(67, 'Round-Robin Mode',
        Options(['Off', 'First-Note Reset', 'On'], 1)),
    new Param(68, 'Restore Stolen Voices', Options(['Off', 'On'], 0)),
    new Param(69, 'Update Unison on Note-Off', Options(['Off', 'On'], 0)),
    new Param(70, 'Mod Oscillator Square Wave Polarity',
        Options(['Unipolar', 'Bipolar'], 1)),
    new Param(71, 'Noise Filter Cutoff', Slider(0, 16383, 0), 'Actual default different to documented'),
    new Param(72, 'Arp/Seq Random Repeats',
        Options(['no repeating notes/steps in RND direction',
            'allow repeating notes (true random)'], 1)),
    new Param(73, 'ARP/SEQ CV OUT Mirrors KB CV', Options(['Off', 'On'], 0)),
    new Param(74, 'KB CV OUT Mirrors ARP/SEQ CV', Options(['Off', 'On'], 0)),
    new Param(75, 'MIDI Velocity Curves', Options(['Base', 'Linear', 'Stretched', 'Compressed'], 0)),
];
