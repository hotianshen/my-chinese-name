// A gallery of fine names — drawn from the book's Chapter 16 ("Masterstrokes").
// Real, celebrated Chinese names taken by people from beyond China, each a
// miniature biography. Appraisals condensed; bilingual.
export interface FineName {
  hanzi: string
  pinyin: string
  person: string
  noteEn: string
  noteZh: string
  palaces: string // the palaces it most vividly embodies
}
export interface FineGroup {
  key: string
  titleEn: string
  titleZh: string
  names: FineName[]
}

export const GALLERY: FineGroup[] = [
  {
    key: 'pioneers', titleEn: 'Missionaries & Early Pioneers', titleZh: '传教士与先驱',
    names: [
      { hanzi: '利玛窦', pinyin: 'Lì Mǎdòu', person: 'Matteo Ricci', palaces: '音 · 脉',
        noteEn: 'The root text of all cross-cultural naming. “Li” catches the sound of Ricci while meaning advantage and smooth passage; his courtesy name 西泰 declares a Western serenity.',
        noteZh: '一切跨文化取名的根本。「利」既近 Ricci 之音，又自含「利、通达」之意；其字「西泰」更以一份西来之安然自况。' },
      { hanzi: '南怀仁', pinyin: 'Nán Huáirén', person: 'Ferdinand Verbiest', palaces: '意',
        noteEn: '“Nan” echoes his name; huairen means “holding humanity in the heart” — ren, the central virtue of Confucianism, chosen by a priest from the West.',
        noteZh: '「南」应其音；「怀仁」者，心怀仁德——以儒家至德为名，乃西来之士最优雅的文化相迎。' },
      { hanzi: '卫三畏', pinyin: 'Wèi Sānwèi', person: 'Samuel Wells Williams', palaces: '音 · 典',
        noteEn: '“Wei” echoes Williams; “the three reverences” comes straight from the Analects — to build Confucius’s teaching into one’s own name is quietly audacious.',
        noteZh: '「卫」应 Williams；「三畏」直出《论语》——将夫子之教筑入己名，是一种安静的胆识。' },
      { hanzi: '林乐知', pinyin: 'Lín Lèzhī', person: 'Young J. Allen', palaces: '意',
        noteEn: 'Perhaps the missionary group’s finest for sheer aptness: “taking delight in knowledge,” for a man who spent his life spreading new learning.',
        noteZh: '传教士中切意之最：「乐知」——为一生致力于传播新学之人，再贴切不过。' },
      { hanzi: '傅兰雅', pinyin: 'Fù Lányǎ', person: 'John Fryer', palaces: '象 · 愿',
        noteEn: '“Fu” catches Fryer’s opening; “orchid elegance” conjures the literati’s favourite flower — virtue suggested through imagery, never stated.',
        noteZh: '「傅」取 Fryer 之首音；「兰雅」唤起文人最爱之兰——德不直陈，而由意象生。' },
      { hanzi: '苏慧廉', pinyin: 'Sū Huìlián', person: 'W. E. Soothill', palaces: '音 · 意',
        noteEn: '“Su” catches Soothill’s opening and is a clean surname; huilian joins two virtues — wisdom and integrity — the skeleton of a lifetime scholar.',
        noteZh: '「苏」应 Soothill 之首音，亦是雅姓；「慧廉」合二德于一身——慧与廉，正是一生治学者之骨。' },
    ],
  },
  {
    key: 'sinologists', titleEn: 'Sinologists', titleZh: '汉学家',
    names: [
      { hanzi: '费正清', pinyin: 'Fèi Zhèngqīng', person: 'John King Fairbank', palaces: '音 · 意 · 愿',
        noteEn: 'Bestowed by the architect Liang Sicheng in 1930s Peking. “Fei” echoes Fair-; zhengqing echoes “King” while meaning “upright and clear” — a friend’s wish folded into a name.',
        noteZh: '一九三〇年代北平，梁思成所赠。「费」应 Fair-，「正清」既谐 King 之音，又寓「正而清」——一位中国友人的期许，叠入名中。' },
      { hanzi: '李约瑟', pinyin: 'Lǐ Yuēsè', person: 'Joseph Needham', palaces: '脉',
        noteEn: 'China’s most common surname paired with the standard rendering of “Joseph” — the two sit side by side without friction. By entering the Hundred Surnames, a Western name takes root.',
        noteZh: '以中国第一大姓，配「约瑟」之常译——二者并置而无扞格。入百家姓之列，西名遂真正扎根。' },
      { hanzi: '高罗佩', pinyin: 'Gāo Luópèi', person: 'Robert van Gulik', palaces: '音 · 愿',
        noteEn: 'A man who played the qin and composed Chinese verse. The tones rise and settle cleanly; proof that a phonetic transfer can itself be beautiful.',
        noteZh: '抚琴赋诗之人。其名声调起落清和——足证音译亦可成其为美。' },
      { hanzi: '史景迁', pinyin: 'Shǐ Jǐngqiān', person: 'Jonathan Spence', palaces: '音 · 象',
        noteEn: '“Shi” carries the S of Spence; the third-tone jing sits between, giving the name its movement — a scholar of history whose name itself reads like one.',
        noteZh: '「史」承 Spence 之 S；居中之上声「景」予名以动——一位史家，其名亦如史。' },
      { hanzi: '宇文所安', pinyin: 'Yǔwén Suǒ’ān', person: 'Stephen Owen', palaces: '脉 · 典',
        noteEn: 'The rare compound surname Yuwen lends classical depth; suo’an — “a place of ease” — gives the great Tang-poetry scholar a name of literati repose.',
        noteZh: '复姓「宇文」自带古意；「所安」者，安顿之地也——为唐诗大家添一份文人之静。' },
    ],
  },
  {
    key: 'statesmen', titleEn: 'Diplomats & Statesmen', titleZh: '外交家与政治家',
    names: [
      { hanzi: '司徒雷登', pinyin: 'Sītú Léidēng', person: 'Leighton Stuart', palaces: '脉 · 音',
        noteEn: 'The compound surname Situ — an ancient office — answers the “St-” of Stuart, giving an American educator a name of scholarly dignity.',
        noteZh: '复姓「司徒」本古官名，应 Stuart 之「St-」——予一位美国教育家以士人之尊。' },
      { hanzi: '陆克文', pinyin: 'Lù Kèwén', person: 'Kevin Rudd', palaces: '音 · 意',
        noteEn: '“Lu” echoes the Ru- of Rudd; kewen — “able in letters” — for a statesman fluent in Chinese, cultured and easy on the ear.',
        noteZh: '「陆」应 Rudd 之 Ru-；「克文」者，能文也——为一位通中文之政治家，文雅而顺耳。' },
    ],
  },
  {
    key: 'contemporary', titleEn: 'Contemporary Cultural Figures', titleZh: '当代文化人物',
    names: [
      { hanzi: '何伟', pinyin: 'Hé Wěi', person: 'Peter Hessler', palaces: '音 · 格',
        noteEn: '“He” answers the opening of Hessler; wei — great, with a lasting mark. Two characters, direct and strong, unmistakably his own.',
        noteZh: '「何」应 Hessler 之首音；「伟」者，大而有所立。二字直率刚健，自成一格。' },
    ],
  },
]
