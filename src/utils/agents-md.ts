import {
  RCS_MODELS_END_MARKER,
  RCS_MODELS_START_MARKER,
} from './agents-model-table.js'

export const RCS_GENERATED_AGENTS_MARKER = '<!-- rcs:generated:agents-md -->'
export const RCS_MANAGED_AGENTS_START_MARKER = '<!-- RCS:AGENTS:START -->'
export const RCS_MANAGED_AGENTS_END_MARKER = '<!-- RCS:AGENTS:END -->'
const AUTONOMY_DIRECTIVE_END_MARKER = '<!-- END AUTONOMY DIRECTIVE -->'

export function isRcsGeneratedAgentsMd(content: string): boolean {
  return content.includes(RCS_GENERATED_AGENTS_MARKER)
}

export function hasRcsManagedAgentsSections(content: string): boolean {
  return (
    isRcsGeneratedAgentsMd(content) ||
    (content.includes(RCS_MANAGED_AGENTS_START_MARKER) &&
      content.includes(RCS_MANAGED_AGENTS_END_MARKER)) ||
    (content.includes(RCS_MODELS_START_MARKER) &&
      content.includes(RCS_MODELS_END_MARKER))
  )
}

export function upsertManagedAgentsBlock(
  existingContent: string,
  managedContent: string,
): string {
  const normalizedExisting = existingContent.endsWith('\n')
    ? existingContent
    : `${existingContent}\n`
  const normalizedManaged = managedContent.endsWith('\n')
    ? managedContent
    : `${managedContent}\n`
  const block = [
    RCS_MANAGED_AGENTS_START_MARKER,
    normalizedManaged.trimEnd(),
    RCS_MANAGED_AGENTS_END_MARKER,
  ].join('\n')

  const startIndex = normalizedExisting.indexOf(RCS_MANAGED_AGENTS_START_MARKER)
  const endIndex = normalizedExisting.indexOf(RCS_MANAGED_AGENTS_END_MARKER)

  if (startIndex >= 0 && endIndex > startIndex) {
    const replaceEnd = endIndex + RCS_MANAGED_AGENTS_END_MARKER.length
    const next = `${normalizedExisting.slice(0, startIndex)}${block}${normalizedExisting.slice(replaceEnd)}`
    return next.endsWith('\n') ? next : `${next}\n`
  }

  return `${normalizedExisting.trimEnd()}\n\n${block}\n`
}

export function addGeneratedAgentsMarker(content: string): string {
  if (content.includes(RCS_GENERATED_AGENTS_MARKER)) return content

  const autonomyDirectiveEnd = content.indexOf(AUTONOMY_DIRECTIVE_END_MARKER)
  if (autonomyDirectiveEnd >= 0) {
    const insertAt = autonomyDirectiveEnd + AUTONOMY_DIRECTIVE_END_MARKER.length
    const hasImmediateNewline = content[insertAt] === '\n'
    const insertionPoint = hasImmediateNewline ? insertAt + 1 : insertAt
    return (
      content.slice(0, insertionPoint) +
      `${RCS_GENERATED_AGENTS_MARKER}\n` +
      content.slice(insertionPoint)
    )
  }

  const firstNewline = content.indexOf('\n')
  if (firstNewline === -1) {
    return `${content}\n${RCS_GENERATED_AGENTS_MARKER}\n`
  }

  return (
    content.slice(0, firstNewline + 1) +
    `${RCS_GENERATED_AGENTS_MARKER}\n` +
    content.slice(firstNewline + 1)
  )
}
