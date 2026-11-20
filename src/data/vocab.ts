export type Level = 'OW' | 'AOW' | 'PHRASE'

export interface VocabItem {
  id: string
  en: string
  cn: string
  phonetic?: string
  level: Level
  category: string
  note?: string
  example?: string
  exampleCn?: string
}

export interface CategoryMeta {
  id: string
  label: string
  level: Level
  blurb: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'ow-equipment', label: 'OW · 装备', level: 'OW', blurb: '调节器、BCD、面镜脚蹼……每样装备都要叫得出英文' },
  { id: 'ow-skills', label: 'OW · 技巧', level: 'OW', blurb: '面镜排水、调节器寻回、共气、中性浮力等核心技巧' },
  { id: 'ow-safety', label: 'OW · 安全规则', level: 'OW', blurb: '简报里一定会听到的安全术语与规则' },
  { id: 'ow-signals', label: 'OW · 手势沟通', level: 'OW', blurb: '水下没法说话，手势就是你的语言' },
  { id: 'aow-deep', label: 'AOW · 深潜', level: 'AOW', blurb: '18–30 米的世界：氮醉、耗气、深潜计划' },
  { id: 'aow-nav', label: 'AOW · 水下导航', level: 'AOW', blurb: '指北针与自然导航，AOW 必修' },
  { id: 'aow-elec', label: 'AOW · 专长潜水', level: 'AOW', blurb: '夜潜、沉船、放流、船潜、高氧等专长词汇' },
  { id: 'aow-env', label: 'AOW · 海洋环境', level: 'AOW', blurb: '泰国潜点常见的海洋生物与环境词' },
  { id: 'phrase-course', label: '表达 · 课程沟通', level: 'PHRASE', blurb: '报到、租装备、听懂简报，开口第一句' },
  { id: 'phrase-boat', label: '表达 · 船上日常', level: 'PHRASE', blurb: '出海当天的实用对话' },
  { id: 'phrase-emergency', label: '表达 · 紧急状况', level: 'PHRASE', blurb: '关键时刻必须脱口而出的句子' },
]

