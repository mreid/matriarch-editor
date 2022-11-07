# Moog Matriarch Global Settings Editor
A JavaScript MIDI SysEx editor for the Moog Matriarch.

The Moog Matriarch 
[v1.2.0 firmware release](https://api.moogmusic.com/sites/default/files/2020-09/Matriarch_V1.2.0_Firmware_Notes.pdf) 
added the ability to read and write global settings to the Matriarch via SysEx messages.
This application makes use of the [Jazz-Soft JZZ.js](https://jazz-soft.net/doc/) Web MIDI library to send and 
receive those SysEx messages in your browser. Add a little 
[jQuery](https://jquery.com) and [Bootstrap](https://getbootstrap.com) and we've got ourselves
an editor!

You can use the [editor here](https://mark.reid.name/matriarch-editor/index.html). 
You will need to configure some Web MIDI API extensions for Firefox and Safari. For Chrome you will need to
allow Chrome access to MIDI on your computer when the pop-up requests it. There are instructions in the
editor page itself.

This editor was written over a weekend by Mark Reid (who is **not** a web developer). 
It has only been tested on a Mac using Safari and Chrome.
It is released under a 
[Creative Commons Zero v1.0 Universal](https://github.com/mreid/matriarch-editor/blob/main/LICENSE) license,
so feel free to fork, extend, and improve it as you see fit.
 
