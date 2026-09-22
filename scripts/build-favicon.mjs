/**
 * 由 public/ 下的 16/32/48 PNG 合成多尺寸 favicon.ico（ICO 容器内嵌 PNG，无第三方依赖）
 * 用法：node scripts/build-favicon.mjs
 * 说明：PNG 载荷格式兼容 Vista 及以上所有现代浏览器
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const PUBLIC_DIR = resolve(process.cwd(), 'public')
const SIZES = [16, 32, 48]

const pngs = await Promise.all(
  SIZES.map((s) => readFile(resolve(PUBLIC_DIR, `favicon-${s}x${s}.png`)))
)

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // 保留位
header.writeUInt16LE(1, 2) // 类型：图标
header.writeUInt16LE(SIZES.length, 4) // 图片数量

const dirEntries = []
let offset = 6 + SIZES.length * 16
SIZES.forEach((size, i) => {
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size, 0) // 宽（256 用 0 表示）
  entry.writeUInt8(size, 1) // 高
  entry.writeUInt8(0, 2) // 调色板数
  entry.writeUInt8(0, 3) // 保留
  entry.writeUInt16LE(1, 4) // 色彩平面
  entry.writeUInt16LE(32, 6) // 位深
  entry.writeUInt32LE(pngs[i].length, 8) // 数据大小
  entry.writeUInt32LE(offset, 12) // 数据偏移
  offset += pngs[i].length
  dirEntries.push(entry)
})

const ico = Buffer.concat([header, ...dirEntries, ...pngs])
await writeFile(resolve(PUBLIC_DIR, 'favicon.ico'), ico)
console.log(`favicon.ico generated: ${ico.length} bytes, sizes=${SIZES.join('/')}`)