export const VOCAB: VocabItem[] = [
  // ======================= OW · 装备 =======================
  { id: 'oe01', en: 'scuba', cn: '水肺', phonetic: '/ˈskuːbə/', level: 'OW', category: 'ow-equipment', note: 'Self-Contained Underwater Breathing Apparatus 的缩写' },
  { id: 'oe02', en: 'regulator', cn: '调节器', phonetic: '/ˈreɡjuleɪtər/', level: 'OW', category: 'ow-equipment', example: 'My regulator is breathing a little wet.', exampleCn: '我的调节器吸气时有点进水。' },
  { id: 'oe03', en: 'first stage', cn: '一级头', level: 'OW', category: 'ow-equipment', note: '连接气瓶阀,把高压气降到中压' },
  { id: 'oe04', en: 'second stage', cn: '二级头', level: 'OW', category: 'ow-equipment', note: '你嘴里咬着的那个部分' },
  { id: 'oe05', en: 'octopus', cn: '备用二级头(章鱼管)', phonetic: '/ˈɒktəpəs/', level: 'OW', category: 'ow-equipment', note: '也叫 alternate air source,通常是黄色的' },
  { id: 'oe06', en: 'alternate air source', cn: '备用气源', level: 'OW', category: 'ow-equipment', example: 'Always know where your buddy\'s alternate air source is.', exampleCn: '一定要知道潜伴的备用气源在哪。' },
  { id: 'oe07', en: 'BCD (buoyancy control device)', cn: '浮力控制装置(夹克)', level: 'OW', category: 'ow-equipment', example: 'Inflate your BCD on the surface.', exampleCn: '在水面上给 BCD 充气。' },
  { id: 'oe08', en: 'SPG (submersible pressure gauge)', cn: '气压表', level: 'OW', category: 'ow-equipment', example: 'Check your SPG regularly.', exampleCn: '要经常查看气压表。' },
  { id: 'oe09', en: 'depth gauge', cn: '深度表', level: 'OW', category: 'ow-equipment' },
  { id: 'oe10', en: 'dive computer', cn: '潜水电脑表', level: 'OW', category: 'ow-equipment', example: 'Your dive computer tracks your no-decompression limit.', exampleCn: '潜水电脑表会追踪你的免减压极限。' },
  { id: 'oe11', en: 'console', cn: '仪表组(三联表)', phonetic: '/ˈkɒnsəʊl/', level: 'OW', category: 'ow-equipment' },
  { id: 'oe12', en: 'inflator hose', cn: '(BCD)充气管', level: 'OW', category: 'ow-equipment', note: '也叫 low pressure inflator / LPI' },
  { id: 'oe13', en: 'deflate valve', cn: '排气阀', level: 'OW', category: 'ow-equipment' },
  { id: 'oe14', en: 'dump valve', cn: '快泄阀', level: 'OW', category: 'ow-equipment', note: 'BCD 上拉一下就快速排气的阀门' },
  { id: 'oe15', en: 'mask', cn: '面镜', level: 'OW', category: 'ow-equipment', example: 'Spit in your mask to prevent fogging.', exampleCn: '往面镜里吐点口水防起雾。' },
  { id: 'oe16', en: 'snorkel', cn: '呼吸管', phonetic: '/ˈsnɔːkəl/', level: 'OW', category: 'ow-equipment' },
  { id: 'oe17', en: 'fins', cn: '脚蹼', level: 'OW', category: 'ow-equipment', note: '英国英语叫 fins,别说 flippers(那是休闲说法)' },
  { id: 'oe18', en: 'wetsuit', cn: '湿式潜水服', level: 'OW', category: 'ow-equipment', note: '泰国一般 3mm 短款或长款就够了' },
  { id: 'oe19', en: 'dry suit', cn: '干式潜水服', level: 'OW', category: 'ow-equipment' },
  { id: 'oe20', en: 'hood', cn: '头套', level: 'OW', category: 'ow-equipment' },
  { id: 'oe21', en: 'booties', cn: '潜水靴', phonetic: '/ˈbuːtiːz/', level: 'OW', category: 'ow-equipment' },
  { id: 'oe22', en: 'weights', cn: '配重(铅块)', level: 'OW', category: 'ow-equipment', example: 'How much weight do I need with a 3mm wetsuit?', exampleCn: '穿 3mm 湿衣我需要多少配重?' },
  { id: 'oe23', en: 'weight belt', cn: '配重带', level: 'OW', category: 'ow-equipment' },
  { id: 'oe24', en: 'tank / cylinder', cn: '气瓶', phonetic: '/ˈsɪlɪndər/', level: 'OW', category: 'ow-equipment', note: '口语多说 tank,正式场合说 cylinder' },
  { id: 'oe25', en: 'valve', cn: '气瓶阀', phonetic: '/vælv/', level: 'OW', category: 'ow-equipment' },
  { id: 'oe26', en: 'O-ring', cn: '密封圈(O 形圈)', level: 'OW', category: 'ow-equipment', note: '气瓶阀口的小橡皮圈,漏气了常是它的问题' },
  { id: 'oe27', en: 'dive flag', cn: '潜水旗', level: 'OW', category: 'ow-equipment' },
  { id: 'oe28', en: 'surface marker buoy (SMB)', cn: '水面浮标(象拔)', level: 'OW', category: 'ow-equipment', note: '口语也叫 safety sausage(安全香肠)' },
  { id: 'oe29', en: 'reel', cn: '线轮', phonetic: '/riːl/', level: 'OW', category: 'ow-equipment' },
  { id: 'oe30', en: 'dive light / torch', cn: '潜水手电', level: 'OW', category: 'ow-equipment', note: '英式英语常用 torch' },
  { id: 'oe31', en: 'dive knife', cn: '潜水刀', level: 'OW', category: 'ow-equipment', note: '也叫 cutting tool,主要用来割断渔线' },
  { id: 'oe32', en: 'compass', cn: '指北针', phonetic: '/ˈkʌmpəs/', level: 'OW', category: 'ow-equipment' },
  { id: 'oe33', en: 'logbook', cn: '潜水日志', level: 'OW', category: 'ow-equipment', example: 'Bring your logbook to the dive center.', exampleCn: '去潜店记得带上你的潜水日志。' },
  { id: 'oe34', en: 'slate', cn: '水下写字板', phonetic: '/sleɪt/', level: 'OW', category: 'ow-equipment' },
  { id: 'oe35', en: 'yoke / DIN', cn: '轭式接口 / DIN 接口', phonetic: '/joʊk/', level: 'OW', category: 'ow-equipment', note: '东南亚气瓶多为 yoke(int)接口' },

  // ======================= OW · 技巧 =======================
  { id: 'os01', en: 'mask clearing', cn: '面镜排水', level: 'OW', category: 'ow-skills', example: 'Clear your mask by looking up and exhaling through your nose.', exampleCn: '抬头、用鼻子呼气,给面镜排水。' },
  { id: 'os02', en: 'partial mask flood', cn: '面镜部分进水', phonetic: '/flʌd/', level: 'OW', category: 'ow-skills' },
  { id: 'os03', en: 'mask removal and replacement', cn: '面镜摘除与戴回', level: 'OW', category: 'ow-skills' },
  { id: 'os04', en: 'regulator recovery', cn: '调节器寻回', level: 'OW', category: 'ow-skills' },
  { id: 'os05', en: 'regulator clearing', cn: '调节器排水(排气)', level: 'OW', category: 'ow-skills', note: '用呼气或按 purge 按钮排出积水' },
  { id: 'os06', en: 'purge', cn: '排气/吹气清除', phonetic: '/pɜːdʒ/', level: 'OW', category: 'ow-skills', example: 'Press the purge button to clear the regulator.', exampleCn: '按排气按钮清除调节器里的水。' },
  { id: 'os07', en: 'sweep (arm sweep)', cn: '横扫寻回法', phonetic: '/swiːp/', level: 'OW', category: 'ow-skills', note: '手臂向身后横扫找回脱落的二级头' },
  { id: 'os08', en: 'reach method', cn: '顺管寻回法', level: 'OW', category: 'ow-skills', note: '顺着管子从气瓶摸到二级头' },
  { id: 'os09', en: 'share air', cn: '共气', level: 'OW', category: 'ow-skills', example: 'If your buddy is out of air, share air and ascend together.', exampleCn: '潜伴没气时,共气并一起上升。' },
  { id: 'os10', en: 'out of air', cn: '没气了', level: 'OW', category: 'ow-skills', note: '手势:手掌横切喉咙' },
  { id: 'os11', en: 'buoyancy', cn: '浮力', phonetic: '/ˈbɔɪənsi/', level: 'OW', category: 'ow-skills' },
  { id: 'os12', en: 'neutral buoyancy', cn: '中性浮力', level: 'OW', category: 'ow-skills', example: 'Good divers hover in neutral buoyancy.', exampleCn: '优秀的潜水员能悬浮在中性浮力状态。' },
  { id: 'os13', en: 'positive buoyancy', cn: '正浮力', level: 'OW', category: 'ow-skills' },
  { id: 'os14', en: 'negative buoyancy', cn: '负浮力', level: 'OW', category: 'ow-skills' },
  { id: 'os15', en: 'hover', cn: '悬浮', phonetic: '/ˈhɒvər/', level: 'OW', category: 'ow-skills', example: 'Try to hover without moving your hands.', exampleCn: '试着不动手,保持悬浮。' },
  { id: 'os16', en: 'descent', cn: '下潜', phonetic: '/dɪˈsent/', level: 'OW', category: 'ow-skills' },
  { id: 'os17', en: 'ascent', cn: '上升', phonetic: '/əˈsent/', level: 'OW', category: 'ow-skills', note: 'ascent 上升 / descent 下潜,注意别记反' },
  { id: 'os18', en: 'inflate', cn: '充气', phonetic: '/ɪnˈfleɪt/', level: 'OW', category: 'ow-skills' },
  { id: 'os19', en: 'deflate', cn: '放气', phonetic: '/dɪˈfleɪt/', level: 'OW', category: 'ow-skills' },
  { id: 'os20', en: 'equalize', cn: '平衡耳压', phonetic: '/ˈiːkwəlaɪz/', level: 'OW', category: 'ow-skills', example: 'Equalize early and often during descent.', exampleCn: '下潜时要尽早、频繁地平衡耳压。' },
  { id: 'os21', en: 'Valsalva maneuver', cn: '捏鼻鼓气法(瓦氏动作)', phonetic: '/vælˈsælvə/', level: 'OW', category: 'ow-skills', note: '捏住鼻子轻轻鼓气的耳压平衡法' },
  { id: 'os22', en: 'ear squeeze', cn: '耳压挤压伤', phonetic: '/skwiːz/', level: 'OW', category: 'ow-skills', note: 'squeeze 泛指一切压力性损伤' },
  { id: 'os23', en: 'safety stop', cn: '安全停留', level: 'OW', category: 'ow-skills', example: 'We\'ll do a 3-minute safety stop at 5 meters.', exampleCn: '我们将在 5 米处做 3 分钟安全停留。' },
  { id: 'os24', en: 'buddy check', cn: '潜伴检查', level: 'OW', category: 'ow-skills', example: 'Do your buddy check before entering the water.', exampleCn: '入水前做潜伴检查。' },
  { id: 'os25', en: 'BWRAF', cn: '潜伴检查口诀', level: 'OW', category: 'ow-skills', note: 'BCD · Weights · Releases · Air · Final OK(顺口溜: Begin With Review And Friend)' },
  { id: 'os26', en: 'giant stride entry', cn: '跨步式入水', phonetic: '/straɪd/', level: 'OW', category: 'ow-skills' },
  { id: 'os27', en: 'back roll entry', cn: '背滚式入水', level: 'OW', category: 'ow-skills', note: '小船常用:坐在船舷向后翻' },
  { id: 'os28', en: 'controlled seated entry', cn: '坐姿控制入水', level: 'OW', category: 'ow-skills' },
  { id: 'os29', en: 'fin pivot', cn: '蛙鞋旋轴(中性浮力练习)', phonetic: '/ˈpɪvət/', level: 'OW', category: 'ow-skills' },
  { id: 'os30', en: 'CESA (controlled emergency swimming ascent)', cn: '有控制紧急游泳上升', level: 'OW', category: 'ow-skills', note: '没气时边吐气边游向水面' },
  { id: 'os31', en: 'emergency ascent', cn: '紧急上升', level: 'OW', category: 'ow-skills' },
  { id: 'os32', en: 'air sharing ascent', cn: '共气上升', level: 'OW', category: 'ow-skills' },
  { id: 'os33', en: 'weight removal', cn: '摘除配重', level: 'OW', category: 'ow-skills' },
  { id: 'os34', en: 'tired diver tow', cn: '疲惫潜水员拖带', phonetic: '/təʊ/', level: 'OW', category: 'ow-skills' },
  { id: 'os35', en: 'cramp release', cn: '抽筋解除', phonetic: '/kræmp/', level: 'OW', category: 'ow-skills', note: '掰脚尖拉伸小腿,两人配合完成' },
  { id: 'os36', en: 'snorkel-regulator exchange', cn: '呼吸管与调节器互换', level: 'OW', category: 'ow-skills' },
  { id: 'os37', en: 'free flow', cn: '调节器持续漏气', level: 'OW', category: 'ow-skills', example: 'My octopus is free-flowing.', exampleCn: '我的备用二级头在不停漏气。' },
  { id: 'os38', en: 'oral inflation', cn: '口吹充气', phonetic: '/ˈɔːrəl/', level: 'OW', category: 'ow-skills', note: '水面用嘴给 BCD 充气,省力也省气瓶' },
  { id: 'os39', en: 'disconnect the inflator', cn: '断开充气管', level: 'OW', category: 'ow-skills', note: 'BCD 自动充气失控时的处理动作' },
  { id: 'os40', en: 'flutter kick', cn: '自由式踢水', phonetic: '/ˈflʌtər/', level: 'OW', category: 'ow-skills' },
]

