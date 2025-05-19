<template>
  <div class="row documents">
    <div
      class="col-md-6 col-xl-6"
      v-for="doc in combinarDocumentosConComentarios(documentos, comentarios)"
    >
      <div class="doc-card">
        <div class="doc-header">
          <span>{{ doc.nombre }}</span>
          <button class="exit"><span class="ti-trash"></span></button>
        </div>
        <div class="doc-content row">
          <div class="content-left col-md-4">
            <span
              class="ti-file"
              style="font-size: 4rem; cursor: pointer"
            ></span>
            {{ doc.tipo }}
            <button class="comment-btn">Cometar</button>
          </div>
          <div class="content-right col-md-8">
            <div class="comment" v-for="comentario in doc.comentarios">
              <div class="comment-header">
                <button class="exit"><span class="ti-trash"></span></button>
              </div>

              <div class="comment-content">
                {{ comentario.comentario }}
              </div>
              <div class="comment-footer">
                <span>{{ comentario.autor }}</span>
                <span>{{ comentario.fecha }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="doc-footer">{{ doc.fecha }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "documents",
  data() {
    return {
      documentos: [
        {
          id: 1,
          nombre: "Documento 1",
          tipo: "PDF",
          fecha: "2023-10-01",
          responsable: "Juan Pérez",
        },
        {
          id: 2,
          nombre: "Documento 2",
          tipo: "Word",
          fecha: "2023-10-02",
          responsable: "María López",
        },
        {
          id: 3,
          nombre: "Documento 2",
          tipo: "Word",
          fecha: "2023-10-02",
          responsable: "María López",
        },
        {
          id: 4,
          nombre: "Documento 2",
          tipo: "Word",
          fecha: "2023-10-02",
          responsable: "María López",
        },
        {
          id: 5,
          nombre: "Documento 2",
          tipo: "Word",
          fecha: "2023-10-02",
          responsable: "María López",
        },
      ],
      comentarios: [
        {
          id: 1,
          documentoId: 1,
          comentario: "Comentario sobre el documento 1",
          fecha: "2023-10-01",
          autor: "Juan Pérez",
        },
        {
          id: 2,
          documentoId: 2,
          comentario: "Comentario sobre el documento 2",
          fecha: "2023-10-02",
          autor: "María López",
        },
        {
          id: 3,
          documentoId: 1,
          comentario: "Comentario sobre el documento 1",
          fecha: "2023-10-01",
          autor: "Juan Pérez",
        },
        {
          id: 4,
          documentoId: 2,
          comentario: "Comentario sobre el documento 2",
          fecha: "2023-10-02",
          autor: "María López",
        },
        {
          id: 5,
          documentoId: 2,
          comentario: "Comentario sobre el documento 2",
          fecha: "2023-10-02",
          autor: "María López",
        },
        {
          id: 5,
          documentoId: 2,
          comentario: "Comentario sobre el documento 2",
          fecha: "2023-10-02",
          autor: "María López",
        },
      ],
    };
  },
  methods: {
    combinarDocumentosConComentarios(documentos, comentarios) {
      // Agrupamos los comentarios por documentoId
      const comentariosPorDocumento = comentarios.reduce((acc, comentario) => {
        if (!acc[comentario.documentoId]) {
          acc[comentario.documentoId] = [];
        }
        acc[comentario.documentoId].push(comentario);
        return acc;
      }, {});

      // Combinamos los documentos con sus comentarios
      const resultado = documentos.map((doc) => {
        return {
          ...doc,
          comentarios: comentariosPorDocumento[doc.id] || [],
        };
      });

      return resultado;
    },
  },
};
</script>

<style scoped>
.doc-card {
  overflow: hidden;
  border-radius: 5px;
  margin: 10px;
  background-color: #fbf5f3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.doc-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding: 10px;
  margin-bottom: 5px;
  color: white;
  background-color: #0e9594;

  .exit {
    margin: 0;
    border: none;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
    color: #fbf5f3;
  }

  .exit:hover {
    transition: all 0.2s ease;
    background-color: #d5d5d5;
    color: #000;
  }
}

.doc-content {
  padding: 10px;
  color: #333;
}

.content-left {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #572127;

  .comment-btn {
    background-color: #0e9594;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-top: 10px;
  }
  .comment-btn:hover {
    background-color: #127475;
    scale: 1.02;
    transition: all 0.2s ease;
  }
}

.content-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 150px;
  overflow-y: auto;
}

.doc-footer {
  padding: 3px;
  color: #666;
  background-color: rgb(236, 236, 236);
}

.comment {
  margin: 5px 0;
  padding: 5px;
  border-radius: 5px;
  background-color: #fbf5f3;
  box-shadow: 0 1px 2px rgba(18, 116, 117, 0.6);
}

.comment-header {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0;
  margin: 0;

  .exit {
    padding: 0px 2px;
    margin: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #000;
  }

  .exit:hover {
    background-color: #d5d5d5;
    transition: all 0.2s ease;
  }
}

.comment-content {
  padding-bottom: 5px;
}
.comment-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  border-top: #b1b1b1 solid 1px;
  color: #b1b1b1;
}
</style>
