export default interface Note {
  title: string
  content: string
  type: 'TESTING' | 'DESARROLLO' | 'DESARROLLONV' | 'IMPLEMENTA'
  client: string
  id: string
  originalId?: string
}