// ======================= OW · 安全规则 =======================
const OW_SAFETY: VocabItem[] = [
  { id: 'oa01', en: 'Never hold your breath', cn: '永远不要憋气', level: 'OW', category: 'ow-safety', note: '水肺潜水的第一黄金法则', example: 'Rule number one: never hold your breath.', exampleCn: '第一法则:永远不要憋气。' },
  { id: 'oa02', en: 'ascend slowly', cn: '缓慢上升', level: 'OW', category: 'ow-safety', example: 'Ascend slowly, no faster than 18 meters per minute.', exampleCn: '缓慢上升,每分钟不超过 18 米(现代建议更慢,9–10 米/分)。' },
  { id: 'oa03', en: 'look up and reach up', cn: '上升前抬头看、伸手向上', level: 'OW', category: 'ow-safety', note: '上升前的标准动作,防止上方有船或障碍' },
  { id: 'oa04', en: 'plan your dive, dive your plan', cn: '计划你的潜水,并照计划潜水', level: 'OW', category: 'ow-safety', note: '潜水界最有名的安全格言' },
  { id: 'oa05', en: 'check your air', cn: '查看你的气量', level: 'OW', category: 'ow-safety', example: 'Check your air every few minutes.', exampleCn: '每隔几分钟看一次气量。' },
  { id: 'oa06', en: 'stay with your buddy', cn: '和潜伴待在一起', level: 'OW', category: 'ow-safety' },
  { id: 'oa07', en: 'maximum depth', cn: '最大深度', level: 'OW', category: 'ow-safety', note: 'OW 证书限 18 米,AOW 后 30 米,深潜专长 40 米' },
  { id: 'oa08', en: 'no decompression limit (NDL)', cn: '免减压极限', level: 'OW', category: 'ow-safety', note: '也叫 no-stop time,超过就要做减压停留' },
  { id: 'oa09', en: 'decompression stop', cn: '减压停留', level: 'OW', category: 'ow-safety', note: '休闲潜水计划内不应出现,但要知道这个词' },
  { id: 'oa10', en: 'surface interval', cn: '水面间隔(休息时间)', level: 'OW', category: 'ow-safety', example: 'We\'ll have a one-hour surface interval between dives.', exampleCn: '两潜之间我们有一小时水面间隔。' },
  { id: 'oa11', en: 'bottom time', cn: '水底时间', level: 'OW', category: 'ow-safety' },
  { id: 'oa12', en: 'pre-dive safety check', cn: '潜前安全检查', level: 'OW', category: 'ow-safety', note: '即 buddy check / BWRAF' },
  { id: 'oa13', en: 'dive briefing', cn: '潜水简报', phonetic: '/ˈbriːfɪŋ/', level: 'OW', category: 'ow-safety', example: 'Listen carefully during the dive briefing.', exampleCn: '潜水简报时一定要认真听。' },
  { id: 'oa14', en: 'dive plan', cn: '潜水计划', level: 'OW', category: 'ow-safety' },
  { id: 'oa15', en: 'entry', cn: '入水(方式)', level: 'OW', category: 'ow-safety', note: '对应 exit 出水' },
  { id: 'oa16', en: 'exit', cn: '出水', phonetic: '/ˈeɡzɪt/', level: 'OW', category: 'ow-safety' },
  { id: 'oa17', en: 'current', cn: '水流(流)', phonetic: '/ˈkʌrənt/', level: 'OW', category: 'ow-safety', example: 'There\'s a mild current today.', exampleCn: '今天有一点流。' },
  { id: 'oa18', en: 'surge', cn: '涌浪(来回涌动)', phonetic: '/sɜːdʒ/', level: 'OW', category: 'ow-safety', note: '浅水区把你推来推去的那种涌动' },
  { id: 'oa19', en: 'visibility (viz)', cn: '能见度', phonetic: '/ˌvɪzəˈbɪləti/', level: 'OW', category: 'ow-safety', example: 'Visibility is about 15 meters today.', exampleCn: '今天能见度大约 15 米。' },
  { id: 'oa20', en: 'thermocline', cn: '温跃层', phonetic: '/ˈθɜːməʊklaɪn/', level: 'OW', category: 'ow-safety', note: '水温突然下降的跃层,泰国有时 28°C 骤降到 24°C' },
  { id: 'oa21', en: 'water temperature', cn: '水温', level: 'OW', category: 'ow-safety' },
  { id: 'oa22', en: 'hypothermia', cn: '失温(低体温症)', phonetic: '/ˌhaɪpəʊˈθɜːmiə/', level: 'OW', category: 'ow-safety' },
  { id: 'oa23', en: 'overexertion', cn: '过度疲劳', phonetic: '/ˌəʊvərɪɡˈzɜːʃən/', level: 'OW', category: 'ow-safety' },
  { id: 'oa24', en: 'hyperventilation', cn: '过度换气', phonetic: '/ˌhaɪpəˌventɪˈleɪʃən/', level: 'OW', category: 'ow-safety', note: '下水前急促深呼吸,危险,不要做' },
  { id: 'oa25', en: 'lung overexpansion injury', cn: '肺部过度扩张伤害', level: 'OW', category: 'ow-safety', note: '憋气上升导致,最严重的气压伤' },
  { id: 'oa26', en: 'barotrauma', cn: '气压伤', phonetic: '/ˌbærəʊˈtrɔːmə/', level: 'OW', category: 'ow-safety', note: 'baro(压力)+ trauma(创伤)' },
  { id: 'oa27', en: 'decompression sickness (DCS)', cn: '减压病', level: 'OW', category: 'ow-safety', note: '口语也叫 the bends' },
  { id: 'oa28', en: 'nitrogen', cn: '氮气', phonetic: '/ˈnaɪtrədʒən/', level: 'OW', category: 'ow-safety' },
  { id: 'oa29', en: 'oxygen', cn: '氧气', phonetic: '/ˈɒksɪdʒən/', level: 'OW', category: 'ow-safety', note: '急救时常说 emergency oxygen(应急纯氧)' },
  { id: 'oa30', en: 'carbon dioxide (CO₂)', cn: '二氧化碳', level: 'OW', category: 'ow-safety' },
  { id: 'oa31', en: 'air embolism', cn: '空气栓塞', phonetic: '/ˈembəlɪzəm/', level: 'OW', category: 'ow-safety' },
  { id: 'oa32', en: 'reverse block', cn: '逆向挤压(上升时耳痛)', level: 'OW', category: 'ow-safety', note: '上升时耳咽管不通导致的疼痛,要停下或略下潜' },
  { id: 'oa33', en: 'vertigo', cn: '眩晕', phonetic: '/ˈvɜːtɪɡəʊ/', level: 'OW', category: 'ow-safety' },
  { id: 'oa34', en: 'panicked diver', cn: '恐慌的潜水员', phonetic: '/ˈpænɪkt/', level: 'OW', category: 'ow-safety' },
  { id: 'oa35', en: 'rescue breaths', cn: '救援呼吸(人工呼吸)', level: 'OW', category: 'ow-safety' },
  { id: 'oa36', en: 'half tank (100 bar)', cn: '半瓶气(100 bar)', level: 'OW', category: 'ow-safety', example: 'Signal your buddy at half tank.', exampleCn: '气到一半时给潜伴打手势。' },
  { id: 'oa37', en: 'reserve (50 bar)', cn: '残压 50 bar', phonetic: '/rɪˈzɜːv/', level: 'OW', category: 'ow-safety', note: '到 50 bar 通常就要结束潜水上水了' },
  { id: 'oa38', en: 'turn pressure', cn: '返程气压', level: 'OW', category: 'ow-safety', note: '到达这个气压就开始往回游' },
  { id: 'oa39', en: 'rock bottom', cn: '最低可用气量(保底气量)', level: 'OW', category: 'ow-safety', note: '两个人紧急共气回到水面所需的最小气量' },
  { id: 'oa40', en: 'dive within your limits', cn: '在你的能力范围内潜水', level: 'OW', category: 'ow-safety' },
]

