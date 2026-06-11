import { useMemo } from 'react'

interface DiffItem {
  type: 'added' | 'removed' | 'unchanged'
  value: string
}

// Simple Longest Common Subsequence (LCS) line-by-line diffing algorithm
function diffLines(oldStr: string, newStr: string): DiffItem[] {
  const oldLines = (oldStr || '').split('\n')
  const newLines = (newStr || '').split('\n')
  
  const oldLen = oldLines.length
  const newLen = newLines.length
  
  // Matrix for LCS
  const matrix: number[][] = Array(oldLen + 1).fill(0).map(() => Array(newLen + 1).fill(0))
  
  for (let i = 1; i <= oldLen; i++) {
    for (let j = 1; j <= newLen; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1])
      }
    }
  }
  
  // Backtrack to find diff
  const result: DiffItem[] = []
  let i = oldLen
  let j = newLen
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: 'unchanged', value: oldLines[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      result.unshift({ type: 'added', value: newLines[j - 1] })
      j--
    } else {
      result.unshift({ type: 'removed', value: oldLines[i - 1] })
      i--
    }
  }
  
  return result
}

interface DiffVisualizerProps {
  original: string
  modified: string
  theme: 'dark' | 'light'
}

export function DiffVisualizer({ original, modified, theme }: DiffVisualizerProps) {
  const diffs = useMemo(() => {
    return diffLines(original, modified)
  }, [original, modified])

  return (
    <div className={`w-full max-h-56 overflow-y-auto border rounded-lg font-mono text-xs p-3 custom-scrollbar leading-relaxed ${
      theme === 'dark'
        ? 'bg-bg-darkSecondary border-border-dark text-text-darkPrimary'
        : 'bg-bg-lightSecondary border-border-light text-text-lightPrimary'
    }`}>
      <div className="flex items-center space-x-4 mb-2 pb-2 border-b border-gray-500/20 text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500">
        <span>Visual Diff View</span>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 bg-green-500/20 border border-green-500 rounded" />
          <span>Added</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 bg-red-500/20 border border-red-500 rounded" />
          <span>Removed</span>
        </div>
      </div>

      <div className="space-y-0.5">
        {diffs.map((item, index) => {
          if (item.type === 'added') {
            return (
              <div key={index} className="flex bg-green-500/10 text-green-400 py-0.5 px-1.5 rounded">
                <span className="w-4 select-none opacity-50">+</span>
                <span className="flex-1 whitespace-pre-wrap">{item.value || ' '}</span>
              </div>
            )
          } else if (item.type === 'removed') {
            return (
              <div key={index} className="flex bg-red-500/10 text-red-400 py-0.5 px-1.5 rounded">
                <span className="w-4 select-none opacity-50">-</span>
                <span className="flex-1 whitespace-pre-wrap">{item.value || ' '}</span>
              </div>
            )
          } else {
            return (
              <div key={index} className="flex py-0.5 px-1.5 opacity-80">
                <span className="w-4 select-none opacity-30"> </span>
                <span className="flex-1 whitespace-pre-wrap">{item.value || ' '}</span>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default DiffVisualizer
