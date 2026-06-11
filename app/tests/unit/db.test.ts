import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { dbService } from '../../src/main/services/database'

describe('Lumina Database Manager Unit Tests', () => {
  beforeAll(async () => {
    // Spin up DB
    await dbService.init()
  })

  afterAll(async () => {
    // Close connections
    await dbService.close()
  })

  it('should run migrations and seed default templates', async () => {
    const templates = await dbService.all<any>('SELECT * FROM prompt_templates')
    expect(templates.length).toBeGreaterThan(0)
    
    // Check specific seeded ID
    const improveTemplate = templates.find((t: any) => t.id === 'improve')
    expect(improveTemplate).toBeDefined()
    expect(improveTemplate.name).toBe('Improve Writing')
  })

  it('should read and write key settings correctly', async () => {
    // Write test setting
    await dbService.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['test_key', 'test_value'])
    
    // Read test setting
    const result = await dbService.get<{ value: string }>('SELECT value FROM settings WHERE key = ?', ['test_key'])
    expect(result).toBeDefined()
    expect(result?.value).toBe('test_value')
  })

  it('should support creating and deleting custom user templates', async () => {
    const id = 'custom_test_123'
    
    // Insert
    await dbService.run(
      'INSERT INTO prompt_templates (id, name, system_instruction, user_template, is_custom) VALUES (?, ?, ?, ?, ?)',
      [id, 'Test Custom Action', 'Translate to German', '{{text}}', 1]
    )

    const check = await dbService.get<{ name: string }>('SELECT name FROM prompt_templates WHERE id = ?', [id])
    expect(check?.name).toBe('Test Custom Action')

    // Delete
    await dbService.run('DELETE FROM prompt_templates WHERE id = ?', [id])
    const checkDeleted = await dbService.get('SELECT * FROM prompt_templates WHERE id = ?', [id])
    expect(checkDeleted).toBeUndefined()
  })
})