// ======================= OW · 手势沟通 =======================
const OW_SIGNALS: VocabItem[] = [
  { id: 'og01', en: 'OK (signal)', cn: 'OK(手势)', level: 'OW', category: 'ow-signals', note: '水面:手放头顶画圈;水下:拇指食指成圈' },
  { id: 'og02', en: 'problem', cn: '有问题(手势)', level: 'OW', category: 'ow-signals', note: '手掌摊平左右晃动,再指向问题所在' },
  { id: 'og03', en: 'out of air (signal)', cn: '没气了(手势)', level: 'OW', category: 'ow-signals', note: '手掌平放,在喉咙前横切' },
  { id: 'og04', en: 'share air (signal)', cn: '共气(手势)', level: 'OW', category: 'ow-signals', note: '手指在嘴前来回指两人' },
  { id: 'og05', en: 'go up / ascend', cn: '上升(手势)', level: 'OW', category: 'ow-signals', note: '竖起大拇指向上' },
  { id: 'og06', en: 'go down / descend', cn: '下潜(手势)', level: 'OW', category: 'ow-signals', note: '大拇指向下' },
  { id: 'og07', en: 'stop', cn: '停(手势)', level: 'OW', category: 'ow-signals', note: '手掌向前推出,像交警' },
  { id: 'og08', en: 'watch me', cn: '看我(手势)', level: 'OW', category: 'ow-signals', note: '两指指向自己眼睛,再指向自己' },
  { id: 'og09', en: 'buddy / together', cn: '潜伴/一起(手势)', level: 'OW', category: 'ow-signals', note: '两根食指并排贴在一起' },
  { id: 'og10', en: 'How much air?', cn: '还有多少气?(手势)', level: 'OW', category: 'ow-signals', note: '两根手指在另一只手掌上轻点(像看表)' },
  { id: 'og11', en: 'half tank (signal)', cn: '半瓶气(手势)', level: 'OW', category: 'ow-signals', note: '竖起手指表示数字,或比划 100' },
  { id: 'og12', en: 'low on air', cn: '气不多了(手势)', level: 'OW', category: 'ow-signals', note: '握拳贴在胸前' },
  { id: 'og13', en: 'safety stop (signal)', cn: '安全停留(手势)', level: 'OW', category: 'ow-signals', note: '一只手平放(代表 5 米线),另一只手下压三指' },
  { id: 'og14', en: 'equalize (signal)', cn: '耳压问题(手势)', level: 'OW', category: 'ow-signals', note: '指着自己的耳朵,配合 problem 手势' },
  { id: 'og15', en: 'cold (signal)', cn: '冷(手势)', level: 'OW', category: 'ow-signals', note: '双臂交叉抱胸,摩擦上臂' },
  { id: 'og16', en: 'tired', cn: '累了(手势)', level: 'OW', category: 'ow-signals', note: '单手无力下垂摆动' },
  { id: 'og17', en: 'danger', cn: '危险(手势)', phonetic: '/ˈdeɪndʒər/', level: 'OW', category: 'ow-signals', note: '握拳(像 stop 但握拳),指向危险物' },
  { id: 'og18', en: 'ear problem', cn: '耳朵有问题(手势)', level: 'OW', category: 'ow-signals', note: 'problem 手势 + 指耳朵' },
  { id: 'og19', en: 'slow down', cn: '慢一点(手势)', level: 'OW', category: 'ow-signals', note: '手掌向下轻轻下压几次' },
  { id: 'og20', en: 'level off', cn: '保持这个深度(手势)', level: 'OW', category: 'ow-signals', note: '手掌平放,左右平移' },
  { id: 'og21', en: 'something is wrong', cn: '有点不对劲(手势)', level: 'OW', category: 'ow-signals', note: '通用 problem 手势,等对方指明哪里' },
  { id: 'og22', en: 'turn around', cn: '掉头/返回(手势)', level: 'OW', category: 'ow-signals', note: '食指画圈指向来的方向' },
  { id: 'og23', en: 'boat (signal)', cn: '船(手势)', level: 'OW', category: 'ow-signals', note: '双手合十成船底 V 形' },
  { id: 'og24', en: 'come here', cn: '过来(手势)', level: 'OW', category: 'ow-signals', note: '手指向自己方向勾动' },
]
VOCAB.push(...OW_SAFETY, ...OW_SIGNALS)

