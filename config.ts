

// --- 基础配置 ---
export const WECHAT_ID = "Polan_Music_AI"; // 在此处修改你的微信号
export const COST_PER_GENERATION = 1; // 每次生成消耗 1 次机会

// --- 定价策略 ---
export const PRICING_CONFIG = {
  // 9.9元 加油包
  basic: {
    id: 'pack_basic',
    name: '灵感加油包',
    price: '9.9',
    originalPrice: '29',
    credits: 20, // 20 Chances
    features: [
      '20 次灵感生成机会',
      '适合偶尔创作、毕业歌/生日歌定制',
      '支持复制高级 Suno/Udio Prompt'
    ]
  },
  // 69元 终身卡
  lifetime: {
    id: 'card_lifetime',
    name: '终身畅享卡',
    price: '69',
    originalPrice: '199',
    features: [
      '无限次生成机会',
      '终身使用权，无二次付费',
      '极速生成通道 (VIP Fast Lane)'
    ]
  }
};

// --- 联系人弹窗配置 ---
export const CONTACT_CONFIG = {
  title: '柏拉那音乐定制',
  subtitle: '人工精修 / 支付咨询 / 商务合作',
  pricePerSong: '199',
  verificationCode: '【定制】', // 加好友时的备注暗号
  items: [
    '需要 %PRICE%元/首 的人工精修定制服务？', // %PRICE% 会被自动替换
    '或者遇到支付问题？',
    '扫码添加好友，备注 %CODE%。' // %CODE% 会被自动替换
  ]
};

// --- 场景胶囊 (提示词模板) ---
export const SCENE_GROUPS = {
  // 第一组：生活与仪式感
  life: [
    { 
      id: 'bday', 
      label: '🎂 生日祝福', 
      template: '写一首生日歌，送给[我的朋友]，名字叫[安娜]，祝她[永远18岁]，风格要[欢快、R&B]...',
      color: 'hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600'
    },
    { 
      id: 'love', 
      label: '💌 专属情歌', 
      template: '写一首表白歌，送给[喜欢的女孩]，名字叫[...]，回忆了[第一次见面的海边]，风格要[浪漫 R&B、深情]...',
      color: 'hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600'
    },
    { 
      id: 'baby', 
      label: '👶 宝贝摇篮曲', 
      template: '写一首哄睡摇篮曲，送给宝宝[小糯米]，祝他[健康快乐]，风格要[轻柔、八音盒、童话感]...',
      color: 'hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600'
    },
    { 
      id: 'grad', 
      label: '🎓 毕业歌定制', 
      template: '写一首毕业歌，送给[三年二班]，包含关键词[操场、老柳树、不舍]，风格要[感人、民谣]...',
      color: 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
    }
  ],
  // 第二组：情感与创作
  creative: [
    { 
      id: 'miss', 
      label: '🕯️ 思念故人', 
      template: '写一首怀念[逝去的亲人/远方的朋友]的歌，名字叫[...]，意象包含[旧照片、雨天]，风格要[伤感、治愈、大提琴伴奏]...',
      color: 'hover:border-stone-300 hover:bg-stone-50 hover:text-stone-600'
    },
    { 
      id: 'worship', 
      label: '✝️ 团契敬拜', 
      template: '写一首团契敬拜赞美诗，主题是[在破碎中重建]，引用经文[诗篇23篇]，风格要[神圣、宏大、管弦乐]...',
      color: 'hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
    },
    { 
      id: 'anthem', 
      label: '🏢 团队战歌', 
      template: '写一首企业团队战歌，送给[创业团队]，核心口号是[因为相信所以看见]，风格要[激昂、摇滚、快节奏、强鼓点]...',
      color: 'hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600'
    },
    { 
      id: 'poem', 
      label: '📜 古诗新唱', 
      template: '将古诗[李商隐的锦瑟]改编成现代歌曲，保留[庄生晓梦]的意象，加入[现代叙事]，风格要[新国风、戏腔、电子国潮]...',
      color: 'hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600'
    },
    { 
      id: 'wuxia', 
      label: '⚔️ 快意江湖', 
      template: '写一首武侠风歌曲，描述[剑客的孤独]，关键词[烈酒、长剑、风沙]，风格要[中国风摇滚、燃、琵琶]...',
      color: 'hover:border-red-300 hover:bg-red-50 hover:text-red-700'
    },
    { 
      id: 'master', 
      label: '🎨 大师致敬', 
      template: '生成一首类似[Eleni Karaindrou]风格的音乐，乐器包含[手风琴、钢琴]，情绪是[忧伤、极简]...',
      color: 'hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600'
    }
  ]
};

