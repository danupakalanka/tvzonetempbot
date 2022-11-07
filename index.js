
const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType,
	jidDecode
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const prefix = '.tvzone'
const owner = ['761327688']
const axios = require('axios')
const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})

	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('Bot Connected')
		}
	})

	conn.ev.on('creds.update', saveState)

	conn.ev.on('messages.upsert', async (mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return

			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid

			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId ? mek.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''


			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'

			const isMe = botNumber.includes(senderNumber)
			const isowner = owner.includes(senderNumber) || isMe

			const reply = (teks) => {
				conn.sendMessage(from, { text: teks }, { quoted: mek })
			}


			const isSUB = from == "120363043693753103@g.us" ? true : false

			switch (command) {

				//......................................................Commands..............................................................\\

				case '6-underground-2019':
				case '6underground2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: '🔍', key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/6_underground_2019" } },
					]
					const buttonMessage = {
						caption: "6 Underground | 2019 | 18+ | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/302d6b8a11c3c3af4f6a8.jpg" }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				case '12-strong-2018':
				case '12strong2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: '🔍', key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/12_strong" } },
					]
					const buttonMessage = {
						caption: "12 Strong | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/6a4f88ced256406791899.jpg" }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				case 'a-wrinkle-in-time-2018':
				case 'awrinkleintime2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: '🔍', key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/12_strong" } },
					]
					const buttonMessage = {
						caption: "A Wrinkle In Time | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/744d62178c740bea60133.jpg" }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break


				default:

					if (isowner && body.startsWith('>')) {
						try {
							await reply(util.format(await eval(`(async () => {${body.slice(1)}})()`)))
						} catch (e) {
							await reply(util.format(e))
						}
					}

			}

		} catch (e) {
			const isError = String(e)

			console.log(isError)
		}
	})
}

connectToWA()