// ======================= AOW · 深潜 =======================
const AOW_DEEP: VocabItem[] = [
  { id: 'ad01', en: 'deep diving', cn: '深潜', level: 'AOW', category: 'aow-deep', example: 'The deep adventure dive takes you to 30 meters.', exampleCn: '深潜探险潜水会带你下到 30 米。' },
  { id: 'ad02', en: 'nitrogen narcosis', cn: '氮醉', phonetic: '/nɑːˈkəʊsɪs/', level: 'AOW', category: 'aow-deep', note: '30 米上下开始出现,像喝了点酒的感觉' },
  { id: 'ad03', en: 'rapture of the deep', cn: '深海狂喜(氮醉俗称)', phonetic: '/ˈræptʃər/', level: 'AOW', category: 'aow-deep' },
  { id: 'ad04', en: 'depth limit', cn: '深度限制', level: 'AOW', category: 'aow-deep', example: 'Your depth limit after AOW is 30 meters.', exampleCn: 'AOW 之后你的深度限制是 30 米。' },
  { id: 'ad05', en: 'air consumption', cn: '耗气量', phonetic: '/kənˈsʌmpʃən/', level: 'AOW', category: 'aow-deep', example: 'Air consumption increases with depth.', exampleCn: '耗气量随深度增加。' },
  { id: 'ad06', en: 'color absorption', cn: '(光的)颜色吸收', phonetic: '/əbˈzɔːpʃən/', level: 'AOW', category: 'aow-deep', note: '红色最先消失,所以深潜要对比色卡' },
  { id: 'ad07', en: 'ambient light', cn: '环境光', phonetic: '/ˈæmbiənt/', level: 'AOW', category: 'aow-deep' },
  { id: 'ad08', en: 'task loading', cn: '任务负荷', level: 'AOW', category: 'aow-deep', note: '一次潜水安排太多任务会让人手忙脚乱' },
  { id: 'ad09', en: 'gas planning', cn: '气体规划', level: 'AOW', category: 'aow-deep' },
  { id: 'ad10', en: 'contingency plan', cn: '应急预案', phonetic: '/kənˈtɪndʒənsi/', level: 'AOW', category: 'aow-deep' },
  { id: 'ad11', en: 'descent rate', cn: '下潜速度', level: 'AOW', category: 'aow-deep' },
  { id: 'ad12', en: 'ascent rate', cn: '上升速度', level: 'AOW', category: 'aow-deep', example: 'Watch your ascent rate on the computer.', exampleCn: '注意电脑表上的上升速度。' },
  { id: 'ad13', en: 'pony bottle', cn: '应急小气瓶', phonetic: '/ˈpəʊni/', level: 'AOW', category: 'aow-deep', note: '独立的小型备用气瓶' },
  { id: 'ad14', en: 'backup plan', cn: '备用计划', level: 'AOW', category: 'aow-deep' },
  { id: 'ad15', en: 'overhead environment', cn: '顶部封闭环境', phonetic: '/ˌəʊvəˈhed/', level: 'AOW', category: 'aow-deep', note: '洞穴、沉船内部等无法直接上升的环境' },
  { id: 'ad16', en: 'awareness', cn: '警觉性', phonetic: '/əˈweənəs/', level: 'AOW', category: 'aow-deep' },
  { id: 'ad17', en: 'pressure increases', cn: '压力增加', level: 'AOW', category: 'aow-deep', note: '每下潜 10 米,压力增加 1 个大气压' },
  { id: 'ad18', en: 'no-stop time', cn: '免停留时间', level: 'AOW', category: 'aow-deep', note: '与 NDL 同义,越深越短' },
]

