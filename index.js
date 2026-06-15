const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot treo phòng Discord đang hoạt động ổn định 24/7!');
});

app.listen(PORT, () => {
    console.log(`Web server đang chạy trên port ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// ⚠️ THAY THẾ 2 DÒNG ID DƯỚI ĐÂY BẰNG ID CỦA BẠN
const GUILD_ID = '1506938436668625090'; 
const CHANNEL_ID = '1515071742475763864';

client.once('ready', () => {
    console.log(`Đã đăng nhập thành công dưới tên: ${client.user.tag}`);
    connectToVoice();
});

function connectToVoice() {
    try {
        joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: client.guilds.cache.get(GUILD_ID).voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false
        });
        console.log('Bot đã kết nối vào phòng thoại thành công!');
    } catch (error) {
        console.error('Lỗi khi kết nối vào phòng thoại:', error);
        setTimeout(connectToVoice, 10000);
    }
}

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log('Bot bị ngắt kết nối, đang tiến hành vào lại phòng...');
        setTimeout(connectToVoice, 5000);
    }
});

client.login(process.env.DISCORD_TOKEN);
