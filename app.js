
/**
 * 已测试人数配置
 *
 * initialCount：没有接入远程接口时显示的基础人数。
 * endpoint：留空时仅显示基础人数。
 *
 * 接口约定：
 * GET  -> { "count": 1286 }
 * POST -> { "count": 1287 }
 *
 * 同一浏览器只会在首次完成测试时 POST 一次。
 */
const TEST_COUNT_CONFIG = {
  initialCount: "999+",
  endpoint: ""
};

function formatTestCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count >= 0
    ? Math.round(count).toLocaleString("zh-CN")
    : TEST_COUNT_CONFIG.initialCount.toLocaleString("zh-CN");
}

function setTestCount(value) {
  const target = document.getElementById("testedCount");
  if (target) target.textContent = formatTestCount(value);
}

async function loadTestCount() {
  setTestCount(TEST_COUNT_CONFIG.initialCount);

  if (!TEST_COUNT_CONFIG.endpoint) return;

  try {
    const response = await fetch(TEST_COUNT_CONFIG.endpoint, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Counter GET failed: ${response.status}`);
    }

    const data = await response.json();
    if (Number.isFinite(Number(data.count))) {
      setTestCount(data.count);
    }
  } catch (error) {
    console.warn("测试人数接口读取失败，已使用基础人数。", error);
  }
}

async function registerCompletedTester() {
  if (!TEST_COUNT_CONFIG.endpoint) return;
  if (localStorage.getItem("coffeeTesterCounted") === "1") return;

  try {
    const response = await fetch(TEST_COUNT_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "increment" })
    });

    if (!response.ok) {
      throw new Error(`Counter POST failed: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("coffeeTesterCounted", "1");

    if (Number.isFinite(Number(data.count))) {
      setTestCount(data.count);
    }
  } catch (error) {
    console.warn("测试人数接口写入失败，本次未计入远程人数。", error);
  }
}

const DIMS = {
  novelty: { name: "新奇", short: "新奇" },
  ritual: { name: "仪式", short: "仪式" },
  precision: { name: "精研", short: "精研" },
  social: { name: "社交", short: "社交" },
  efficiency: { name: "效率", short: "效率" },
  aesthetic: { name: "审美", short: "审美" }
};

const TYPE_DATA = {
  frontier: {
    code: "TYPE 01",
    name: "豆单开荒队长",
    emoji: "🧭",
    slogan: "菜单越看不懂，你点得越坚定。",
    description: "你对“没喝过”三个字几乎没有抵抗力。别人点熟悉的，你专挑产区陌生、处理法可疑、风味描述像香水说明书的那一杯。你不是单纯爱喝咖啡，你是在用舌头做田野调查。",
    symptoms: "豆单从最后一页看起；季节限定必须试；喝完立刻查产区",
    coffee: "浅烘单品、特殊处理批次、季节限定豆",
    scene: "新店首发、产区主题杯测、旅行咖啡地图",
    ally: "手冲参数公务员",
    quote: "“熟悉的味道可以下次再喝，今天先让我冒个险。”",
    weights: { novelty: 1, precision: .5, social: .18, aesthetic: .35 },
    bonus: { explore: .05 }
  },
  ferment: {
    code: "TYPE 02",
    name: "发酵风味赌徒",
    emoji: "🎰",
    slogan: "别人怕翻车，你怕它不够疯。",
    description: "酒香、发酵、热带水果、乳酸感——这些词对你不是警告，是邀请。你接受一杯咖啡有可能封神，也有可能像隔夜水果罐头。稳定不重要，关键是它必须给你留下心理阴影或美好回忆。",
    symptoms: "看到厌氧就兴奋；容忍度极高；经常说“很怪，但再喝一口”",
    coffee: "厌氧、酒桶、特殊发酵与实验批次",
    scene: "盲测局、猎奇豆拼桌、深夜风味辩论",
    ally: "豆单开荒队长",
    quote: "“不好喝也没关系，至少它有点事情发生。”",
    weights: { novelty: 1, aesthetic: .6, social: .1, precision: .25 },
    bonus: { chaos: .12, ferment: .12 }
  },
  parameter: {
    code: "TYPE 03",
    name: "手冲参数公务员",
    emoji: "📐",
    slogan: "咖啡可以难喝，数据不能缺席。",
    description: "你面对一杯失控的咖啡，第一反应不是抱怨，而是建立排查表。水温、研磨、注水、流速、时间，每个变量都要留下口供。你追求的不是偶然好喝，而是可重复、可解释、可归档。",
    symptoms: "电子秤精确到小数点；参数写在备忘录；同一款豆连冲五次",
    coffee: "结构清晰的水洗豆、竞赛配方、可重复实验豆",
    scene: "参数对照实验、技术分享、家庭咖啡实验室",
    ally: "杯测语言艺术家",
    quote: "“感觉不可靠，先把研磨刻度告诉我。”",
    weights: { precision: 1, ritual: .7, efficiency: .25, novelty: .2 },
    bonus: { brew: .08 }
  },
  gear: {
    code: "TYPE 04",
    name: "器具型消费主义",
    emoji: "🛒",
    slogan: "买器具的速度，永远领先于冲煮技术。",
    description: "你相信下一件器具会让咖啡发生质变。新的滤杯、分享壶、手摇磨、布粉器陆续进入家门，并在某个周末之后成为精致摆设。你真正收藏的也许不是器具，而是“我马上会认真生活”的可能性。",
    symptoms: "购物车比豆单长；限定色无法拒绝；收纳本身成为新项目",
    coffee: "适合多器具比较的中浅烘豆",
    scene: "器具展、新品发布、朋友来家里参观",
    ally: "清晨仪式守门员",
    quote: "“不是我技术不行，是目前这套设备限制了我。”",
    weights: { aesthetic: 1, precision: .62, ritual: .35, novelty: .25 },
    bonus: { gear: .18 }
  },
  morning: {
    code: "TYPE 05",
    name: "清晨仪式守门员",
    emoji: "🌤️",
    slogan: "一天可以失控，第一杯不能。",
    description: "你需要用一套熟悉流程把自己从睡眠世界接回现实。杯子、音乐、光线和咖啡缺一不可。对你来说，咖啡不是效率工具，而是每天重新建立秩序的一小段私人领地。",
    symptoms: "固定杯子固定位置；冲煮时拒绝被打扰；旅行也要带熟悉器具",
    coffee: "平衡型手冲、柔和中烘焙、稳定日常豆",
    scene: "清晨独处、阅读写作、周末慢早餐",
    ally: "深烘安全区居民",
    quote: "“我不是起床气，我只是还没完成冲煮流程。”",
    weights: { ritual: 1, aesthetic: .65, efficiency: .18, precision: .25 },
    bonus: { ritual: .08 }
  },
  shareholder: {
    code: "TYPE 06",
    name: "冰美式续命股东",
    emoji: "⚡",
    slogan: "不是爱喝，是公司业务需要。",
    description: "你与咖啡的关系高度务实：它负责让你上线、开会、交付和活着下班。速溶、便利店、瑞幸 9.9 或大杯冰美式，只要稳定、方便、价格合适，都属于有效方案。你可能不研究庄园，但非常清楚哪种选择最快、最省事、最适合当下。",
    symptoms: "早上自动下单；空腹也敢喝；把大杯理解为风险对冲",
    coffee: "冰美式、冷萃、速溶、挂耳与高性价比连锁咖啡",
    scene: "通勤、会议前、截止日期附近",
    ally: "随缘冲煮哲学家",
    quote: "“风味轮先放一边，我下午三点还有会。”",
    weights: { efficiency: 1, ritual: .18, social: .08, precision: .12 },
    bonus: { dependency: .15, iced: .08 }
  },
  latte: {
    code: "TYPE 07",
    name: "拿铁气氛组组长",
    emoji: "🫶",
    slogan: "咖啡负责上镜，你负责让现场好看。",
    description: "你对咖啡的判断从来不只发生在舌头上。杯型、拉花、空间、光线和同行的人共同构成完整体验。你擅长发现生活中值得分享的片刻，也擅长把普通咖啡局组织得像品牌活动。",
    symptoms: "先拍照再喝；拉花完整度影响心情；知道所有适合约会的店",
    coffee: "拿铁、澳白、创意奶咖、季节特调",
    scene: "约会、闺蜜局、城市打卡、品牌快闪",
    ally: "咖啡局人脉中枢",
    quote: "“味道先别急，让我把这束光等到。”",
    weights: { social: .82, aesthetic: 1, ritual: .28, novelty: .18 },
    bonus: { milk: .12, photo: .08, atmosphere: .1, sweet: .05 }
  },
  networker: {
    code: "TYPE 08",
    name: "咖啡局人脉中枢",
    emoji: "🕸️",
    slogan: "咖啡只是开场，真正的产品是连接。",
    description: "你天然会把人聚到同一张桌子上。一包新豆可以成为活动理由，一家新店可以成为关系入口。你不一定是最懂参数的人，但通常是最知道“谁应该认识谁”的人。",
    symptoms: "随手拉群；新店开业先组局；能把杯测变成社交活动",
    coffee: "分享壶、拼配豆、适合多人体验的主题套装",
    scene: "社群活动、行业交流、跨圈聚会",
    ally: "拿铁气氛组组长",
    quote: "“这杯先放着，我介绍两个人给你认识。”",
    weights: { social: 1, novelty: .5, aesthetic: .3, ritual: .1 },
    bonus: { share: .16 }
  },
  safezone: {
    code: "TYPE 09",
    name: "深烘安全区居民",
    emoji: "🛋️",
    slogan: "拒绝酸味，拒绝惊喜，拒绝被教育。",
    description: "你知道自己喜欢什么，也不打算为了流行趋势反复解释。坚果、巧克力、焦糖、醇厚感，是你稳定的精神物业。别人说它不够复杂，你只关心这杯是不是舒服、可靠、能长期续租。",
    symptoms: "看到莓果先警惕；偏爱熟悉拼配；不愿为“明亮酸质”承担风险",
    coffee: "中深烘拼配、坚果巧克力调、美式与奶咖",
    scene: "日常早餐、熟悉门店、长期口粮豆",
    ally: "清晨仪式守门员",
    quote: "“我不是保守，我只是已经找到了正确答案。”",
    weights: { efficiency: .72, ritual: .72, aesthetic: .18, novelty: -.12 },
    bonus: { dark: .16 }
  },
  story: {
    code: "TYPE 10",
    name: "产区故事易感人群",
    emoji: "📖",
    slogan: "豆子还没入口，故事已经回甘。",
    description: "你很容易被海拔、庄园、采摘季和生产者故事打动。对你而言，一杯咖啡的价值不仅是风味，也是人与土地的叙事。危险在于：当包装文案足够真诚，你的预算会迅速失去防御能力。",
    symptoms: "读包装比喝咖啡久；记得庄园主名字；愿意为可追溯多付一点",
    coffee: "单一庄园、微批次、产地合作与可追溯咖啡",
    scene: "产区分享会、烘焙师对谈、溯源项目",
    ally: "豆单开荒队长",
    quote: "“我承认它不便宜，但你先听完这个庄园的故事。”",
    weights: { aesthetic: .85, novelty: .6, ritual: .28, social: .25 },
    bonus: { story: .18 }
  },
  language: {
    code: "TYPE 11",
    name: "杯测语言艺术家",
    emoji: "🗣️",
    slogan: "别人说酸，你能写出一段气候报告。",
    description: "你擅长把模糊感受拆成具体语言：不是简单的甜，而是某种成熟水果、冷却后的蜂蜜感和尾段香料气息。你的表达能力让咖啡更容易被理解，偶尔也让同桌的人开始怀疑自己的味觉。",
    symptoms: "风味描述自动成句；冷却后必须再喝；经常替别人解释“这不是酸”",
    coffee: "层次明显的水洗豆、杯测套装、风味对照组",
    scene: "杯测、内容创作、产品评审、朋友教学",
    ally: "手冲参数公务员",
    quote: "“先别下结论，它降到四十五度以后才开始说真话。”",
    weights: { precision: .82, aesthetic: .78, social: .34, novelty: .25 },
    bonus: { describe: .15 }
  },
  casual: {
    code: "TYPE 12",
    name: "随缘冲煮哲学家",
    emoji: "🌀",
    slogan: "粉水比随缘，心态必须稳定。",
    description: "你接受咖啡像生活一样存在波动。没有秤就目测，没有器具就喝速溶、挂耳或连锁咖啡。你不追求专业术语和完美复刻，只关心这一杯是否方便、顺口、适合当前场景。",
    symptoms: "参数大概记得；器具能少一个是一个；难喝就加冰加奶解决",
    coffee: "宽容度高的拼配、冷萃、浸泡式咖啡",
    scene: "露营、办公室、临时来客、懒人周末",
    ally: "冰美式续命股东",
    quote: "“咖啡会原谅我的，反正我也原谅了今天。”",
    weights: { efficiency: .68, ritual: .3, social: .18, precision: -.15, novelty: .22 },
    bonus: { casual: .15, describeSimple: .08 }
  }
};


const TYPE_PROFILES = {
  frontier:    { novelty: 92, ritual: 30, precision: 58, social: 38, efficiency: 32, aesthetic: 52 },
  ferment:     { novelty: 100, ritual: 20, precision: 34, social: 38, efficiency: 20, aesthetic: 72 },
  parameter:   { novelty: 38, ritual: 68, precision: 100, social: 28, efficiency: 52, aesthetic: 42 },
  gear:        { novelty: 44, ritual: 55, precision: 72, social: 30, efficiency: 30, aesthetic: 100 },
  morning:     { novelty: 28, ritual: 100, precision: 45, social: 24, efficiency: 48, aesthetic: 76 },
  shareholder: { novelty: 22, ritual: 28, precision: 25, social: 24, efficiency: 100, aesthetic: 22 },
  latte:       { novelty: 36, ritual: 54, precision: 34, social: 84, efficiency: 42, aesthetic: 100 },
  networker:   { novelty: 58, ritual: 32, precision: 28, social: 100, efficiency: 48, aesthetic: 56 },
  safezone:    { novelty: 12, ritual: 76, precision: 34, social: 28, efficiency: 86, aesthetic: 36 },
  story:       { novelty: 74, ritual: 54, precision: 44, social: 42, efficiency: 34, aesthetic: 96 },
  language:    { novelty: 54, ritual: 48, precision: 92, social: 54, efficiency: 32, aesthetic: 84 },
  casual:      { novelty: 42, ritual: 40, precision: 12, social: 38, efficiency: 86, aesthetic: 28 }
};

const HIDDEN_TYPES = {
  undercover: {
    code: "HIDDEN 01",
    name: "白开水卧底",
    emoji: "🥛",
    slogan: "你可能不爱咖啡，你爱的是咖啡周边的人类生活。",
    description: "研究所发现，你对咖啡本体的执念相当有限，但对空间、社交、甜点、杯子或“手里拿点什么”的需求十分真实。没有关系，咖啡文化本来就不只属于味觉专家。你是潜伏成功的氛围参与者。",
    symptoms: "咖啡经常喝不完；甜点记得比豆子清楚；约咖啡主要为了见人",
    coffee: "低因、燕麦奶饮、茶咖特调、甚至一杯水",
    scene: "朋友聚会、空间体验、轻松社群活动",
    ally: "拿铁气氛组组长",
    quote: "“我不是来喝咖啡的，但没有咖啡局我也不会来。”"
  },
  milkspy: {
    code: "HIDDEN 02",
    name: "奶咖伪装大师",
    emoji: "🥸",
    slogan: "嘴上研究风味，身体诚实地寻找牛奶。",
    description: "你愿意讨论产区、萃取和酸甜平衡，但最终让你安心的，往往还是奶泡、甜感与顺滑口感。你不是不专业，只是比起证明自己能喝酸，你更尊重身体的真实投票。",
    symptoms: "先问豆子再点拿铁；遇到浅烘会本能找奶；拉花不好看会失望",
    coffee: "澳白、馥芮白、燕麦拿铁、风味型奶咖",
    scene: "精品奶咖地图、拉花活动、周末慢聊",
    ally: "杯测语言艺术家",
    quote: "“我当然喝得懂单品，但今天先来一杯澳白。”"
  },
  warehouse: {
    code: "HIDDEN 03",
    name: "器具仓库管理员",
    emoji: "📦",
    slogan: "设备已经职业化，使用频率仍然业余。",
    description: "你的器具配置足以支撑一家小型工作室，但实际冲煮频率与采购速度存在明显倒挂。研究所建议暂停观看新品发布视频，并优先确认家里是否还有未拆封滤纸。",
    symptoms: "同类滤杯超过三个；包装盒舍不得扔；经常忘记器具放在哪里",
    coffee: "任何能让现有器具重新就业的豆子",
    scene: "家庭库存盘点、二手交换、器具断舍离",
    ally: "手冲参数公务员",
    quote: "“这不是重复购买，它们的肋骨结构完全不同。”"
  },
  perpetual: {
    code: "HIDDEN 04",
    name: "空腹冰美式永动机",
    emoji: "🚨",
    slogan: "你的工作流正在由咖啡因单点支撑。",
    description: "你的答案显示，咖啡已经从饮品升级为基础设施。你习惯用下一杯修复上一杯带来的疲惫，并把空腹、心跳和睡眠问题解释成项目周期。娱乐测试不能替代健康建议：身体不舒服时，请停止硬撑并咨询专业人士。",
    symptoms: "醒来先找咖啡；下午继续加码；明知影响睡眠仍然下单",
    coffee: "先喝水、吃东西，再考虑低因或小杯咖啡",
    scene: "正常早餐、规律休息、减少连续摄入",
    ally: "清晨仪式守门员",
    quote: "“真正的效率，不是把身体当作一次性滤纸。”"
  },
  immune: {
    code: "HIDDEN 05",
    name: "咖啡因绝缘体",
    emoji: "🛡️",
    slogan: "别人计算饮用时间，你只计算下一杯喝什么。",
    description:
      "从你的回答看，你主观上很少因为时间而调整咖啡选择。下午喝、晚上喝，甚至临睡前喝，你依然保持一种令人费解的从容。你喝咖啡不完全为了续命，也可能只是单纯想喝。本结果只描述你的自我感受，不代表医学上的咖啡因耐受判断。",
    symptoms:
      "晚上喝咖啡仍自觉能正常睡；很少主动寻找低因；点咖啡通常不考虑时间",
    coffee:
      "按口味选择即可；晚间想喝时也可尝试低因咖啡，把重点放在风味而不是摄入量",
    scene:
      "晚间咖啡局、餐后咖啡、深夜聊天",
    ally:
      "随缘冲煮哲学家",
    quote:
      "“几点喝有什么区别，反正我自觉都睡得着。”"
  }
};

function answer(text, scores = {}, flags = {}) {
  return { text, scores, flags };
}

const QUESTIONS = [
  {
    category: "日常症状观察",
    text: "你与第一杯咖啡的关系最接近：",
    answers: [
      answer("救命恩人，先喝再讨论人格尊严", { efficiency: 4 }, { dependency: 2, iced: 1 }),
      answer("早起一杯咖啡，流程不能被打断", { ritual: 4, aesthetic: 1 }, { ritual: 1 }),
      answer("顺便试试昨天刚到的新豆", { novelty: 4, precision: 1 }, { explore: 1 }),
      answer("看当天和谁见面，再决定去哪里喝", { social: 4, aesthetic: 1 }, { share: 1 }),
      answer("速溶或9块9", { efficiency: 5 }, { beginner: 2, instant: 2, budget: 2, chain: 1, dependency: 1 })
    ]
  },
  {
    category: "菜单行为取证",
    text: "面对一张写满陌生产区的豆单，你会：",
    answers: [
      answer("越陌生越兴奋，直接点名字最难念的", { novelty: 4, aesthetic: 1 }, { explore: 1 }),
      answer("先问处理法、烘焙度和推荐参数", { precision: 4, novelty: 1 }, { brew: 1 }),
      answer("寻找熟悉的坚果、巧克力、焦糖", { efficiency: 3, ritual: 2 }, { dark: 2 }),
      answer("把决定权交给同行的人，我负责聊天", { social: 4 }, { share: 1, avoidCoffee: 1 }),
      answer("我只分得清拿铁和美式", { ritual: 2, efficiency: 3 }, { beginner: 2, chain: 1, milk: 1 })
    ]
  },
  {
    category: "风味风险评估",
    text: "菜单写着“强烈发酵、酒香、榴莲与热带水果”，你的反应是：",
    answers: [
      answer("听起来像事故现场，必须亲自确认", { novelty: 5 }, { chaos: 2, ferment: 2 }),
      answer("先问它的发酵过程是否可控", { precision: 4, novelty: 1 }, { ferment: 1 }),
      answer("礼貌后退，我只想喝一杯正常咖啡", { efficiency: 3, ritual: 2 }, { dark: 1 }),
      answer("适合四个人点一杯，大家轮流承担风险", { social: 4, novelty: 1 }, { share: 1, chaos: 1 }),
      answer("有奶咖好喝吗", { efficiency: 4, aesthetic: 1 }, { beginner: 2, budget: 1, chain: 2, milk: 1 })
    ]
  },
  {
    category: "咖啡翻车处理",
    text: "手里的咖啡不好喝时，你通常会：",
    answers: [
      answer("调整研磨、水温和注水，逐项排查原因", { precision: 5 }, { brew: 2 }),
      answer("加冰加奶，问题转化为解决方案", { efficiency: 4, social: 1 }, { casual: 1, milk: 1 }),
      answer("换一套器具，问题一定在硬件", { aesthetic: 3, precision: 2 }, { gear: 2 }),
      answer("从不手冲，下次直接换一家或换一款", { efficiency: 4, novelty: 1 }, { shopOnly: 2, casual: 1 })
    ]
  },
  {
    category: "消费冲动扫描",
    text: "看到新款限量配色滤杯，你最可能：",
    answers: [
      answer("研究结构差异，确认它不是只换颜色", { precision: 3, aesthetic: 2 }, { gear: 1 }),
      answer("颜色已经说明了一切，先买再研究", { aesthetic: 5 }, { gear: 2, photo: 1 }),
      answer("家里那个还能用，不制造新问题", { efficiency: 5 }, { casual: 1 }),
      answer("发群里问有没有人一起拼单", { social: 4, aesthetic: 1 }, { share: 1, gear: 1 }),
      answer("我连滤杯是什么都不太清楚，也不打算为了器具增加消费", { efficiency: 5 }, { beginner: 2, noBeanKnowledge: 2, budget: 1 }
)
    ]
  },
  {
    category: "空间偏好扫描",
    text: "哪一种咖啡店最容易让你待很久？",
    answers: [
      answer("安静、木质、光线刚好，像私人结界", { ritual: 4, aesthetic: 3 }, { ritual: 1 }),
      answer("开放吧台，可以看清每一步操作", { precision: 4, aesthetic: 1 }, { brew: 1 }),
      answer("长桌很多，随时可能认识新朋友", { social: 5 }, { share: 2 }),
      answer("出杯快、插座多、位置好找", { efficiency: 5 }, { dependency: 1 }),
      answer("有9块9券、离得近、拿了就走的店", { efficiency: 5 }, { budget: 2, chain: 2, beginner: 1 })
    ]
  },
  {
    category: "社交传播观察",
    text: "喝到一杯很喜欢的咖啡，你第一反应是：",
    answers: [
      answer("记录风味和参数，争取复刻", { precision: 4, ritual: 1 }, { describe: 1, brew: 1 }),
      answer("发给朋友，马上组一个局", { social: 5 }, { share: 2 }),
      answer("查这个庄园和产区还有什么豆", { novelty: 4, aesthetic: 1 }, { story: 1, explore: 1 }),
      answer("记住店名，下次继续点同一杯", { ritual: 3, efficiency: 2 }, { ritual: 1 }),
    ]
  },
  {
    category: "拍摄行为取证",
    text: "咖啡端上来时拉花非常完整，你会：",
    answers: [
      answer("先找光、调角度、拍完再喝", { aesthetic: 4, social: 2 }, { photo: 2, share: 1, milk: 1 }),
      answer("看两秒，然后观察入口温度", { precision: 4, ritual: 1 }, { describe: 1 }),
      answer("直接喝，拉花的半衰期与我无关", { efficiency: 5 }, { casual: 1 }),
      answer("把杯子推给朋友，让他先拍", { social: 4, aesthetic: 1 }, { share: 1, milk: 1 }),
      answer("我平时喝外带连锁咖啡，基本遇不到完整拉花", { efficiency: 4, aesthetic: 1 }, { beginner: 2, chain: 2, budget: 1 })
    ]
  },
  {
    category: "故事易感测试",
    text: "一包豆子附带庄园主故事和完整溯源信息，你会：",
    answers: [
      answer("认真读完，味道之前先理解它从哪里来", { aesthetic: 4, novelty: 2 }, { story: 2 }),
      answer("先看关键信息：品种、处理法、烘焙日期", { precision: 4, efficiency: 1 }, { story: 1 }),
      answer("故事很好，但先告诉我每杯成本", { efficiency: 5 }, {}),
      answer("适合拿去做一次产区主题分享会", { social: 4, aesthetic: 2 }, { story: 1, share: 2 }),
      answer("故事先不看，我主要看有没有优惠、到手多少钱", { efficiency: 5 }, { budget: 2, beginner: 1 }),
      answer("我还没买过咖啡豆，这些信息对我暂时有点陌生", { efficiency: 3, novelty: 1 }, { beginner: 3, noBeanKnowledge: 2 })
    ]
  },
  {
    category: "奶咖诚实度检测",
    text: "朋友点了极浅烘单品，你喝一口觉得太酸，你会：",
    answers: [
      answer("继续喝，等温度下降后再判断", { precision: 4, ritual: 1 }, { describe: 1 }),
      answer("承认不喜欢，转身点一杯澳白或拿铁", { efficiency: 3, aesthetic: 2 }, { milk: 2 }),
      answer("研究这种酸来自品种还是萃取", { precision: 4, novelty: 1 }, { brew: 1 }),
      answer("说‘很有个性’，然后悄悄加水", { social: 3, efficiency: 2 }, { avoidCoffee: 1, casual: 1 }),
      answer("我平时喝加糖奶咖，酸不酸其实分不太清", { aesthetic: 2, efficiency: 3 }, { beginner: 2, milk: 2, sweet: 1, chain: 1 })
    ]
  },
  {
    category: "时间管理审计",
    text: "你只有五分钟出门，咖啡怎么处理？",
    answers: [
      answer("胶囊、浓缩或便利店，效率优先", { efficiency: 5 }, { dependency: 1 }),
      answer("宁可晚一点，也要完成固定冲煮流程", { ritual: 5 }, { ritual: 2 }),
      answer("带上器具去公司继续完成实验", { precision: 4, ritual: 1 }, { gear: 1, brew: 1 }),
      answer("不喝了，到目的地和别人一起点", { social: 4 }, { avoidCoffee: 1, share: 1 }),
      answer("撕一条速溶，热水一冲，三分钟内解决", { efficiency: 6 }, { beginner: 2, instant: 3, dependency: 1 }),
    ]
  },
  {
    category: "语言系统检测",
    text: "别人问你“这杯什么味道”，你更可能说：",
    answers: [
      answer("像冷却后的黄桃、蜂蜜和一点白花", { precision: 4, aesthetic: 2 }, { describe: 2 }),
      answer("挺顺，今天喝着舒服", { ritual: 2, efficiency: 3 }, { casual: 1 }),
      answer("很怪，像水果店在开派对", { novelty: 4, social: 1 }, { chaos: 1, ferment: 1 }),
      answer("你自己喝一口，我们可以聊半小时", { social: 5 }, { share: 1, describe: 1 }),
      answer("我只会说苦不苦、甜不甜、顺不顺口", { efficiency: 3, ritual: 1 }, { beginner: 3, describeSimple: 2 })
    ]
  },
  {
    category: "库存风险评估",
    text: "打开咖啡柜，你最可能看到：",
    answers: [
      answer("三种滤杯、两把壶和一个忘记买来干嘛的工具", { aesthetic: 3, precision: 2 }, { gear: 3 }),
      answer("固定口粮豆、固定杯子，一切秩序井然", { ritual: 4, efficiency: 1 }, { ritual: 1 }),
      answer("好几包不同产区的豆子同时排队", { novelty: 5 }, { explore: 2 }),
      answer("咖啡不多，但杯子、托盘和拍照道具不少", { aesthetic: 5 }, { photo: 2, avoidCoffee: 1 }),
      answer("速溶条、三合一和办公室马克杯", { efficiency: 5, ritual: 1 }, { beginner: 2, instant: 3, sweet: 1 }),
      answer("连锁咖啡优惠券截图，比咖啡器具多", { efficiency: 5 }, { beginner: 1, budget: 2, chain: 3 })
    ]
  },
  {
    category: "活动偏好扫描",
    text: "只能参加一种咖啡活动，你会选：",
    answers: [
      answer("同一款豆的参数对照实验", { precision: 5 }, { brew: 2 }),
      answer("陌生产区与特殊处理法盲测", { novelty: 5 }, { explore: 1, chaos: 1 }),
      answer("城市咖啡社群大型拼桌", { social: 5 }, { share: 2 }),
      answer("安静的晨间手冲与阅读", { ritual: 4, aesthetic: 2 }, { ritual: 1 })
    ]
  },
  {
    category: "价格防御测试",
    text: "一杯咖啡比你的日常预算贵一倍，什么最可能说服你？",
    answers: [
      answer("它真的罕见，而且我从没喝过", { novelty: 5 }, { explore: 1 }),
      answer("产地合作透明，生产者获得合理回报", { aesthetic: 4, social: 1 }, { story: 2 }),
      answer("使用了极其复杂且可验证的制作方案", { precision: 5 }, { brew: 1 }),
      answer("说服不了，我会计算每毫升价格", { efficiency: 5 }, {}),
      answer("第二杯半价", { efficiency: 6 }, { beginner: 1, budget: 3, chain: 1 }),
      answer("咖啡馆的设计、氛围或景观足够漂亮，坐在那里本身就值得", { aesthetic: 5, social: 1 }, { photo: 1, atmosphere: 2 })
    ]
  },
  {
    category: "办公室现场记录",
    text: "办公室有人说“要喝咖啡，有没有人一起”，你会：",
    answers: [
      answer("立刻报出固定订单", { efficiency: 5 }, { dependency: 1 }),
      answer("问大家要不要试我新买的豆", { novelty: 3, social: 3 }, { share: 2, explore: 1 }),
      answer("主动接管冲煮，避免参数失控", { precision: 5 }, { brew: 2 }),
      answer("我不一定喝，但会跟着一起去", { social: 4 }, { avoidCoffee: 2, share: 1 }),
      answer("公司有速溶就喝速溶，不额外花时间", { efficiency: 6 }, { beginner: 2, instant: 3 }),
      answer("我有 9.9 元券帮我顺便带一杯", { social: 2, efficiency: 4 }, { beginner: 1, budget: 2, chain: 2, share: 1 })
    ]
  },
  {
    category: "深烘态度采样",
    text: "有人说“深烘不够高级”，你的真实想法是：",
    answers: [
      answer("高级不高级不重要，好喝舒服就行", { efficiency: 3, ritual: 3 }, { dark: 2 }),
      answer("不同烘焙有不同目标，不必站队", { precision: 4, novelty: 1 }, { describe: 1 }),
      answer("我还是想知道它能不能更明亮一点", { novelty: 4 }, { explore: 1 }),
      answer("先别争，做个深浅烘对饮活动", { social: 5 }, { share: 2 }),
      answer("我其实不知道深烘浅烘，只知道自己怕酸、喜欢不太苦", { ritual: 2, efficiency: 3 }, { beginner: 3, dark: 1, describeSimple: 1 })
    ]
  },
  {
    category: "旅行生存测试",
    text: "旅行时想喝咖啡，你会：",
    answers: [
      answer("自带磨豆机、滤杯和豆子", { ritual: 3, precision: 3 }, { gear: 2, brew: 1 }),
      answer("当地有什么喝什么，这也是体验", { novelty: 4, efficiency: 1 }, { casual: 1, explore: 1 }),
      answer("便利店解决，行程比咖啡重要", { efficiency: 5 }, { casual: 1 }),
      answer("在社交平台发问，顺便约当地人见面", { social: 5 }, { share: 2 }),
      answer("找熟悉的连锁店，至少知道菜单怎么点", { efficiency: 5, ritual: 1 }, { beginner: 2, chain: 2 }),
      answer("行李里放几条速溶，找不到店也不影响", { efficiency: 6 }, { beginner: 1, instant: 3 })
    ]
  },
  {
    category: "身体诚实度扫描",
    text: "下午五点，你很困但担心晚上睡不着，你会：",
    answers: [
      answer("小杯照喝，未来的我会处理睡眠", { efficiency: 4 }, { dependency: 2, chaos: 1 }),
      answer("换低因或茶，维持仪式但降低风险", { ritual: 4, efficiency: 1 }, { ritual: 1 }),
      answer("研究不同豆种和萃取方式的咖啡因差异", { precision: 5 }, { dependency: 1 }),
      answer("约人散步聊天，咖啡只是可选配件", { social: 4 }, { avoidCoffee: 1, share: 1 }),
      answer("我本来就不太依赖咖啡，困了就休息或喝水", { efficiency: 2, ritual: 1 }, { beginner: 2, avoidCoffee: 2 }),
      answer("咖啡基本不影响我的睡眠，想喝就喝", { efficiency: 3, ritual: 2 }, { caffeineTolerance: 2, lateCoffee: 1, casual: 1 })
    ]
  },
  {
    category: "器具使用率调查",
    text: "你买过但使用率最低的咖啡物品，更可能是：",
    answers: [
      answer("某个结构非常有理论价值的滤杯", { precision: 2, aesthetic: 3 }, { gear: 2 }),
      answer("为了拍照买的杯子或托盘", { aesthetic: 5 }, { photo: 2, gear: 1 }),
      answer("没有，低频物品会被迅速处理", { efficiency: 5 }, {}),
      answer("我甚至记不清，可能还没拆封", { aesthetic: 3, efficiency: 1 }, { gear: 3, chaos: 1 }),
      answer("买过挂耳或冻干，放到过期才想起来", { efficiency: 4 }, { beginner: 2, instant: 2, casual: 1 }),
      answer("没有器具，我主要收藏优惠券和外卖订单", { efficiency: 5 }, { beginner: 2, budget: 2, chain: 2 })
    ]
  },
  {
    category: "朋友评价回放",
    text: "朋友最可能怎样评价你的咖啡状态？",
    answers: [
      answer("“你怎么什么奇怪东西都敢喝？”", { novelty: 5 }, { chaos: 1, explore: 1 }),
      answer("“你冲杯咖啡为什么像在做实验？”", { precision: 5 }, { brew: 2 }),
      answer("“你不是喝咖啡，你是在办活动，这么大排场。”", { social: 5 }, { share: 2 }),
      answer("“你买咖啡主要是为了那个杯子吧？”", { aesthetic: 5 }, { photo: 1, gear: 1 }),
      answer("“你对咖啡没研究，但 9.9 元券从来不会错过。”", { efficiency: 6 }, { beginner: 2, budget: 3, chain: 2 })
    ]
  },
  {
    category: "理想订阅模型",
    text: "如果加入咖啡会员，你最想获得：",
    answers: [
      answer("每月随机未知豆，开箱前不告诉我", { novelty: 5 }, { explore: 2 }),
      answer("固定可靠的口粮豆，自动送到家", { efficiency: 4, ritual: 2 }, { ritual: 1 }),
      answer("详细参数、课程和专业反馈", { precision: 5 }, { brew: 1 }),
      answer("城市活动、朋友匹配和限定聚会", { social: 5 }, { share: 2 }),
      answer("连锁品牌月卡、折扣券和稳定低价", { efficiency: 6 }, { beginner: 1, budget: 3, chain: 2 }),
      answer("每月一箱速溶或冻干，办公室随手能喝", { efficiency: 6, ritual: 1 }, { beginner: 2, instant: 3 })
    ]
  },
  {
    category: "终极价值选择",
    text: "咖啡对你最重要的价值，必须只留一个：",
    answers: [
      answer("不断遇见没体验过的新风味", { novelty: 6 }, { explore: 2 }),
      answer("每天拥有一段稳定属于自己的时间", { ritual: 6 }, { ritual: 2 }),
      answer("持续理解并把一件事做得更好", { precision: 6 }, { brew: 2 }),
      answer("创造人与人见面和分享的理由", { social: 6 }, { share: 2 }),
      answer("便宜、方便、随时能买到，不需要先学知识", { efficiency: 7 }, { beginner: 3, budget: 2, chain: 1, instant: 1 }),
      answer("独特的风味饮料，我通常不需要根据时间调整咖啡选择", { ritual: 3, efficiency: 2 }, { caffeineTolerance: 3, lateCoffee: 2 })
    ]
  },
  {
    category: "最终口供确认",
    text: "最后，请选择最接近你的一句自白：",
    answers: [
      answer("我真的只是需要清醒，不想参加学术会议。", { efficiency: 6 }, { dependency: 2, iced: 1 }),
      answer("好不好喝很重要，好不好看也同样重要。", { aesthetic: 6 }, { photo: 1 }),
      answer("没有牛奶也可以，但有的话为什么不用？", { aesthetic: 3, efficiency: 2 }, { milk: 3 }),
      answer("其实喝什么不重要，重要的是和谁一起。", { social: 6 }, { avoidCoffee: 2, share: 2 }),
      answer("速溶、9块9，没必要假装专业。", { efficiency: 7, ritual: 1 }, { beginner: 3, instant: 2, budget: 2, chain: 2 }),
      answer("晚上喝咖啡也自觉照样能睡，只是不想喝水", { ritual: 3, efficiency: 2 }, { caffeineTolerance: 3, lateCoffee: 2 })
    ]
  }
];


const DIM_STATS = Object.fromEntries(Object.keys(DIMS).map(key => {
  let max = 0;
  let expected = 0;
  QUESTIONS.forEach(question => {
    const values = question.answers.map(item => item.scores[key] || 0);
    max += Math.max(...values);
    expected += values.reduce((sum, value) => sum + value, 0) / values.length;
  });
  return [key, { max, expected }];
}));

const PHASES = [
  "正在确认你对咖啡的基本态度。",
  "已发现部分消费冲动与社交倾向。",
  "正在核对你不愿承认的咖啡习惯。",
  "隐藏人格触发条件进入最终审查。"
];

const state = {
  index: 0,
  selections: [],
  scores: emptyMap(DIMS),
  flags: {}
};

let currentResult = null;

const el = id => document.getElementById(id);
const screens = [el("landingScreen"), el("quizScreen"), el("resultScreen")];

function emptyMap(source) {
  return Object.fromEntries(Object.keys(source).map(key => [key, 0]));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function showScreen(target) {
  screens.forEach(screen => screen.classList.remove("active"));
  target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetState() {
  state.index = 0;
  state.selections = [];
  state.scores = emptyMap(DIMS);
  state.flags = {};
  currentResult = null;
  localStorage.removeItem("coffeeAbsurdProgress");
}

function startQuiz() {
  resetState();
  showScreen(el("quizScreen"));
  renderQuestion();
}

function recalculate() {
  state.scores = emptyMap(DIMS);
  state.flags = {};

  state.selections.forEach((selection, questionIndex) => {
    if (selection === undefined || selection === null) return;
    const selected = QUESTIONS[questionIndex].answers[selection];

    Object.entries(selected.scores || {}).forEach(([key, value]) => {
      state.scores[key] = (state.scores[key] || 0) + value;
    });

    Object.entries(selected.flags || {}).forEach(([key, value]) => {
      state.flags[key] = (state.flags[key] || 0) + value;
    });
  });
}

function saveProgress() {
  localStorage.setItem("coffeeAbsurdProgress", JSON.stringify({
    index: state.index,
    selections: state.selections
  }));
}

function renderQuestion() {
  const q = QUESTIONS[state.index];
  const progress = ((state.index + 1) / QUESTIONS.length) * 100;
  const displayNumber = String(state.index + 1).padStart(2, "0");

  el("currentQuestion").textContent = displayNumber;
  el("totalQuestions").textContent = QUESTIONS.length;
  el("questionNumberLabel").textContent = `QUESTION ${displayNumber}`;
  el("questionCategory").textContent = q.category;
  el("questionText").textContent = q.text;
  el("horizontalProgressFill").style.width = `${progress}%`;
  el("verticalProgressFill").style.height = `${progress}%`;
  el("phaseCopy").textContent = PHASES[Math.min(3, Math.floor(state.index / 6))];
  el("backBtn").style.visibility = state.index === 0 ? "hidden" : "visible";
  el("previousQuestionBtn").hidden = state.index === 0;

  const list = el("answerList");
  list.innerHTML = "";

  q.answers.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span class="answer-copy"></span>
    `;
    button.querySelector(".answer-copy").textContent = item.text;
    button.addEventListener("click", () => chooseAnswer(index));
    list.appendChild(button);
  });
}

function chooseAnswer(index) {
  state.selections[state.index] = index;
  recalculate();
  saveProgress();

  if (state.index < QUESTIONS.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function goBack() {
  if (state.index <= 0) return;
  state.index -= 1;
  state.selections.splice(state.index, 1);
  recalculate();
  saveProgress();
  renderQuestion();
}

function normalizedDimensions() {
  return Object.fromEntries(
    Object.entries(state.scores).map(([key, value]) => {
      const { max, expected } = DIM_STATS[key];
      const normalized = value >= expected
        ? 50 + ((value - expected) / Math.max(1, max - expected)) * 50
        : (value / Math.max(1, expected)) * 50;
      return [key, clamp(normalized, 5, 100)];
    })
  );
}

function scoreRegularTypes() {
  const dims = normalizedDimensions();

  return Object.entries(TYPE_DATA)
    .map(([key, type]) => {
      const profile = TYPE_PROFILES[key];
      const squaredDistance = Object.keys(DIMS).reduce((sum, dim) => {
        const delta = dims[dim] - profile[dim];
        return sum + delta * delta;
      }, 0) / Object.keys(DIMS).length;

      let score = 100 - Math.sqrt(squaredDistance);

      Object.entries(type.bonus || {}).forEach(([flag, weight]) => {
        score += Math.min(state.flags[flag] || 0, 8) * weight * 8;
      });

      return { key, score };
    })
    .sort((a, b) => b.score - a.score);
}


function coffeeFamiliarityProfile() {
  const f = state.flags;
  const beginnerScore =
    (f.beginner || 0) +
    (f.instant || 0) * 0.8 +
    (f.chain || 0) * 0.55 +
    (f.noBeanKnowledge || 0) * 1.2;

  if (beginnerScore >= 16) return "entry";
  if (beginnerScore >= 8) return "everyday";
  return "enthusiast";
}

function coffeeFamiliarityNote() {
  const profile = coffeeFamiliarityProfile();

  if (profile === "entry") {
    return "你目前更接近日常入门型咖啡消费者：速溶、连锁咖啡和 9.9 元优惠并不代表“不懂咖啡”，只是你更看重方便、价格和稳定。后续推荐应从低门槛、少术语、容易复购的产品开始。";
  }

  if (profile === "everyday") {
    return "你对咖啡有一定偏好，但并不依赖复杂术语或专业器具。比起追逐参数，你更适合从熟悉口味、稳定连锁产品和简单可执行的选择开始探索。";
  }

  return "";
}

function choosePrimaryRegular() {
  const dims = normalizedDimensions();
  const f = state.flags;
  const familiarity = coffeeFamiliarityProfile();

  if (familiarity !== "enthusiast") {
    const practicalSignal = (f.instant || 0) + (f.budget || 0) + (f.chain || 0);
    if ((f.milk || 0) + (f.photo || 0) >= 5 && dims.aesthetic >= 55) return "latte";
    if (dims.social >= 72 && (f.share || 0) >= 4) return "networker";
    if ((f.dark || 0) >= 3 && dims.ritual >= 52) return "safezone";
    if ((f.casual || 0) >= 3 && dims.precision <= 45) return "casual";
    if (practicalSignal >= 7 || dims.efficiency >= 65) return "shareholder";
  }

  const top = Object.entries(dims).sort((a, b) => b[1] - a[1])[0][0];

  if (top === "novelty") {
    if ((f.ferment || 0) + (f.chaos || 0) >= 5) return "ferment";
    if ((f.story || 0) >= 4 && dims.aesthetic >= 52) return "story";
    return "frontier";
  }

  if (top === "ritual") {
    if ((f.dark || 0) >= 3 || dims.efficiency >= 72) return "safezone";
    return "morning";
  }

  if (top === "precision") {
    if ((f.gear || 0) >= 6 && dims.aesthetic >= 55) return "gear";
    if ((f.describe || 0) >= 4 && dims.aesthetic >= 52) return "language";
    return "parameter";
  }

  if (top === "social") {
    if ((f.milk || 0) + (f.photo || 0) >= 4 || dims.aesthetic >= 72) return "latte";
    return "networker";
  }

  if (top === "efficiency") {
    if ((f.dark || 0) >= 3 && dims.ritual >= 52) return "safezone";
    if ((f.casual || 0) >= 3 && dims.precision <= 48) return "casual";
    return "shareholder";
  }

  if ((f.gear || 0) >= 6) return "gear";
  if ((f.story || 0) >= 4) return "story";
  if ((f.milk || 0) + (f.photo || 0) >= 4 || dims.social >= 65) return "latte";
  if ((f.describe || 0) >= 4 || dims.precision >= 65) return "language";
  if (dims.ritual >= 62) return "morning";
  return "gear";
}

function detectHiddenType() {
  const f = state.flags;
  const dims = normalizedDimensions();

  const candidates = [
    {
      key: "perpetual",
      strength: (f.dependency || 0) * 2 + dims.efficiency / 20,
      active: (f.dependency || 0) >= 8 && dims.efficiency >= 72
    },
    {
      key: "warehouse",
      strength: (f.gear || 0) * 2 - (f.brew || 0),
      active: (f.gear || 0) >= 8 && (f.brew || 0) <= 5
    },
    {
      key: "milkspy",
      strength: (f.milk || 0) * 2 + dims.aesthetic / 25,
      active: (f.milk || 0) >= 6
    },
    {
      key: "undercover",
      strength: (f.avoidCoffee || 0) * 2 + dims.social / 25,
      active: (f.avoidCoffee || 0) >= 6 && dims.social >= 60
    },
    {
      key: "immune",
      strength:
        (f.caffeineTolerance || 0) * 2 +
        (f.lateCoffee || 0) * 1.5 -
        (f.dependency || 0) * 0.75,
      active:
        (f.caffeineTolerance || 0) >= 5 &&
        (f.lateCoffee || 0) >= 3 &&
        (f.dependency || 0) < 8
    }
  ];

  const active = candidates.filter(item => item.active).sort((a, b) => b.strength - a.strength);
  return active.length ? active[0].key : null;
}

function buildIndices() {
  const dims = normalizedDimensions();
  const dependency = Math.round(clamp(18 + (state.flags.dependency || 0) * 8 + dims.efficiency * .3, 8, 99));
  const chaos = Math.round(clamp(12 + (state.flags.chaos || 0) * 9 + (state.flags.ferment || 0) * 5 + dims.novelty * .36, 6, 99));
  const share = Math.round(clamp(10 + (state.flags.share || 0) * 7 + dims.social * .38, 5, 99));
  return { dependency, chaos, share };
}

function finishQuiz() {
  recalculate();
  const ranking = scoreRegularTypes();
  const hiddenKey = detectHiddenType();
  const primaryRegularKey = choosePrimaryRegular();
  const secondaryRegularKey = (ranking.find(item => item.key !== primaryRegularKey) || ranking[1]).key;

  currentResult = {
    hiddenKey,
    primaryRegularKey,
    secondaryRegularKey,
    primary: hiddenKey ? HIDDEN_TYPES[hiddenKey] : TYPE_DATA[primaryRegularKey],
    secondary: hiddenKey ? TYPE_DATA[primaryRegularKey] : TYPE_DATA[secondaryRegularKey],
    dimensions: normalizedDimensions(),
    indices: buildIndices()
  };

  renderResult();
  localStorage.setItem("coffeeAbsurdLastResult", JSON.stringify({
    hiddenKey,
    primaryRegularKey,
    secondaryRegularKey,
    scores: state.scores,
    flags: state.flags,
    completedAt: new Date().toISOString()
  }));
  localStorage.removeItem("coffeeAbsurdProgress");
  showScreen(el("resultScreen"));
  registerCompletedTester();
}

function renderResult() {
  const r = currentResult.primary;
  const hidden = Boolean(currentResult.hiddenKey);

  el("resultTypeCode").textContent = r.code;
  el("hiddenBadge").hidden = !hidden;
  el("resultName").textContent = r.name;
  el("resultSlogan").textContent = r.slogan;
  el("resultEmoji").textContent = r.emoji;
  const familiarityNote = coffeeFamiliarityNote();
  el("resultDescription").textContent = familiarityNote
    ? `${r.description} ${familiarityNote}`
    : r.description;
  el("resultSymptoms").textContent = r.symptoms;
  el("resultCoffee").textContent = r.coffee;
  el("resultScene").textContent = r.scene;
  el("resultAlly").textContent = r.ally;
  el("resultQuote").textContent = r.quote;

  el("secondaryName").textContent = currentResult.secondary.name;
  el("secondaryDescription").textContent = hidden
    ? `隐藏人格覆盖了最终称号，但你的基础倾向最接近「${currentResult.secondary.name}」。${currentResult.secondary.description}`
    : `主导人格之外，你也明显带有「${currentResult.secondary.name}」的特征。${currentResult.secondary.description}`;

  setIndex("dependency", currentResult.indices.dependency);
  setIndex("chaos", currentResult.indices.chaos);
  setIndex("share", currentResult.indices.share);

  el("actionFeedback").textContent = "";
  requestAnimationFrame(() => drawRadar(currentResult.dimensions));
}

function setIndex(name, value) {
  el(`${name}Value`).textContent = `${value}%`;
  requestAnimationFrame(() => {
    el(`${name}Bar`).style.width = `${value}%`;
  });
}

function drawRadar(dimensions) {
  const canvas = el("radarCanvas");
  const rect = canvas.getBoundingClientRect();
  const scale = Math.max(1, window.devicePixelRatio || 1);
  const cssWidth = Math.max(300, rect.width || 420);
  const cssHeight = cssWidth * .78;

  canvas.width = cssWidth * scale;
  canvas.height = cssHeight * scale;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const keys = Object.keys(DIMS);
  const cx = cssWidth / 2;
  const cy = cssHeight / 2 + 4;
  const radius = Math.min(cssWidth, cssHeight) * .31;
  const levels = 4;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(22,18,16,.16)";

  for (let level = 1; level <= levels; level++) {
    const r = radius * (level / levels);
    ctx.beginPath();
    keys.forEach((key, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / keys.length;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  keys.forEach((key, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / keys.length;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.stroke();
  });

  ctx.beginPath();
  keys.forEach((key, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / keys.length;
    const r = radius * (dimensions[key] / 100);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(255,107,53,.25)";
  ctx.strokeStyle = "#ff6b35";
  ctx.lineWidth = 2.5;
  ctx.fill();
  ctx.stroke();

  keys.forEach((key, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / keys.length;
    const r = radius * (dimensions[key] / 100);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#161210";
    ctx.fill();

    const lx = cx + Math.cos(angle) * (radius + 29);
    const ly = cy + Math.sin(angle) * (radius + 29);
    ctx.fillStyle = "#161210";
    ctx.font = '700 13px "Noto Sans SC", sans-serif';
    ctx.textAlign = Math.cos(angle) > .25 ? "left" : Math.cos(angle) < -.25 ? "right" : "center";
    ctx.textBaseline = Math.sin(angle) > .5 ? "top" : Math.sin(angle) < -.5 ? "bottom" : "middle";
    ctx.fillText(`${DIMS[key].short} ${Math.round(dimensions[key])}`, lx, ly);
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
  const chars = [...text];
  const lines = [];
  let line = "";

  chars.forEach(char => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((item, index) => {
    let output = item;
    if (index === maxLines - 1 && lines.length > maxLines) output = `${item.slice(0, -1)}…`;
    ctx.fillText(output, x, y + index * lineHeight);
  });

  return Math.min(lines.length, maxLines) * lineHeight;
}


function getSiteShareUrl() {
  return location.href.split("#")[0];
}

function createQRCodeCanvas(text, size = 170) {
  if (!window.QRCode) return null;

  const staging = el("qrCodeStaging") || document.createElement("div");
  staging.innerHTML = "";

  try {
    new QRCode(staging, {
      text,
      width: size,
      height: size,
      colorDark: "#161210",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (error) {
    console.warn("二维码生成失败。", error);
    return null;
  }

  const qrCanvas = staging.querySelector("canvas");
  if (qrCanvas) return qrCanvas;

  const qrImage = staging.querySelector("img");
  if (!qrImage) return null;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(qrImage, 0, 0, size, size);
  return canvas;
}

function renderPosterCanvas() {
  if (!currentResult) return null;

  const canvas = el("posterCanvas");
  const ctx = canvas.getContext("2d");
  const r = currentResult.primary;
  const d = currentResult.dimensions;
  const width = canvas.width;
  const height = canvas.height;

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#f7f3ea");
  bg.addColorStop(1, "#e8ddcd");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#d8ff55";
  ctx.beginPath();
  ctx.arc(930, 150, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#161210";
  ctx.lineWidth = 5;
  roundRect(ctx, 56, 56, width - 112, height - 112, 42);
  ctx.stroke();

  ctx.fillStyle = "#ff6b35";
  ctx.font = '700 28px "Space Grotesk", "Noto Sans SC", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("COFFEE ABSURD PERSONA LAB", 100, 125);

  ctx.fillStyle = "#161210";
  ctx.font = '700 25px "Space Grotesk", "Noto Sans SC", sans-serif';
  ctx.textAlign = "right";
  ctx.fillText(r.code, width - 100, 125);

  if (currentResult.hiddenKey) {
    ctx.fillStyle = "#161210";
    roundRect(ctx, 100, 170, 270, 56, 28);
    ctx.fill();
    ctx.fillStyle = "#d8ff55";
    ctx.font = '800 23px "Noto Sans SC", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("隐藏人格已触发", 235, 207);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#6e665f";
  ctx.font = '600 28px "Noto Sans SC", sans-serif';
  ctx.fillText("你的咖啡荒谬人格是", width / 2, 295);

  ctx.fillStyle = "#161210";
  ctx.font = '900 74px "Noto Sans SC", sans-serif';
  wrapText(ctx, r.name, width / 2, 390, 860, 90, 2);

  ctx.fillStyle = "#ff6b35";
  ctx.font = '800 31px "Noto Sans SC", sans-serif';
  wrapText(ctx, r.slogan, width / 2, 500, 820, 45, 2);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#161210";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(width / 2, 700, 145, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = '120px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#161210";
  ctx.fillText(r.emoji, width / 2, 705);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#161210";
  ctx.font = '800 24px "Noto Sans SC", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("六维人格构成", 100, 925);

  const keys = Object.keys(DIMS);
  keys.forEach((key, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 100 + col * 470;
    const y = 970 + row * 80;
    ctx.fillStyle = "#161210";
    ctx.font = '700 22px "Noto Sans SC", sans-serif';
    ctx.fillText(DIMS[key].name, x, y);
    ctx.fillStyle = "rgba(22,18,16,.12)";
    roundRect(ctx, x + 82, y - 20, 300, 18, 9);
    ctx.fill();
    ctx.fillStyle = "#ff6b35";
    roundRect(ctx, x + 82, y - 20, 300 * d[key] / 100, 18, 9);
    ctx.fill();
    ctx.fillStyle = "#6e665f";
    ctx.font = '700 19px "Space Grotesk", sans-serif';
    ctx.textAlign = "right";
    ctx.fillText(String(Math.round(d[key])), x + 430, y);
    ctx.textAlign = "left";
  });

  const quoteX = 100;
  const quoteY = 1174;
  const quoteW = 560;
  const quoteH = 150;

  ctx.fillStyle = "#161210";
  roundRect(ctx, quoteX, quoteY, quoteW, quoteH, 22);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = '800 24px "Noto Sans SC", sans-serif';
  ctx.textAlign = "center";
  wrapText(ctx, r.quote.replace(/[“”]/g, ""), quoteX + quoteW / 2, quoteY + 56, quoteW - 56, 34, 3);

  const qrCardX = 720;
  const qrCardY = 1160;
  const qrSize = 170;
  const qrPadding = 16;
  const qrCardSize = qrSize + qrPadding * 2;

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#161210";
  ctx.lineWidth = 4;
  roundRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 22);
  ctx.fill();
  ctx.stroke();

  const qrCanvas = createQRCodeCanvas(getSiteShareUrl(), qrSize);
  if (qrCanvas) {
    ctx.drawImage(
      qrCanvas,
      qrCardX + qrPadding,
      qrCardY + qrPadding,
      qrSize,
      qrSize
    );
  } else {
    ctx.fillStyle = "#f2eee6";
    ctx.fillRect(
      qrCardX + qrPadding,
      qrCardY + qrPadding,
      qrSize,
      qrSize
    );
    ctx.strokeStyle = "#161210";
    ctx.strokeRect(
      qrCardX + qrPadding,
      qrCardY + qrPadding,
      qrSize,
      qrSize
    );
    ctx.fillStyle = "#6e665f";
    ctx.font = '700 18px "Noto Sans SC", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(
      "二维码加载失败",
      qrCardX + qrCardSize / 2,
      qrCardY + qrCardSize / 2
    );
  }

  ctx.fillStyle = "#6e665f";
  ctx.font = '500 18px "Noto Sans SC", sans-serif';
  ctx.fillText("24 道题 · 12 种常规人格 · 5 种隐藏人格", width / 2, 1382);

  return canvas;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function buildShareText() {
  const r = currentResult.primary;
  const secondary = currentResult.secondary.name;
  return `我的咖啡荒谬人格是「${r.name}」：${r.slogan}\n六维倾向里，我的${topDimensionName()}最高；体内还住着一个「${secondary}」。\n你喝的到底是咖啡，还是人设？`;
}

function topDimensionName() {
  const entry = Object.entries(currentResult.dimensions).sort((a, b) => b[1] - a[1])[0];
  return DIMS[entry[0]].name;
}

function isWechatBrowser() {
  return /MicroMessenger/i.test(navigator.userAgent || "");
}

function isIOSDevice() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || "") ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function dataUrlToBlob(dataUrl) {
  const [header, encoded] = dataUrl.split(",");
  const mimeMatch = header.match(/data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

function posterFileName() {
  const resultName = currentResult?.primary?.name || "咖啡人格";
  return `咖啡人格-${resultName}.png`;
}

function createPosterAssets() {
  const canvas = renderPosterCanvas();
  if (!canvas) return null;

  const dataUrl = canvas.toDataURL("image/png");
  const blob = dataUrlToBlob(dataUrl);
  const file = new File([blob], posterFileName(), {
    type: "image/png",
    lastModified: Date.now()
  });

  return { canvas, dataUrl, blob, file };
}

function openPosterPreview(assets, feedback = "") {
  if (!assets) return;

  el("posterPreviewImage").src = assets.dataUrl;
  el("posterPreviewModal").hidden = false;
  el("wechatShareHint").hidden = !isWechatBrowser();
  el("posterPreviewFeedback").textContent = feedback;
  document.body.classList.add("modal-open");

  requestAnimationFrame(() => {
    el("closePosterPreviewBtn").focus();
  });
}

function closePosterPreview() {
  el("posterPreviewModal").hidden = true;
  document.body.classList.remove("modal-open");
}

function canSharePosterFile(file) {
  if (!navigator.share || !navigator.canShare) return false;

  try {
    return navigator.canShare({ files: [file] });
  } catch (_) {
    return false;
  }
}

async function nativeSharePoster(assets) {
  if (!assets) return false;

  if (!canSharePosterFile(assets.file)) {
    return false;
  }

  try {
    await navigator.share({
      title: "我的咖啡荒谬人格",
      text: buildShareText(),
      files: [assets.file]
    });
    return true;
  } catch (error) {
    if (error?.name === "AbortError") return true;
    console.warn("系统图片分享失败。", error);
    return false;
  }
}

function downloadPosterAssets(assets) {
  if (!assets) return;

  // 微信内置浏览器和部分 iOS WebView 不可靠地支持 download 属性。
  // 对这些环境保留高清图片预览，用户可长按保存。
  if (isWechatBrowser() || isIOSDevice()) {
    openPosterPreview(
      assets,
      isWechatBrowser()
        ? "请长按图片并选择“保存图片”。"
        : "请长按图片保存，或使用“分享图片到微信等应用”。"
    );
    return;
  }

  const link = document.createElement("a");
  link.download = posterFileName();
  link.href = assets.dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
  el("posterPreviewFeedback").textContent = "图片下载已开始。";
}

async function generatePoster() {
  const assets = createPosterAssets();
  if (!assets) return;

  openPosterPreview(
    assets,
    isWechatBrowser()
      ? "微信内请长按海报保存。"
      : "海报已生成，可直接分享或保存。"
  );
  el("actionFeedback").textContent = "结果海报已生成。";
}

async function shareResult() {
  const assets = createPosterAssets();
  if (!assets) return;

  // 微信内置浏览器通常不会开放标准文件分享面板，直接显示长按保存方案。
  if (isWechatBrowser()) {
    openPosterPreview(assets, "微信内请长按海报保存，再发送给好友或朋友圈。");
    el("actionFeedback").textContent = "已打开微信保存与分享说明。";
    return;
  }

  const shared = await nativeSharePoster(assets);
  if (shared) {
    el("actionFeedback").textContent = "系统分享面板已打开。";
    return;
  }

  openPosterPreview(assets, "当前浏览器不支持直接分享图片，请保存图片或复制文案。");
  el("actionFeedback").textContent = "已打开兼容分享方式。";
}

async function sharePosterFromPreview() {
  const assets = createPosterAssets();
  if (!assets) return;

  if (isWechatBrowser()) {
    openPosterPreview(assets, "微信内请长按海报保存，再发送给好友或朋友圈。");
    return;
  }

  const shared = await nativeSharePoster(assets);
  if (!shared) {
    el("posterPreviewFeedback").textContent =
      "当前浏览器不支持图片直分享，请使用“保存 / 下载图片”。";
  }
}

async function copyPosterShareText() {
  const text = `${buildShareText()}\n${getSiteShareUrl()}`;

  try {
    await navigator.clipboard.writeText(text);
    el("posterPreviewFeedback").textContent = "分享文案和网站地址已复制。";
  } catch (_) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    el("posterPreviewFeedback").textContent = "分享文案和网站地址已复制。";
  }
}


function exitQuiz() {
  showScreen(el("landingScreen"));
}

el("startBtn").addEventListener("click", startQuiz);
el("topRestartBtn").addEventListener("click", startQuiz);
el("resultRestartBtn").addEventListener("click", startQuiz);
el("backBtn").addEventListener("click", goBack);
el("previousQuestionBtn").addEventListener("click", goBack);
el("exitBtn").addEventListener("click", exitQuiz);
el("posterBtn").addEventListener("click", generatePoster);
el("shareBtn").addEventListener("click", shareResult);
el("closePosterPreviewBtn").addEventListener("click", closePosterPreview);
el("posterPreviewModal").querySelector(".poster-preview-backdrop")
  .addEventListener("click", closePosterPreview);
el("nativeShareImageBtn").addEventListener("click", sharePosterFromPreview);
el("downloadPosterImageBtn").addEventListener("click", () => {
  downloadPosterAssets(createPosterAssets());
});
el("copyPosterShareTextBtn").addEventListener("click", copyPosterShareText);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !el("posterPreviewModal").hidden) {
    closePosterPreview();
  }
});

window.addEventListener("resize", () => {
  if (currentResult && el("resultScreen").classList.contains("active")) {
    drawRadar(currentResult.dimensions);
  }
});

loadTestCount();