// ======================= AOW · 水下导航 =======================
const AOW_NAV: VocabItem[] = [
  { id: 'an01', en: 'underwater navigation', cn: '水下导航', phonetic: '/ˌnævɪˈɡeɪʃən/', level: 'AOW', category: 'aow-nav', note: 'AOW 两个必修探险潜水之一(另一个是深潜)' },
  { id: 'an02', en: 'heading', cn: '航向', phonetic: '/ˈhedɪŋ/', level: 'AOW', category: 'aow-nav', example: 'Set your heading to 90 degrees.', exampleCn: '把航向设为 90 度。' },
  { id: 'an03', en: 'bearing', cn: '方位角', phonetic: '/ˈbeərɪŋ/', level: 'AOW', category: 'aow-nav' },
  { id: 'an04', en: 'reciprocal course', cn: '反向航向(原路返回)', phonetic: '/rɪˈsɪprəkəl/', level: 'AOW', category: 'aow-nav', note: '航向 ±180°,去程 90° 回程就是 270°' },
  { id: 'an05', en: 'natural navigation', cn: '自然导航', level: 'AOW', category: 'aow-nav', note: '用沙纹、坡度、光线等自然线索认路' },
  { id: 'an06', en: 'landmark', cn: '参照物/地标', level: 'AOW', category: 'aow-nav' },
  { id: 'an07', en: 'kick cycle', cn: '踢动周期(测距单位)', level: 'AOW', category: 'aow-nav', note: '双腿各踢一次算一个周期,用来估算游了多远' },
  { id: 'an08', en: 'distance estimation', cn: '距离估算', phonetic: '/ˌestɪˈmeɪʃən/', level: 'AOW', category: 'aow-nav' },
  { id: 'an09', en: 'square pattern', cn: '方形航迹', phonetic: '/ˈpætən/', level: 'AOW', category: 'aow-nav', note: '指北针导航课的经典练习' },
  { id: 'an10', en: 'out and back', cn: '往返式(导航)', level: 'AOW', category: 'aow-nav' },
  { id: 'an11', en: 'set the bezel', cn: '设定(指北针)表圈', phonetic: '/ˈbezəl/', level: 'AOW', category: 'aow-nav' },
  { id: 'an12', en: 'lubber line', cn: '基准线(指北针)', phonetic: '/ˈlʌbər/', level: 'AOW', category: 'aow-nav' },
  { id: 'an13', en: 'sand ripples', cn: '沙纹', phonetic: '/ˈrɪpəlz/', level: 'AOW', category: 'aow-nav', note: '沙纹通常与海岸线平行,是天然路标' },
  { id: 'an14', en: 'follow the contour', cn: '沿着地形轮廓走', phonetic: '/ˈkɒntʊər/', level: 'AOW', category: 'aow-nav' },
  { id: 'an15', en: 'navigate back', cn: '导航返回', level: 'AOW', category: 'aow-nav', example: 'Can you navigate back to the boat?', exampleCn: '你能导航回到船上吗?' },
  { id: 'an16', en: 'get lost', cn: '迷路', level: 'AOW', category: 'aow-nav', note: '迷路处理:原地找一圈,找不到就安全升水' },
]

// ======================= AOW · 专长潜水 =======================
const AOW_ELEC: VocabItem[] = [
  { id: 'ae01', en: 'night diving', cn: '夜潜', level: 'AOW', category: 'aow-elec', example: 'Night diving is my favorite adventure dive.', exampleCn: '夜潜是我最喜欢的探险潜水。' },
  { id: 'ae02', en: 'primary light', cn: '主灯', phonetic: '/ˈpraɪməri/', level: 'AOW', category: 'aow-elec' },
  { id: 'ae03', en: 'backup light', cn: '备用灯', level: 'AOW', category: 'aow-elec' },
  { id: 'ae04', en: 'light signals', cn: '灯光信号', level: 'AOW', category: 'aow-elec', note: '画圈 = OK;快速晃动 = 注意;上下扫 = 过来' },
  { id: 'ae05', en: 'circle (light signal)', cn: '画圈(灯光 OK)', phonetic: '/ˈsɜːkəl/', level: 'AOW', category: 'aow-elec' },
  { id: 'ae06', en: 'wreck diving', cn: '沉船潜水', phonetic: '/rek/', level: 'AOW', category: 'aow-elec' },
  { id: 'ae07', en: 'penetration', cn: '(进入船体)穿透', phonetic: '/ˌpenɪˈtreɪʃən/', level: 'AOW', category: 'aow-elec', note: '未经专长训练不要进入沉船内部' },
  { id: 'ae08', en: 'silt', cn: '淤泥/沉渣', level: 'AOW', category: 'aow-elec', note: '脚蹼一踢就扬起来,能见度瞬间归零' },
  { id: 'ae09', en: 'sharp edges', cn: '锋利的边缘', level: 'AOW', category: 'aow-elec', note: '沉船潜水要戴手套的原因之一' },
  { id: 'ae10', en: 'entanglement', cn: '缠绕', phonetic: '/ɪnˈtæŋɡəlmənt/', level: 'AOW', category: 'aow-elec', note: '渔网、缆绳都可能造成缠绕' },
  { id: 'ae11', en: 'drift diving', cn: '放流潜水', level: 'AOW', category: 'aow-elec', example: 'Drift diving means the boat follows your bubbles.', exampleCn: '放流潜水时船会跟着你的气泡走。' },
  { id: 'ae12', en: 'negative entry', cn: '负浮力入水', phonetic: '/ˈneɡətɪv/', level: 'AOW', category: 'aow-elec', note: '强流时用:BCD 放空,入水立刻下潜' },
  { id: 'ae13', en: 'reef hook', cn: '流钩', level: 'AOW', category: 'aow-elec', note: '挂在礁石缝隙里固定自己看鲨鱼用,注意别挂珊瑚' },
  { id: 'ae14', en: 'tag line', cn: '牵引绳', level: 'AOW', category: 'aow-elec' },
  { id: 'ae15', en: 'down line', cn: '下潜绳', level: 'AOW', category: 'aow-elec', note: '从船放到水底的绳子,顺绳下潜' },
  { id: 'ae16', en: 'mooring line', cn: '系泊绳', phonetic: '/ˈmɔːrɪŋ/', level: 'AOW', category: 'aow-elec' },
  { id: 'ae17', en: 'boat diving', cn: '船潜', level: 'AOW', category: 'aow-elec', note: '对应 shore diving(岸潜)' },
  { id: 'ae18', en: 'dive deck', cn: '潜水甲板(平台)', level: 'AOW', category: 'aow-elec' },
  { id: 'ae19', en: 'ladder', cn: '梯子', phonetic: '/ˈlædər/', level: 'AOW', category: 'aow-elec' },
  { id: 'ae20', en: 'safety sausage', cn: '象拔(口语说法)', level: 'AOW', category: 'aow-elec', note: '就是 SMB,泰国船上常听到' },
  { id: 'ae21', en: 'DSMB (delayed surface marker buoy)', cn: '延迟水面浮标', phonetic: '/dɪˈleɪd/', level: 'AOW', category: 'aow-elec', note: '在水下(安全停留时)打上去的浮标' },
  { id: 'ae22', en: 'lift bag', cn: '浮力袋', level: 'AOW', category: 'aow-elec', note: '搜索与打捞专长用的提物浮袋' },
  { id: 'ae23', en: 'peak performance buoyancy', cn: '顶尖中性浮力(专长)', level: 'AOW', category: 'aow-elec', note: '简称 PPB,很多教练推荐的专长' },
  { id: 'ae24', en: 'trim', cn: '(身体)姿态/配平', level: 'AOW', category: 'aow-elec', note: '保持水平流线型身体姿态' },
  { id: 'ae25', en: 'frog kick', cn: '蛙式踢水', level: 'AOW', category: 'aow-elec', note: '不扬沙、效率高,进阶踢法' },
  { id: 'ae26', en: 'enriched air (nitrox)', cn: '高氧空气', phonetic: '/ˈnaɪtrɒks/', level: 'AOW', category: 'aow-elec', example: 'Enriched air extends your no-stop time.', exampleCn: '高氧能延长你的免停留时间。' },
  { id: 'ae27', en: 'oxygen exposure', cn: '氧暴露', phonetic: '/ɪkˈspəʊʒər/', level: 'AOW', category: 'aow-elec' },
  { id: 'ae28', en: 'maximum operating depth (MOD)', cn: '最大操作深度', level: 'AOW', category: 'aow-elec', note: '高氧潜水的深度上限,由氧分压决定' },
  { id: 'ae29', en: 'analyze your tank', cn: '检测你的气瓶', phonetic: '/ˈænəlaɪz/', level: 'AOW', category: 'aow-elec', note: '高氧潜水前必须亲自测氧含量' },
  { id: 'ae30', en: 'multilevel dive', cn: '多层深度潜水', phonetic: '/ˌmʌltiˈlevəl/', level: 'AOW', category: 'aow-elec', note: '先深后浅,延长水底时间' },
  { id: 'ae31', en: 'underwater photography', cn: '水下摄影', phonetic: '/fəˈtɒɡrəfi/', level: 'AOW', category: 'aow-elec' },
  { id: 'ae32', en: 'fish identification', cn: '鱼类识别', phonetic: '/aɪˌdentɪfɪˈkeɪʃən/', level: 'AOW', category: 'aow-elec' },
]

