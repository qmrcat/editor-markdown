
// Mapa d'emojis més comuns
const emojiGroups = [
    {
        name: 'Expressions',
        items: {
            ':smile:': '😄',
            ':grinning:': '😀',
            ':joy:': '😂',
            ':laughing:': '😆',
            ':wink:': '😉',
            ':blush:': '😊',
            ':heart_eyes:': '😍',
            ':kissing_heart:': '😘',
            ':relaxed:': '☺️',
            ':satisfied:': '😌',
            ':grin:': '😁',
            ':stuck_out_tongue:': '😛',
            ':stuck_out_tongue_winking_eye:': '😜',
            ':disappointed:': '😞',
            ':worried:': '😟',
            ':angry:': '😠',
            ':rage:': '😡',
            ':cry:': '😢',
            ':sob:': '😭',
            ':fearful:': '😨',
            ':tired_face:': '😫',
        }
    },
    {
        name: 'Gestos i mans',
        items: {
            ':thumbsup:': '👍',
            ':thumbsdown:': '👎',
            ':ok_hand:': '👌',
            ':punch:': '👊',
            ':fist:': '✊',
            ':clap:': '👏',
            ':pray:': '🙏',
            ':point_up:': '☝️',
            ':point_down:': '👇',
            ':point_left:': '👈',
            ':point_right:': '👉',
            ':raised_hand:': '✋',
            ':muscle:': '💪',
            ':wave:': '👋',
        }
    },
    {
        name: 'Cors i símbols',
        items: {
            ':heart:': '❤️',
            ':broken_heart:': '💔',
            ':two_hearts:': '💕',
            ':sparkling_heart:': '💖',
            ':heartpulse:': '💗',
            ':blue_heart:': '💙',
            ':green_heart:': '💚',
            ':yellow_heart:': '💛',
            ':purple_heart:': '💜',
            ':star:': '⭐',
            ':star2:': '🌟',
            ':sparkles:': '✨',
            ':fire:': '🔥',
            ':boom:': '💥',
        }
    },
    {
        name: 'Advertències i símbol',
        items: {
            ':warning:': '⚠️',
            ':exclamation:': '❗',
            ':question:': '❓',
            ':grey_exclamation:': '❕',
            ':grey_question:': '❔',
            ':x:': '❌',
            ':heavy_check_mark:': '✅',
            ':white_check_mark:': '✅',
            ':o:': '⭕',
            ':no_entry:': '⛔',
            ':heavy_multiplication_x:': '✖️',
            ':heavy_plus_sign:': '➕',
            ':heavy_minus_sign:': '➖',
        }
    },
    {
        name: 'Tecnologia',
        items: {
            ':computer:': '💻',
            ':laptop:': '💻',
            ':phone:': '📱',
            ':iphone:': '📱',
            ':camera:': '📷',
            ':video_camera:': '📹',
            ':tv:': '📺',
            ':radio:': '📻',
            ':cd:': '💿',
            ':dvd:': '📀',
            ':floppy_disk:': '💾',
            ':minidisc:': '💽',
            ':electric_plug:': '🔌',
            ':battery:': '🔋',
        }
    },
    {
        name: 'Objectes i eines',
        items: {
            ':bulb:': '💡',
            ':gear:': '⚙️',
            ':wrench:': '🔧',
            ':hammer:': '🔨',
            ':nut_and_bolt:': '🔩',
            ':hocho:': '🔪',
            ':gun:': '🔫',
            ':bomb:': '💣',
            ':key:': '🔑',
            ':lock:': '🔒',
            ':unlock:': '🔓',
            ':bell:': '🔔',
            ':bookmark:': '🔖',
            ':link:': '🔗',
        }
    },
    {
        name: 'Transport',
        items: {
            ':car:': '🚗',
            ':taxi:': '🚕',
            ':bus:': '🚌',
            ':train:': '🚋',
            ':bike:': '🚴',
            ':airplane:': '✈️',
            ':rocket:': '🚀',
            ':ship:': '🚢',
            ':boat:': '⛵',
            ':anchor:': '⚓',
        }
    },
    {
        name: 'Natura',
        items: {
            ':sunny:': '☀️',
            ':cloud:': '☁️',
            ':umbrella:': '☔',
            ':snowflake:': '❄️',
            ':snowman:': '⛄',
            ':zap:': '⚡',
            ':cyclone:': '🌀',
            ':ocean:': '🌊',
            ':earth_americas:': '🌎',
            ':earth_africa:': '🌍',
            ':earth_asia:': '🌏',
            ':new_moon:': '🌑',
            ':full_moon:': '🌕',
            ':crescent_moon:': '🌙',
        }
    },
    {
        name: 'Animals',
        items: {
            ':dog:': '🐶',
            ':cat:': '🐱',
            ':mouse:': '🐭',
            ':hamster:': '🐹',
            ':rabbit:': '🐰',
            ':bear:': '🐻',
            ':panda_face:': '🐼',
            ':koala:': '🐨',
            ':tiger:': '🐯',
            ':lion_face:': '🦁',
            ':cow:': '🐮',
            ':pig:': '🐷',
            ':monkey_face:': '🐵',
            ':see_no_evil:': '🙈',
            ':hear_no_evil:': '🙉',
            ':speak_no_evil:': '🙊',
        }
    },
    {
        name: 'Menjar',
        items: {
            ':apple:': '🍎',
            ':banana:': '🍌',
            ':grapes:': '🍇',
            ':strawberry:': '🍓',
            ':cherry:': '🍒',
            ':peach:': '🍑',
            ':pizza:': '🍕',
            ':hamburger:': '🍔',
            ':fries:': '🍟',
            ':hotdog:': '🌭',
            ':beer:': '🍺',
            ':wine_glass:': '🍷',
            ':coffee:': '☕',
            ':tea:': '🍵',
            ':birthday:': '🎂',
            ':cake:': '🍰',
        }
    },
    {
        name: 'Activitats',
        items: {
            ':soccer:': '⚽',
            ':basketball:': '🏀',
            ':football:': '🏈',
            ':baseball:': '⚾',
            ':tennis:': '🎾',
            ':golf:': '⛳',
            ':trophy:': '🏆',
            ':medal:': '🏅',
            ':musical_note:': '🎵',
            ':notes:': '🎶',
            ':headphones:': '🎧',
            ':microphone:': '🎤',
            ':guitar:': '🎸',
            ':game_die:': '🎲',
            ':dart:': '🎯',
        }
    },
    {
        name: 'Temps i dates',
        items: {
            ':clock1:': '🕐',
            ':clock2:': '🕑',
            ':clock3:': '🕒',
            ':clock12:': '🕛',
            ':alarm_clock:': '⏰',
            ':hourglass:': '⌛',
            ':calendar:': '📅',
            ':date:': '📅',
        }
    },
    {
        name: 'Programació i GitHub',
        items: {
            ':bug:': '🐛',
            ':construction:': '🚧',
            ':memo:': '📝',
            ':pencil:': '✏️',
            ':pencil2:': '✏️',
            ':page_facing_up:': '📄',
            ':clipboard:': '📋',
            ':file_folder:': '📁',
            ':open_file_folder:': '📂',
            ':scissors:': '✂️',
            ':pushpin:': '📌',
            ':paperclip:': '📎',
            ':mag:': '🔍',
            ':mag_right:': '🔎',
        }
    }
];

