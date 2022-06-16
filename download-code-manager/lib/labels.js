import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const labelsDirectory = path.join(process.cwd(), 'labels')

export function getSortedLabelData() {
  const fileNames = fs.readdirSync(labelsDirectory)
  const allLabelData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(labelsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    return {
      id,
      ...matterResult.data
    }
  })
  return allLabelData
}
