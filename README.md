Sirius Chronometer
==================

This NodeJS app allows any mobile device with a HTML5 compliant web-browser to synchronise with MaxMSP. It has some built-in redundancy to allow it to continue running should the network drop out for some reason.

This is not a complete implementation as it had to be assembled quickly for a to facilitate performer cueing and synchronisation for the rehearsal and performance of Karlheinz Stockhausen's work, Sirius.

Architecture
------------

This app is built around a very simple client/server architecture consisting of the laptop as the *server* running the MaxMSP patch and Node and smartphones as *clients* on the same network running the time display in their browsers.

The **server**'s NodeJS script performs three important functions:

- It receives start, stop, sync and cueing OSC messages from MaxMSP and forwards them through live TCP sockets on the clients.

- In the event that a client becomes disconnected, it can forward missed cues.

- It serves the client software using Express.js.

The **client**'s functionality is as follows:

- It receives start, stop and sync messages and locks its internal clock to the playback in the Max patch.

- It displays the timecode and performance cues on the client's screen.

- If it receives a sync message after recovering from a crash or drop in connection and it's not currently in play mode, it will jump to the timecode point received and re-synchronise with the playback.


Message Structure
-----------------

The incoming messages are simple key-value pairs formatted as OSC lists. There are two main message types: *control* and *cue* messages.

For *control* messages the two simplest messages are:

```
start
stop
```

These are pretty self-explanatory. By default, they do not require values to be associated. However, it's important to note that a *start* message without a timecode value will start the chronometer from 00:00.00.

In order to start from a defined point, simply send append the time location in playback in form of milliseconds from the beginning. For example:

```
start 10000
```

This will start the chronometer at 00:10.00

The third type of message is the *sync* message. It is similar to the start message in except to be used while already in playback mode. Your Max patch should send this message at a regular interval such as every 2 seconds. So what would be sent out in a typical playback scenario could be as follows:

```
start 0
sync 2000
sync 4000
sync 6000
...
sync 1224000
sync 1226000
stop
```

**Notes:**

- For the best performance, I would not recommend using start and sync messages interchangeably. Also it makes debugging easier.

- While you can set the interval to be less frequent, remember that this will effectively determine the maximum recovery time of your client. So, if you set a sync interval of 20 seconds, for example, and the client has had re-opened after failure immediately after a sync message, it will take 20 seconds before the client is in sync again.

---------

The other type of message is a *cueing* message:

Their structure is relatively simple:

```
movement <movement name>
marker <marker number>
```

If a client connects during playback mode, the most recent cueing messages will be sent by the server.

Usage
-----
1. Make sure you have Node.js installed. You can download it from [nodejs.org](http://nodejs.org/download/ "Node.js").

2. Before running the system for the first time, make sure you've installed the dependencies by navigating to the project root directory in the terminal and running this shell command: `npm install`. You can skip this step on subsequent runs.

3. Start the Node.js server by running:
`node server.js`

4. Open your Max patch making sure that your udpsend object's settings match the UDP port number set in *config.js* and ip address of the machine it is running on. If it is running the same machine, use the local host ip address: 127.0.0.1

5. Connect the client devices to the same network as the server is running on.

6. In the devices' web browsers, type in the IP address of the computer that the *server* is running on, then a colon and TCP port set in *config.js*. So if the computer's IP address is 192.168.1.12 and the TCP port is 3000 for example, you would type into the clients' browsers:

`http://192.168.1.12:3000/`

From there you should be good to go.

General
-------

While you can use a laptops internal wi-fi card as the base station for the clients, just remember that in some venues the transmission power might not be sufficient to compete with existing RF traffic, work at a distance or through walls.

Although this system is designed to be robust, it is still best practice to use an external wi-fi access point for stronger transmission power. A wi-fi router will often suffice but you can use a commercial access point if needed, but setup is a bit more involved in that case.

This app will also work fine with any other OSC capable software. So you can easily make use of other environments such as Supercollider, Processing, Bidule or any software which allows you to send custom OSC messages.

I have included an example Max patch in order to test things.

I would love to know what folks end up doing with this. Be sure to let me know.

Happy performing!

License
-------

The MIT License (MIT)

Copyright (c) 2015 Kevan Atkins

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