// ======================= AOW · 海洋环境 =======================
const AOW_ENV: VocabItem[] = [
  { id: 'av01', en: 'coral reef', cn: '珊瑚礁', phonetic: '/ˈkɒrəl/', level: 'AOW', category: 'aow-env', example: 'Don\'t touch the coral reef.', exampleCn: '不要碰珊瑚礁。' },
  { id: 'av02', en: 'marine life', cn: '海洋生物', phonetic: '/məˈriːn/', level: 'AOW', category: 'aow-env' },
  { id: 'av03', en: 'reef fish', cn: '珊瑚礁鱼类', level: 'AOW', category: 'aow-env' },
  { id: 'av04', en: 'turtle', cn: '海龟', phonetic: '/ˈtɜːtəl/', level: 'AOW', category: 'aow-env', note: '泰国涛岛、皮皮岛很常见' },
  { id: 'av05', en: 'shark', cn: '鲨鱼', phonetic: '/ʃɑːk/', level: 'AOW', category: 'aow-env', note: '黑鳍礁鲨 blacktip reef shark' },
  { id: 'av06', en: 'moray eel', cn: '海鳗', phonetic: '/ˈmɒreɪ iːl/', level: 'AOW', category: 'aow-env' },
  { id: 'av07', en: 'nudibranch', cn: '海蛞蝓(海兔)', phonetic: '/ˈnjuːdɪbræŋk/', level: 'AOW', category: 'aow-env', note: '水下摄影爱好者的小可爱' },
  { id: 'av08', en: 'stingray', cn: '魟鱼', phonetic: '/ˈstɪŋreɪ/', level: 'AOW', category: 'aow-env', note: '常埋在沙里,注意别踩到' },
  { id: 'av09', en: 'lionfish', cn: '狮子鱼', phonetic: '/ˈlaɪənfɪʃ/', level: 'AOW', category: 'aow-env', note: '鳍条有毒,远远欣赏就好' },
  { id: 'av10', en: 'clownfish', cn: '小丑鱼', phonetic: '/ˈklaʊnfɪʃ/', level: 'AOW', category: 'aow-env', note: '就是"尼莫",住在海葵里' },
  { id: 'av11', en: 'barracuda', cn: '梭鱼(海狼)', phonetic: '/ˌbærəˈkjuːdə/', level: 'AOW', category: 'aow-env' },
  { id: 'av12', en: 'whale shark', cn: '鲸鲨', phonetic: '/weɪl/', level: 'AOW', category: 'aow-env', note: '泰国春蓬、斯米兰的幸运彩蛋' },
  { id: 'av13', en: 'manta ray', cn: '蝠鲼', phonetic: '/ˈmæntə/', level: 'AOW', category: 'aow-env' },
  { id: 'av14', en: 'sea urchin', cn: '海胆', phonetic: '/ˈɜːtʃɪn/', level: 'AOW', category: 'aow-env' },
  { id: 'av15', en: 'jellyfish', cn: '水母', phonetic: '/ˈdʒelifɪʃ/', level: 'AOW', category: 'aow-env' },
  { id: 'av16', en: 'triggerfish', cn: '扳机鱼', phonetic: '/ˈtrɪɡəfɪʃ/', level: 'AOW', category: 'aow-env', note: '筑巢期有攻击性,会追着咬脚蹼' },
  { id: 'av17', en: 'anemone', cn: '海葵', phonetic: '/əˈneməni/', level: 'AOW', category: 'aow-env' },
  { id: 'av18', en: "don't touch", cn: '不要触摸(任何东西)', level: 'AOW', category: 'aow-env', note: '水下第一守则:只拍照,只留气泡' },
  { id: 'av19', en: 'finning technique', cn: '踢水技巧', phonetic: '/tekˈniːk/', level: 'AOW', category: 'aow-env', note: '靠近珊瑚时小幅度慢踢,避免扬沙打坏珊瑚' },
  { id: 'av20', en: 'tide', cn: '潮汐', phonetic: '/taɪd/', level: 'AOW', category: 'aow-env' },
  { id: 'av21', en: 'wave', cn: '浪', phonetic: '/weɪv/', level: 'AOW', category: 'aow-env' },
  { id: 'av22', en: 'ecosystem', cn: '生态系统', phonetic: '/ˈiːkəʊsɪstəm/', level: 'AOW', category: 'aow-env' },
]
VOCAB.push(...AOW_DEEP, ...AOW_NAV, ...AOW_ELEC, ...AOW_ENV)

