import type { Style } from './types'

export type StyleAspect = '3/4' | '4/5' | '1/1' | '5/6'

export type StyleMeta = {
  label: string
  tagline: string
  description: string
  keywords: string[]
  gradient: [string, string, string]
  aspect: StyleAspect
}

export const STYLE_META: Record<Style, StyleMeta> = {
  pixel: {
    label: '像素风',
    tagline: '16-bit · 硬边方格',
    description: '把画面压回到 16 位机时代：有限调色板、无抗锯齿的方形像素、锐利的轮廓边缘。适合把人像、宠物或城市街景转成能塞进复古掌机的画面，怀旧感和几何感并存。',
    keywords: ['像素艺术', '16-bit', '复古'],
    gradient: ['#4f46e5', '#ec4899', '#f59e0b'],
    aspect: '4/5',
  },
  oil: {
    label: '油画',
    tagline: '厚涂笔触 · 沙金调',
    description: '厚重的 impasto 笔触堆叠出体积感，配合温暖的赭石与暖褐调，呼应 John Singer Sargent 的肖像语言。画面里能看得见颜料的物质性，光在皮肤和布料上像糖浆一样流。',
    keywords: ['厚涂', '古典肖像', '暖色调'],
    gradient: ['#7c2d12', '#c2410c', '#fbbf24'],
    aspect: '3/4',
  },
  surreal: {
    label: '超现实',
    tagline: '融化的边缘 · 黄昏梦境',
    description: '致敬达利：轮廓像蜡一样缓慢融化，影子被拉成不合物理的长条，色调停在一个说不清是黎明还是黄昏的时刻。原图的构图和人物还在，但一切都轻微地错位、飘浮。',
    keywords: ['达利', '梦境', '错位'],
    gradient: ['#312e81', '#7c3aed', '#f472b6'],
    aspect: '4/5',
  },
  fauvism: {
    label: '野兽派',
    tagline: '非自然色 · 黑色轮廓',
    description: '马蒂斯的野兽派：翠绿、灼橙、钴蓝以非写实的方式泼在画面上，粗黑线条包裹每一块平涂色块。色彩不再服务于真实，而是直接是情绪本身。',
    keywords: ['马蒂斯', '平涂', '高饱和'],
    gradient: ['#059669', '#f97316', '#1d4ed8'],
    aspect: '1/1',
  },
  watercolor: {
    label: '水彩',
    tagline: '湿画法 · 纸纤维',
    description: '颜料在潮湿的纸上晕开，边缘是柔和的渗透而不是硬线。留白被有意保留，能看到水痕、颗粒沉淀和纸张纤维的呼吸感。适合表现清晨的光线和轻柔的表情。',
    keywords: ['湿画法', '透明', '手绘'],
    gradient: ['#7dd3fc', '#c4b5fd', '#fda4af'],
    aspect: '5/6',
  },
  ukiyoe: {
    label: '浮世绘',
    tagline: '木刻线 · 江户色板',
    description: '江户木版画的语言：粗细分明的墨线、平铺的靛蓝与朱红、留白的天空、云纹与波涛用程式化的图案表达。原本的现代场景会被翻译成葛饰北斋能理解的秩序。',
    keywords: ['木版画', '葛饰北斋', '江户'],
    gradient: ['#1e3a8a', '#f5f5f4', '#b91c1c'],
    aspect: '3/4',
  },
  cyberpunk: {
    label: '赛博朋克',
    tagline: '霓虹 · 雨夜 · 反光',
    description: '2077 的夜色：品红与青蓝的霓虹在湿沥青上折射，全息广告漂浮在窄巷之上，人物皮肤上落着屏幕的光。高对比、深阴影、被雨模糊的远景。',
    keywords: ['霓虹', 'Neo-Noir', '未来'],
    gradient: ['#0f172a', '#c026d3', '#06b6d4'],
    aspect: '4/5',
  },
  anime: {
    label: '二次元',
    tagline: '赛璐璐 · 大眼线稿',
    description: '日式赛璐璐动画的画法：干净的墨线勾轮廓，头发和眼睛是有限的几段色块，脸颊上有一小片高光。整体像刚从某部深夜番剧里截下来的一帧。',
    keywords: ['赛璐璐', '动漫', '线稿'],
    gradient: ['#fb7185', '#fbbf24', '#60a5fa'],
    aspect: '5/6',
  },
  comic: {
    label: '美漫',
    tagline: '网点 · 粗线 · 分格感',
    description: '致敬美国漫画黄金时代：Ben-Day 网点作为阴影，粗黑轮廓包住每个形体，色彩用四色印刷的原始感表达。人物像随时会从画格里跳出来说一句 "POW"。',
    keywords: ['网点', 'Ben-Day', 'Pop Art'],
    gradient: ['#ef4444', '#facc15', '#1e40af'],
    aspect: '4/5',
  },
  sketch: {
    label: '铅笔素描',
    tagline: '石墨 · 明暗排线',
    description: '一张精细的铅笔稿：石墨在纸上的颗粒能看清楚，明暗用排线和交叉线堆出来，边缘有的地方留了轻微的轮廓草稿线。整体是灰阶的，克制而专注。',
    keywords: ['素描', '灰阶', '排线'],
    gradient: ['#525252', '#a3a3a3', '#f5f5f5'],
    aspect: '3/4',
  },
  lego: {
    label: '乐高',
    tagline: '塑料光泽 · 圆凸点',
    description: '整个世界被拆成乐高积木：每个形体都由带凸点的方块搭成，塑料表面有轻微的高光反射，接缝清晰可见。小到手指、大到建筑都被翻译成积木的语法。',
    keywords: ['积木', '玩具', '塑料'],
    gradient: ['#dc2626', '#fbbf24', '#2563eb'],
    aspect: '1/1',
  },
  claymation: {
    label: '黏土定格',
    tagline: '指纹 · 哑光 · Aardman',
    description: '像 Aardman 工作室的定格动画：所有材质都是黏土，能看到艺术家指纹留下的凹痕，表面是哑光的，边缘略微不完美。人物的眼睛也是两颗小小的黏土球。',
    keywords: ['定格', 'Aardman', '黏土'],
    gradient: ['#a3e635', '#f97316', '#ec4899'],
    aspect: '5/6',
  },
  lowpoly: {
    label: 'Low Poly',
    tagline: '三角面 · 平面着色',
    description: '整个画面被切分成三角形面片，每个三角形是一个平坦的颜色，没有渐变也没有纹理。光影通过面与面之间的色差表达。极简、干净、几何。',
    keywords: ['三角面', '几何', '3D'],
    gradient: ['#0ea5e9', '#a855f7', '#f43f5e'],
    aspect: '4/5',
  },
  vaporwave: {
    label: '蒸汽波',
    tagline: '粉紫夕阳 · 网格地平线',
    description: '90 年代日式购物中心的美学：粉与紫的夕阳、发光的网格地平线、罗马柱和 CRT 扫描线。画面像一段过曝的 VHS 截图，带着一种忧伤又滑稽的怀旧。',
    keywords: ['Vaporwave', '90s', 'CRT'],
    gradient: ['#f0abfc', '#a78bfa', '#22d3ee'],
    aspect: '3/4',
  },
  cubism: {
    label: '立体主义',
    tagline: '多视角 · 几何切分',
    description: '毕加索式的立体主义：脸和身体被同时从多个角度呈现，几何面片相互堆叠，色彩克制在赭石、灰蓝和土绿之间。看似破碎，但结构关系比写实更接近本质。',
    keywords: ['毕加索', '多视角', '几何'],
    gradient: ['#78716c', '#0f766e', '#b45309'],
    aspect: '1/1',
  },
}
