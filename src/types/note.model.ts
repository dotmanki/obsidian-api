export default interface Note {
  title: string
  content: string
  type: 'TESTING' | 'DESARROLLO' | 'DESARROLNV' | 'IMPLEMENTA'
  client: string
  id: string
  originalId?: string
}
