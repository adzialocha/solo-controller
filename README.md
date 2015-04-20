# solo-controller

[solo.andreasdzialocha.com](http://solo.andreasdzialocha.com)

![Solo](http://solo.andreasdzialocha.com/solo.jpg)

### About

[github.com/marmorkuchen-net/solo](https://github.com/marmorkuchen-net/solo)

Channel-Toggle Matrix Interface and editor for OSC (OpenSoundControl) based on [osc-js](https://github.com/marmorkuchen-net/osc-js) and [React](https://facebook.github.io/react/).

![Interface 1](https://andreasdzialocha-assets.s3-eu-west-1.amazonaws.com/0u9ajvoyg636usor_solo_interface_1.jpg)

![Interface 2](https://andreasdzialocha-assets.s3-eu-west-1.amazonaws.com/wk1yoozq5yfa8aor_solo_interface_2.jpg)

![Interface 3](https://andreasdzialocha-assets.s3-eu-west-1.amazonaws.com/sjbx7ckvjkyb9_solo_interface_3.jpg)

### Installation

You need a running python and node environment.

    git clone https://github.com/marmorkuchen-net/solo-controller
    cd channel-toggle-interface
    bower install
    python bridge.py

Open the browser (tested on google chrome) and go to `localhost:9000`. The application should also run on your smartphone or tablet device.

### OSC-Bridge

For OSC-communication with another audio software like `Ableton` you need a websocket-udp bridge. Check the `bridge.py` file, you will need a python environment, [autobahn](http://autobahn.ws/python/) based on twisted.

    python bridge.py
