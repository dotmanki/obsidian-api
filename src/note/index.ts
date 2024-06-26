import { Response, Router } from 'express'
import { noteSchema } from '../schemas/noteSchema'
import Note from '../types/note.model'
import { validate } from '../validate'

const router = Router()
router.post('/', (req, res) => {
  fetch(`${process.env.API_URL}/obsidian`)
    .then((res) => res.json())
    .then((data) => {
      const notes: Note[] = data.map((note: any) => createNote(note))

      if (notes.length > 0) {
        notes.forEach((note) => {
          const content = createContent(note)
          fetch(
            `${process.env.OBSIDIAN_URL}/vault/${note.client}/${note.id}.md`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'text/markdown',
                Authorization: `Bearer ${process.env.OBSIDIAN_TOKEN}`,
              },
              body: content,
            }
          ).then(() => {})
        })
      }

      res.json(notes)
    })
})

router.param('numero', (req, res, next, numero) => {
  fetch(`${process.env.API_URL}/obsidian/${numero}`)
    .then((res) => res.json())
    .then((data) => {
      const notes: Note[] = data.map((note: any) => createNote(note))
      req.body = notes
      next()
    })
    .catch(() => next(new Error('API not available')))
})

router.post('/:numero', (req, res) => {
  const notes: Note[] = req.body
  if (notes.length > 0) {
    notes.forEach((note) => {
      const content = createContent(note)
      fetch(`${process.env.OBSIDIAN_URL}/vault/${note.client}/${note.id}.md`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/markdown',
          Authorization: `Bearer ${process.env.OBSIDIAN_TOKEN}`,
        },
        body: content,
      })
        .then(() => {})
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })
  }
  res.json(notes)
})

const createNote = (note: any) => ({
  title: note.titulo_,
  content: note.detalle,
  description: note.comentario,
  type: note.tipo_serv,
  client: note.nom_enti,
  id: note.numero,
  originalId: note.numero_ori,
})

const createContent = (note: Note) => {
  const badge =
    note.type === 'TESTING'
      ? '[!!|flask-conical|type:testing|var(--color-orange-rgb)]'
      : note.type === 'DESARROLNV' || note.type === 'DESARROLLO'
      ? '[!!|file-code|type:desarrollo|var(--color-cyan-rgb)]'
      : '[!!|file-up|type:implementacion|var(--color-yellow-rgb)]'

  const formattedDescription = urlFormat(note.description)
  note.description = formattedDescription
  return `${
    !!note.originalId && '[[' + note.client + '/' + note.originalId + ']]\n'
  }\`${badge}\`\n# Detalle:\n## ${note.title} \n${
    note.content
  }\n\n# Comentarios:\n ${note.description}`
}

const urlFormat = (text: string) =>
  text.replace('class=', '&class=').replace('id=', '&id=')

export default router
