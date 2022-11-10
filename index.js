
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
const prefix = '.'
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


			const isSUB = from == config.SENDJID ? true : false

			switch (command) {

				case 'jid': try {
					if (!from) return
					reply(from)
				}
					catch (e) {
						await conn.sendMessage(from, { text: '*Error ⛔*' }, { quoted: mek })
					}

					break

				//......................................................Commands..............................................................\\

				case '6-underground-2019':
				case '6underground': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/6-underground-2019" } },
					]
					const buttonMessage = {
						caption: "6 Underground | 2019 | 18+ | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/302d6b8a11c3c3af4f6a8.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case '12-strong-2018':
				case '12strong': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/12-strong" } },
					]
					const buttonMessage = {
						caption: "12 Strong | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/6a4f88ced256406791899.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'a-wrinkle-in-time-2018':
				case 'awrinkleintime': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "A Wrinkle In Time | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/744d62178c740bea60133.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'after':
				case 'after-2019':
				case 'after-we-collided-2020':
				case 'after-we-fell-2021': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "After | 2019 - 2021 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/b6cda88245576ed4de6b3.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'alienvspredator':
				case 'alien-vs-predator-2004':
				case 'aliens-vs-predator-requiem-2007': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "Alien Vs Predator | 2004 - 2007 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/16f2128d40f113d20ef83.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'aliens-in-the-attic-2009':
				case 'aliensintheattic': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "Aliens In The Attic | 2009 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/26100348f501cf4bd0dd9.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'americanpie':
				case 'american-pie-1999':
				case 'american-pie-2001':
				case 'american-pie-the-wedding-2003':
				case 'american-pie-presents-band-camp-2005':
				case 'american-pie-presents-the-naked-mile-2006':
				case 'american-pie-presents-beta-house-2007':
				case 'american-pie-presents-the-book-of-love-2009':
				case 'american-pie-reunion-2012':
				case 'american-pie-presents-girls-rules-2020': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "American Pie | 1999 - 2020 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/30aae396e71242612a62a.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'angrybirds':
				case 'angry-birds-movie-2016':
				case 'angry-birds-movie-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "The Angry Birds Movie | 2016 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/91e92370b6f74cf791fb7.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'antman':
				case 'ant-man-and-the-wasp-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "Ant Man | 2015 - 2018 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/944952aedae0ecec48644.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'artemis-fowl-2020':
				case 'artemisfowl': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "Artemis Fowl | 2020 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/75e6e689b690bba8e25c5.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'assassinscreed':
				case 'assassins-creed-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "Assassin's Creed | 2016 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/d9a2296f9b757eadf5738.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'avengers':
				case 'the-avengers-2012':
				case 'avengers-age-of-ultron-2015':
				case 'avengers-infinity-war-2018':
				case 'avengers-endgame-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "Avengers | 2012 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/a665bfb05433429df887e.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
				}
					break

				case 'axl-2018':
				case 'axl': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: "https://tv.nadith.pro/a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "AXL | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: "https://telegra.ph/file/ef3472e27d1549c26dccc.jpg" }
					}
					await conn.sendMessage(config.GROUPJID, buttonMessage)
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
