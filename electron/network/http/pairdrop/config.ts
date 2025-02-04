/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-29 11:01:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-04-29 11:08:24
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import { spawn } from "child_process";
import fs from "fs";

// Evaluate arguments for deployment with Docker and Node.js
type CONFIG = {
  debugMode: boolean;
  port: any;
  wsFallback: boolean;
  rtcConfig: {
    sdpSemantics: string;
    iceServers: [
      {
        urls: string;
      },
    ];
  };
  signalingServer: any;
  ipv6Localize: any;
  rateLimit: any;
  buttons: any;
  autoStart: any;
  localhostOnly: any;
};
let conf: CONFIG = {
  debugMode: false,
  port: 3000,
  wsFallback: true,
  rtcConfig: {
    sdpSemantics: "unified-plan",
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  },
  signalingServer: false,
  ipv6Localize: false,
  rateLimit: false,
  buttons: {},
  autoStart: false,
  localhostOnly: false,
};

conf.debugMode = process.env.DEBUG_MODE === "true";

conf.port = process.env.PORT || 3000;

conf.wsFallback = process.argv.includes('--include-ws-fallback') || process.env.WS_FALLBACK === "true";

conf.rtcConfig = process.env.RTC_CONFIG && process.env.RTC_CONFIG !== "false"
    ? JSON.parse(fs.readFileSync(process.env.RTC_CONFIG, 'utf8'))
    : {
        "sdpSemantics": "unified-plan",
        "iceServers": [
            {
                "urls": "stun:stun.l.google.com:19302"
            }
        ]
    };


conf.signalingServer = process.env.SIGNALING_SERVER && process.env.SIGNALING_SERVER !== "false"
    ? process.env.SIGNALING_SERVER
    : false;

conf.ipv6Localize = parseInt(process.env.IPV6_LOCALIZE) || false;

let rateLimit: any = false;
if (process.argv.includes('--rate-limit') || process.env.RATE_LIMIT === "true") {
    rateLimit = 5;
}
else {
    let envRateLimit = parseInt(process.env.RATE_LIMIT);
    if (!isNaN(envRateLimit)) {
        rateLimit = envRateLimit;
    }
}
conf.rateLimit = rateLimit;

conf.buttons = {
    "donation_button": {
        "active": process.env.DONATION_BUTTON_ACTIVE,
        "link": process.env.DONATION_BUTTON_LINK,
        "title": process.env.DONATION_BUTTON_TITLE
    },
    "twitter_button": {
        "active": process.env.TWITTER_BUTTON_ACTIVE,
        "link": process.env.TWITTER_BUTTON_LINK,
        "title": process.env.TWITTER_BUTTON_TITLE
    },
    "mastodon_button": {
        "active": process.env.MASTODON_BUTTON_ACTIVE,
        "link": process.env.MASTODON_BUTTON_LINK,
        "title": process.env.MASTODON_BUTTON_TITLE
    },
    "bluesky_button": {
        "active": process.env.BLUESKY_BUTTON_ACTIVE,
        "link": process.env.BLUESKY_BUTTON_LINK,
        "title": process.env.BLUESKY_BUTTON_TITLE
    },
    "custom_button": {
        "active": process.env.CUSTOM_BUTTON_ACTIVE,
        "link": process.env.CUSTOM_BUTTON_LINK,
        "title": process.env.CUSTOM_BUTTON_TITLE
    },
    "privacypolicy_button": {
        "active": process.env.PRIVACYPOLICY_BUTTON_ACTIVE,
        "link": process.env.PRIVACYPOLICY_BUTTON_LINK,
        "title": process.env.PRIVACYPOLICY_BUTTON_TITLE
    }
};

// Evaluate arguments for deployment with Node.js only
conf.autoStart = process.argv.includes('--auto-restart');

conf.localhostOnly = process.argv.includes('--localhost-only');


// Validate configuration
if (conf.ipv6Localize) {
    if (!(0 < conf.ipv6Localize && conf.ipv6Localize < 8)) {
        console.error("ipv6Localize must be an integer between 1 and 7");
        process.exit(1);
    }

    console.log("IPv6 client IPs will be localized to",
        conf.ipv6Localize,
        conf.ipv6Localize === 1 ? "segment" : "segments");
}

if (conf.signalingServer) {
    const isValidUrl = /[a-z|0-9|\-._~:\/?#\[\]@!$&'()*+,;=]+$/.test(conf.signalingServer);
    const containsProtocol = /:\/\//.test(conf.signalingServer)
    const endsWithSlash = /\/$/.test(conf.signalingServer)
    if (!isValidUrl || containsProtocol) {
        console.error("SIGNALING_SERVER must be a valid url without the protocol prefix.\n" +
            "Examples of valid values: `pairdrop.net`, `pairdrop.example.com:3000`, `example.com/pairdrop`");
        process.exit(1);
    }

    if (!endsWithSlash) {
        conf.signalingServer += "/";
    }

    if (process.env.RTC_CONFIG || conf.wsFallback || conf.ipv6Localize) {
        console.error("SIGNALING_SERVER cannot be used alongside WS_FALLBACK, RTC_CONFIG or IPV6_LOCALIZE as these " +
            "configurations are specified by the signaling server.\n" +
            "To use this instance as the signaling server do not set SIGNALING_SERVER");
        process.exit(1);
    }
}

// Logs for debugging
if (conf.debugMode) {
    console.log("DEBUG_MODE is active. To protect privacy, do not use in production.");
    console.debug("\n");
    console.debug("----DEBUG ENVIRONMENT VARIABLES----")
    console.debug(JSON.stringify(conf, null, 4));
    console.debug("\n");
}

// Start a new PairDrop instance when an uncaught exception occurs
if (conf.autoStart) {
    process.on(
        'uncaughtException',
        () => {
            process.once(
                'exit',
                () => spawn(
                    process.argv.shift(),
                    process.argv,
                    {
                        cwd: process.cwd(),
                        detached: true,
                        stdio: 'inherit'
                    }
                )
            );
            process.exit();
        }
    );
}

export default conf;