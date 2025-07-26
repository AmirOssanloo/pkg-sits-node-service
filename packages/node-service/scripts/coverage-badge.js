#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read coverage summary
const coveragePath = join(__dirname, '../coverage/coverage-summary.json')
let coverage

try {
  const coverageData = readFileSync(coveragePath, 'utf8')
  coverage = JSON.parse(coverageData)
} catch (error) {
  console.error('Could not read coverage summary. Run tests with coverage first.')
  process.exit(1)
}

// Get total coverage percentage
const total = coverage.total
const percentage = Math.round(
  (total.lines.pct + total.statements.pct + total.functions.pct + total.branches.pct) / 4
)

// Determine color based on percentage
let color
if (percentage >= 90) {
  color = 'brightgreen'
} else if (percentage >= 80) {
  color = 'green'
} else if (percentage >= 70) {
  color = 'yellow'
} else if (percentage >= 60) {
  color = 'orange'
} else {
  color = 'red'
}

// Generate badge URL
const badgeUrl = `https://img.shields.io/badge/coverage-${percentage}%25-${color}`

// Update README with badge
const readmePath = join(__dirname, '../README.md')
let readme

try {
  readme = readFileSync(readmePath, 'utf8')
} catch (error) {
  console.error('Could not read README.md')
  process.exit(1)
}

// Replace or add coverage badge
const badgeRegex = /\[!\[Coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-\d+%25-\w+\)\]/
const newBadge = `[![Coverage](${badgeUrl})]`

if (badgeRegex.test(readme)) {
  readme = readme.replace(badgeRegex, newBadge)
} else {
  // Add after the first heading
  readme = readme.replace(/^(#.*\n)/, `$1\n${newBadge}\n`)
}

writeFileSync(readmePath, readme)

console.log(`Coverage badge updated: ${percentage}% (${color})`)