export default interface Note {
  title: string
  content: string
  description: string
  type: 'TESTING' | 'DESARROLLO' | 'DESARROLNV' | 'IMPLEMENTA'
  client: string
  id: string
  originalId?: string
}
