import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const distPath = path.resolve(__dirname, '../dist')

const targets = ['index.cjs', 'index.mjs']

targets.forEach((target) => {
  const code = readFileSync(`${distPath}/${target}`, 'utf8')

  writeFileSync(`${distPath}/index.cjs`, `"use client;"\n`)
  appendFileSync(`${distPath}/index.cjs`, code)
})