function generateEmojiHtml(emojiGroups) {
    return `
        <div class="p-2">
            ${emojiGroups.map(group => `
                <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">${group.name}</div>
                <div class="grid grid-cols-8 gap-1 mb-3">
                    ${Object.entries(group.items).map(([code, emoji]) => `
                        <button onclick="insertText('${emoji}'); closeDropdown('emojiDropdown')" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg" title="${code}">${emoji}</button>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
}


// // Exemple d'ús per al dropdown amb shortcodes
// function showEmojiShortcodes() {
//     // Aquest és un exemple de com podries modificar el dropdown
//     // per inserir shortcodes en lloc d'emojis directes
//     const emojiHTML = `
//         ${createEmojiShortcodeButton('⚠️', ':warning:', 'Advertència')}
//         ${createEmojiShortcodeButton('💡', ':bulb:', 'Bombeta')}
//         ${createEmojiShortcodeButton('🔥', ':fire:', 'Foc')}
//         ${createEmojiShortcodeButton('🚀', ':rocket:', 'Coet')}
//         ${createEmojiShortcodeButton('🐛', ':bug:', 'Error')}
//         ${createEmojiShortcodeButton('✅', ':white_check_mark:', 'Marcat')}
//         ${createEmojiShortcodeButton('❌', ':x:', 'X')}
//         ${createEmojiShortcodeButton('❗', ':exclamation:', 'Exclamació')}
//     `;
//     return emojiHTML;
// }