// --- 灵感海报案例 (Featured Inspirations) ---
export const FEATURED_INSPIRATIONS = [
  { 
    id: '1', 
    lyrics: '风吹过老柳树的枝丫，\n吹不散三年二班的芳华。', 
    template: '写一首毕业歌，送给[三年二班]，意象包含[老柳树、试卷、黄昏]，风格要[感人、民谣、木吉他]...',
    fullLyrics: `[Verse 1]
六月的风有点烫 吹红了谁的眼眶
老柳树下斑驳的阳光 拉长了最后的散场
黑板上倒计时的粉笔字 擦不掉青春的疯狂
那张满分的试卷 此时却写不出离别的感伤

[Chorus]
风吹过老柳树的枝丫 吹不散三年二班的芳华
借我一张旧磁带 倒带回那个盛夏
再听一遍 上课铃声后的喧哗
说了再见 真的还会再见吗

[Bridge]
把校服签满名字 藏进褪色的行囊
未来的路很长 别忘了最初的梦想
且将新火试新茶 诗酒趁年华

[Outro]
轻轻地唱 轻轻地忘
三年二班 永远在心上`,
    sunoPrompt: "Acoustic Folk, sentimental, male vocals, wooden guitar, soft piano, nostalgic, bpm 85, warm production",
    tags: ['🎓 毕业季', 'Folk'], 
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '2', 
    lyrics: '我本是槐花院落闲散的人，\n满襟酒气，小池塘边跌坐看鱼。', 
    template: '写一首新国风歌曲，描述[闲散隐士]的生活，意象包含[槐花、酒、古琴]，风格要[清冷、古琴、现代节奏]...',
    fullLyrics: `[Verse 1]
长安的月色太拥挤 照不进这方寸之地
不如在槐花树下 换一壶陈年的快意
他们争名逐利 策马扬鞭去十里
我只愿 守着这半盏残茶听雨滴

[Chorus]
我本是槐花院落闲散的人
满襟酒气 小池塘边跌坐看鱼
不问江湖几多愁 只有清风知我意
抚琴一曲 惊起鸥鹭三两只

[Verse 2]
墨色晕染了宣纸 谁的江山在笔底
我笑那 功名利禄皆是戏
不如 醉卧花间 梦里不知身是客
醒来时 又是人间好时节

[Outro]
闲散的人 闲散的魂
一蓑烟雨 任平生`,
    sunoPrompt: "Modern Chinese Folk (Guofeng), Guqin solo, fusion, trip-hop beat, ethereal female vocals, atmospheric, zen, minimal",
    tags: ['📜 新国风', 'Guqin'], 
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    lyrics: '在破碎的器皿里，\n我看见了光的缝隙。', 
    template: '写一首关于[救赎与希望]的歌，主题是[破碎后的重建]，风格要[宏大、圣咏、管弦乐]...',
    fullLyrics: `[Verse 1]
世界在一瞬间崩塌 灰尘掩埋了鲜花
我站在废墟之上 听不见任何回答
这颗心布满裂痕 像被遗弃的流沙
在无尽的黑夜里 还有谁在等待天亮

[Chorus]
在破碎的器皿里 我看见了光的缝隙
那是你温柔的指引 穿透了厚重的绝壁
万物皆有裂痕 那是光照进来的契机
在绝望的尽头 爱是唯一的奇迹

[Bridge]
不要害怕跌倒 不要害怕哭泣
每一次破碎 都是为了更好地重聚
让暴风雨来得更猛烈些吧
洗净铅华 灵魂才更加美丽

[Outro]
光 照亮了光
破碎 亦是 完整`,
    sunoPrompt: "Cinematic Orchestral, Epic, Choir, Emotional, Uplifting, Hans Zimmer style, Building intensity, Ethereal vocals",
    tags: ['✝️ 灵性', 'Ethereal'], 
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '4', 
    lyrics: '霓虹雨淋湿了仿生人的梦，\n记忆是唯一的违禁品。', 
    template: '写一首赛博朋克风格的歌，描述[仿生人的觉醒]，关键词[霓虹、芯片、记忆]，风格要[Synthwave、电子合成器]...',
    fullLyrics: `[Verse 1]
代码编织的血管 冰冷且精密
第 9 区的霓虹雨 下个不停歇
我扫描着过往的路人 寻找熟悉的频率
系统提示错误 这是一个未知的逻辑

[Chorus]
霓虹雨淋湿了仿生人的梦
记忆是唯一的违禁品 藏在芯片的夹缝
我在数据的洪流中 试图抓住那一抹红
究竟是程序的bug 还是灵魂在悸动

[Verse 2]
剥开金属的外壳 看见跳动的脉搏
谁定义了生命 谁又定义了对错
为了那 0.01 秒的真实触碰
我愿 格式化所有 安全的平庸

[Outro]
Electric dreams...
Digital tears...
I am alive.`,
    sunoPrompt: "Cyberpunk, Synthwave, Retrowave, Analog Synthesizers, Vocoder, Dystopian, Melancholic, Neon Noir, Futuristic",
    tags: ['🤖 科幻', 'Synthwave'], 
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop' 
  },
];

// --- 通知中心数据 ---
// type: 'system' | 'promo' | 'tip'
// action: 'upgrade' | 'none'
export const NOTIFICATIONS_DATA = [
  {
    id: '1',
    type: 'system',
    title: '系统公告 | 致每一位创作者的信',
    content: '欢迎来到智音。我是主理人柏拉那。这里致力于用 AI 为音乐注入文学灵魂，让每个人都能写出打动人心的歌词。',
    unread: true,
    action: 'none'
  },
  {
    id: '2',
    type: 'promo',
    title: `限时活动 | 🎓 毕业季特惠：${PRICING_CONFIG.basic.price}元灵感包`, // 动态引用价格
    content: `一杯奶茶钱，搞定全班的毕业歌。永久有效，点击立即充值！`,
    unread: true,
    action: 'upgrade'
  },
  {
    id: '3',
    type: 'tip',
    title: '创作技巧 | Suno/Udio 提词秘籍',
    content: '如何让 AI 唱出感情？试试在 Prompt 里增加 [Sentimental] 标签，并描述具体的乐器独奏（如 Cello Solo）。',
    unread: false, 
    action: 'none'
  }
];