// ======================= 表达 · 课程沟通 =======================
const PHRASE_COURSE: VocabItem[] = [
  { id: 'pc01', en: "I'd like to check in for the AOW course.", cn: '我来报到 AOW 课程。', level: 'PHRASE', category: 'phrase-course', note: '到潜店第一句话' },
  { id: 'pc02', en: 'I got my OW certification in China.', cn: '我的 OW 证书是在国内考的。', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc03', en: "Here's my certification card and logbook.", cn: '这是我的证书和潜水日志。', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc04', en: 'I have logged 20 dives.', cn: '我有 20 潜的记录。', level: 'PHRASE', category: 'phrase-course', note: 'log a dive = 记录一潜' },
  { id: 'pc05', en: "It's been a while since my last dive.", cn: '我有一阵子没潜了。', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc06', en: 'Can I do a refresher first?', cn: '我可以先做一次复习潜吗?', phonetic: '/rɪˈfreʃər/', level: 'PHRASE', category: 'phrase-course', note: '超过半年没潜,主动要求 refresher 很加分' },
  { id: 'pc07', en: 'How much weight do I need?', cn: '我需要多少配重?', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc08', en: 'Can I rent a dive computer?', cn: '我可以租一块潜水电脑表吗?', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc09', en: "What's the dive plan today?", cn: '今天的潜水计划是什么?', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc10', en: "What's the maximum depth?", cn: '最大深度是多少?', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc11', en: 'How long is the bottom time?', cn: '水底时间有多长?', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc12', en: 'Who is my buddy?', cn: '谁是我的潜伴?', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc13', en: 'Could you speak a little slower?', cn: '你可以说慢一点吗?', level: 'PHRASE', category: 'phrase-course', note: '听不懂时最有用的一句' },
  { id: 'pc14', en: 'What does this word mean?', cn: '这个词是什么意思?', level: 'PHRASE', category: 'phrase-course' },
  { id: 'pc15', en: 'Let me make sure I understand.', cn: '让我确认一下我理解了。', level: 'PHRASE', category: 'phrase-course', note: '安全关键信息一定要复述确认' },
  { id: 'pc16', en: 'Could you repeat that, please?', cn: '能请你再说一遍吗?', level: 'PHRASE', category: 'phrase-course' },
]

// ======================= 表达 · 船上日常 =======================
const PHRASE_BOAT: VocabItem[] = [
  { id: 'pb01', en: 'Where do I set up my gear?', cn: '我在哪里组装装备?', phonetic: '/ɡɪər/', level: 'PHRASE', category: 'phrase-boat', note: 'set up gear = 组装装备' },
  { id: 'pb02', en: 'When do we splash?', cn: '我们什么时候下水?', level: 'PHRASE', category: 'phrase-boat', note: 'splash 是船潜俚语,意为"下水"' },
  { id: 'pb03', en: 'Is there a current today?', cn: '今天有流吗?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb04', en: "What's the visibility like?", cn: '能见度怎么样?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb05', en: "What's the water temperature?", cn: '水温多少?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb06', en: 'Giant stride or back roll?', cn: '跨步式还是背滚式入水?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb07', en: "I'll do a back roll entry.", cn: '我会用背滚式入水。', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb08', en: 'Where do we meet after the dive?', cn: '潜完之后我们在哪里汇合?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb09', en: 'Which way is the reef?', cn: '珊瑚礁在哪个方向?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb10', en: 'How do we get back to the boat?', cn: '我们怎么回到船上?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb11', en: 'Hold the line, please.', cn: '请抓住绳子。', level: 'PHRASE', category: 'phrase-boat', note: '有流时上下水都要抓绳' },
  { id: 'pb12', en: 'Watch your head.', cn: '小心碰头。', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb13', en: "I'm ready.", cn: '我准备好了。', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb14', en: 'My tank feels loose, can you check it?', cn: '我的气瓶有点松,能帮我看一下吗?', level: 'PHRASE', category: 'phrase-boat' },
  { id: 'pb15', en: 'Thank you, that was a great dive!', cn: '谢谢,这趟潜水太棒了!', level: 'PHRASE', category: 'phrase-boat', note: '潜完别忘了夸导潜,泰国潜圈很吃这一套' },
]

// ======================= 表达 · 紧急状况 =======================
const PHRASE_EMERGENCY: VocabItem[] = [
  { id: 'pe01', en: "I'm out of air!", cn: '我没气了!', level: 'PHRASE', category: 'phrase-emergency', note: '水下用手势,水面直接喊出来' },
  { id: 'pe02', en: 'Help, please!', cn: '请帮帮我!', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe03', en: 'I feel dizzy.', cn: '我头晕。', phonetic: '/ˈdɪzi/', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe04', en: 'I feel nauseous.', cn: '我想吐。', phonetic: '/ˈnɔːziəs/', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe05', en: 'My ears hurt.', cn: '我耳朵疼。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe06', en: "I can't equalize.", cn: '我平衡不了耳压。', level: 'PHRASE', category: 'phrase-emergency', note: '说这句,教练会停下来等你' },
  { id: 'pe07', en: 'I lost my buddy.', cn: '我跟潜伴走散了。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe08', en: "I'm cold.", cn: '我很冷。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe09', en: 'I have a cramp.', cn: '我抽筋了。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe10', en: "I'm tired.", cn: '我累了。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe11', en: 'I need to end the dive.', cn: '我需要结束这次潜水。', level: 'PHRASE', category: 'phrase-emergency', note: '任何不适都可以终止潜水,这不丢人' },
  { id: 'pe12', en: "I'm not feeling well.", cn: '我感觉不太舒服。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe13', en: 'Something is wrong with my regulator.', cn: '我的调节器有问题。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe14', en: 'My BCD keeps inflating.', cn: '我的 BCD 一直在自动充气。', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe15', en: 'I have a headache.', cn: '我头疼。', phonetic: '/ˈhedeɪk/', level: 'PHRASE', category: 'phrase-emergency' },
  { id: 'pe16', en: 'I need a minute.', cn: '我需要缓一下。', level: 'PHRASE', category: 'phrase-emergency' },
]
VOCAB.push(...PHRASE_COURSE, ...PHRASE_BOAT, ...PHRASE_EMERGENCY)

// ---------- helpers ----------
export const TOTAL = VOCAB.length

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export const LEVEL_LABEL: Record<Level, string> = {
  OW: 'OW 复习',
  AOW: 'AOW 预习',
  PHRASE: '实用表达',
}
