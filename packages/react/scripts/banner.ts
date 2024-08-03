import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const distPath = path.resolve(__dirname, '../dist')

const targets = ['index.cjs', 'index.mjs']

targets.forEach((target) => {
  const filePath = `${distPath}/${target}`
  const code = readFileSync(filePath, 'utf8')

  writeFileSync(filePath, `"use client";\n`)
  appendFileSync(filePath, code)
})
