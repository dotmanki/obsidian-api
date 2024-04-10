import { Response, Router } from "express";
import { noteSchema } from "../schemas/noteSchema";
import Note from "../types/note.model";

const router = Router();
router.post("/", (req, res) => {
  fetch(`${process.env.API_URL}/obsidian`)
    .then((res) => res.json())
    .then((data) => {
      const notes: Note[] = data.map((note: any) => {
        return {
          title: note.detalle,
          content: note.comentario,
          client: note.nom_enti,
          id: note.numero,
        };
      });

      if (notes.length > 0) {
        notes.forEach((note) => {
          const content = `# Detalle:\n ${note.title}\n\n# Comentarios:\n ${note.content}`;
          fetch(
            `${process.env.OBSIDIAN_URL}/vault/${note.client}/${note.id}.md`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "text/markdown",
                Authorization: `Bearer ${process.env.OBSIDIAN_TOKEN}`,
              },
              body: content,
            }
          ).then(() => {});
        });
      }

      res.json(notes);
    });
});

export default router;
