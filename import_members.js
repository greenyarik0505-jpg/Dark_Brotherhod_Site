// Скопируйте весь этот код и вставьте в консоль браузера (F12 -> Console) 
// на странице нового сайта ПОСЛЕ того как войдете в админку.
// Он моментально загрузит всех 30 участников в новую базу данных!

window.clubData.info.name = "Dark Brotherhood";
window.clubData.info.tag = "#809L8LRUL";
window.clubData.info.requiredTrophies = 60000;

window.clubData.members = [
  { "name": "Яросний хом'як", "role": "Президент", "trophies": 128762 },
  { "name": "денька 🖤 prime 💪", "role": "Вице-президент", "trophies": 112737 },
  { "name": "лакки ✌️ яйцами 💀", "role": "Вице-президент", "trophies": 102126 },
  { "name": "qvatro", "role": "Участник", "trophies": 95908 },
  { "name": "Mister Bisnes", "role": "Участник", "trophies": 93746 },
  { "name": "††JOKER††", "role": "Участник", "trophies": 84934 },
  { "name": "INVI Yarik0505", "role": "Участник", "trophies": 84500 },
  { "name": "привет пупс", "role": "Участник", "trophies": 83234 },
  { "name": "Mortyaga 67", "role": "Ветеран", "trophies": 75877 },
  { "name": "gg. | mondarin", "role": "Участник", "trophies": 71810 },
  { "name": "haz ❤️ hyra", "role": "Участник", "trophies": 71752 },
  { "name": "BabI kwas", "role": "Участник", "trophies": 70336 },
  { "name": "selderey", "role": "Участник", "trophies": 69290 },
  { "name": "@reider_ ®️™️", "role": "Вице-президент", "trophies": 68485 },
  { "name": "† | ᎪᎷ•TOXIC 々 ☥ ₹", "role": "Участник", "trophies": 66826 },
  { "name": "👾 ₩ •One Piece• ₩", "role": "Участник", "trophies": 66340 },
  { "name": "wQh | Rowoys157", "role": "Ветеран", "trophies": 65560 },
  { "name": "Born to | play 🥵", "role": "Участник", "trophies": 64027 },
  { "name": "⚡️ZERO⚡️", "role": "Участник", "trophies": 62234 },
  { "name": "FUT | Feliks", "role": "Участник", "trophies": 61551 },
  { "name": "суфіk 🌀🌪", "role": "Участник", "trophies": 59697 },
  { "name": "YT_MORTIS_SK", "role": "Участник", "trophies": 58806 },
  { "name": "Piskri", "role": "Ветеран", "trophies": 57116 },
  { "name": "‼️ Водолаз ‼️", "role": "Участник", "trophies": 55986 },
  { "name": "🪐 TH | MANS_KZ", "role": "Ветеран", "trophies": 55899 },
  { "name": "okyrok", "role": "Участник", "trophies": 55081 },
  { "name": "Artem", "role": "Участник", "trophies": 53617 },
  { "name": "MR. mi$tic.RUS", "role": "Участник", "trophies": 51481 },
  { "name": "🔥 FenoxRuss 🔥", "role": "Участник", "trophies": 48960 },
  { "name": "EQO | Official", "role": "Участник", "trophies": 43608 }
];

window.saveState();
setTimeout(() => {
    console.log("✅ УРА! Все 30 участников успешно импортированы!");
    window.location.reload();
}, 1000);
