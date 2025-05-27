<template>
  <div>
    <button id="button-agregar" @click="formShow = true">
      Agregar Documento <span class="ti-plus"></span>
    </button>
    <!-- 
      FORMULARIO PARA AGREGAR DOCUMENTO
    -->
    <card v-if="formShow" class="card">
      <div class="card-header">
        <button class="exit" @click="exit">
          <span class="ti-close"></span>
        </button>
      </div>

      <div>
        <form @submit.prevent="addDocument">
          <div class="row">
            <div class="col-md-8">
              <fg-input
                type="text"
                label="Nombre"
                placeholder="Nombre"
                v-model="documentAux.nombre"
                required
              />
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <div class="form-group">
                <label>Descripción</label>
                <textarea
                  rows="5"
                  class="form-control border-input"
                  placeholder="Aquí puede estar la descripción"
                  v-model="documentAux.descripcion"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div v-if="!fileInfo" class="col-md-4">
              <div class="form-group">
                <input
                  type="file"
                  ref="fileInput"
                  style="display: none"
                  @change="handleFileChange"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="$refs.fileInput.click()"
                >
                  <span class="ti-file"></span> Archivo
                  <span class="ti-plus"></span>
                </button>
                <div v-if="fileError" class="text-danger mt-2">
                  {{ fileError }}
                </div>
              </div>
            </div>

            <!-- Vista previa del archivo -->
            <div v-else class="col-md-6">
              <div class="card mt-3 p-2 d-flex flex-row align-items-center">
                <span
                  class="me-5 ti-file text-muted"
                  style="font-size: 1.5rem"
                ></span>

                <div class="flex-grow-1">
                  <div
                    class="text-muted d-flex flex-column"
                    style="font-size: 0.9rem"
                  >
                    <span
                      >{{ fileInfo.nombre }} -
                      {{ (fileInfo.tamano / 1024).toFixed(1) }} KB</span
                    >
                  </div>
                </div>

                <button
                  class="btn btn-sm btn-outline-danger ms-2"
                  @click="deleteFile"
                >
                  <span class="ti-close"></span>
                </button>
              </div>
            </div>
          </div>

          <div
            class="text-center mt-4"
            style="display: flex; justify-content: center; gap: 5px"
          >
            <p-button type="info" native-type="submit">
              <span class="ti-save"></span>
              <span style="margin-left: 5px">Guardar</span>
            </p-button>

            <p-button type="danger" @click.native.prevent="clean">
              <span class="ti-trash"></span>
              <span style="margin-left: 5px">Limpiar</span>
            </p-button>
          </div>
          <div class="clearfix"></div>
        </form>
      </div>
    </card>

    <!-- 
      LISTADO DE DOCUMENTOS
    -->
    <div v-if="docs_await" class="spinner-container">
      <div class="spinner"></div>
    </div>

    <div v-else class="row documents">
      <div class="col-md-12 col-xl-6" v-for="doc in doc_comm">
        <div v-if="doc_await" class="spinner-container">
          <div class="spinner"></div>
        </div>
        <div v-else class="doc-card">
          <div class="doc-header">
            <div
              class="d-flex flex-column"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-height: 50px;
              "
            >
              <span>{{ doc.nombre }}</span> <span>{{ doc.descripcion }}</span>
            </div>
            <div>
              <button class="exit" @click="deleteDoc(doc.id)">
                <span class="ti-trash"></span>
              </button>
            </div>
          </div>
          <div class="doc-content row">
            <div class="content-left col-md-4">
              <span
                class="ti-file"
                style="font-size: 4rem; cursor: pointer"
                @click="abrirArchivo(doc.id, doc.tipo)"
              ></span>
              {{ tipoTangible(doc.tipo) }}
              <button
                v-if="!openComment"
                class="comment-btn"
                @click="openComment = true"
              >
                Comentar
              </button>
            </div>
            <div class="content-right col-md-8">
              <div v-if="openComment" class="row">
                <div class="col-md-12 mb-0">
                  <div class="form-group">
                    <label>Comentario</label>
                    <textarea
                      rows="2"
                      class="form-control border-input"
                      placeholder="Comentario..."
                      v-model="comentarioAux"
                      required
                    ></textarea>
                  </div>
                </div>
                <div
                  class="col-md-12 d-flex justify-content-center mt-0"
                  style="padding: 0px; margin: 0; gap: 10px"
                >
                  <button class="comment-btn m-0" @click="comment(doc.id)">
                    <span class="ti-check"></span> Listo
                  </button>
                  <button
                    class="comment-btn m-0"
                    style="background-color: #d5d5d5"
                    @click="
                      openComment = false;
                      comentarioAux = null;
                    "
                  >
                    <span class="ti-close"></span> Cancelar
                  </button>
                </div>
              </div>
              <div v-else class="comment" v-for="comentario in doc.comentarios">
                <div class="comment-header">
                  <button class="exit" @click="deleteComment(comentario.id)">
                    <span class="ti-trash"></span>
                  </button>
                </div>

                <div class="comment-content">
                  {{ comentario.comentario }}
                </div>
                <div class="comment-footer">
                  <span>{{ comentario.usuarioNombre }}</span>
                  <span>{{ cambiarFecha(comentario.fechaCreacion) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="doc-footer">{{ cambiarFecha(doc.fechaSubida) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  createDocumentoFachada,
  fetchDocumentosFachada,
  fetchFileFachada,
  deleteDocumentoFachada,
} from "@/clients/documents.js";
import {
  fetchComentariosFachada,
  createComentarioFachada,
  deleteComentarioFachada,
} from "@/clients/comments.js";
import { sendEmailFachada } from "@/clients/email.js";
import { cambiarFecha } from "@/utils/methods.js";

export default {
  name: "documents",
  props: {
    project: Object,
  },
  data() {
    return {
      documentAux: {},
      formShow: false,
      fileError: "",
      fileInfo: null,
      documentos: [],
      comentarioAux: "",
      openComment: false,
      doc_comm: [],
      doc_await: false,
      docs_await: false,
    };
  },

  mounted() {
    this.fetchAllDocs();
  },

  methods: {
    async fetchAllDocs() {
      this.docs_await = true;
      this.documentos = [];
      this.documentos = await fetchDocumentosFachada(this.project.id);
      this.docs_await = false;
      if (this.documentos) {
        this.doc_comm = await this.combinarDocumentosConComentarios(
          this.documentos,
        );
      }
    },

    addDocument() {
      const nuevoDocumento = {
        nombre: this.documentAux.nombre,
        descripcion: this.documentAux.descripcion,
        tipo: this.fileInfo.tipo,
        usuarioId: this.$store.state.userDbData.id,
        proyectoId: this.project.id,
        fechaSubida: new Date().toISOString(),
        tamanio: this.fileInfo.tamano,
        url: this.fileInfo.data,
      };

      if (nuevoDocumento) {
        this.postDocument(nuevoDocumento);
        this.clean(false);
        this.fetchAllDocs();
      }
    },

    async postDocument(doc) {
      this.formShow = false;
      await createDocumentoFachada(doc);
    },

    async deleteDoc(docId) {
      const resultado = confirm(
        "¿Estás seguro de que quieres eliminar el documento?",
      );
      if (resultado) {
        this.doc_await = true;
        await deleteDocumentoFachada(docId);
        this.doc_await = false;
        this.fetchAllDocs();
      }
    },

    async deleteComment(id) {
      const resultado = confirm(
        "¿Estás seguro de que quieres eliminar el comentario?",
      );
      if (resultado) {
        this.doc_await = true;
        await deleteComentarioFachada(id);
        this.doc_await = false;
        this.fetchAllDocs();
      }
    },

    async comment(docId) {
      const comentario = {
        documentoId: docId,
        usuarioId: this.$store.state.userDbData.id,
        comentario: this.comentarioAux,
        fechaCreacion: new Date().toISOString(),
      };
      await createComentarioFachada(comentario);
      this.notificarInvestigadores(comentario.comentario);

      this.fetchAllDocs();
      this.openComment = false;
    },

    notificarInvestigadores(comentario) {
      this.project.usuarios
        .filter((user) => user.id !== $store.state.userDbData.id)
        .forEach((user) => {
          const mail = {
            para: user.correo,
            asunto: this.project.titulo,
            mensaje: comentario,
            servicio: "Documentos_Comentarios",
          };
          sendEmailFachada(mail);
        });
    },

    async combinarDocumentosConComentarios(documentos) {
      const documentosConComentarios = await Promise.all(
        documentos.map(async (doc) => {
          let comentarios = [];
          try {
            const resultado = await fetchComentariosFachada(doc.id);
            comentarios = Array.isArray(resultado) ? resultado : [];
          } catch (error) {
            console.error(
              `Error obteniendo comentarios para doc ${doc.id}:`,
              error,
            );
            comentarios = [];
          }

          return {
            ...doc,
            comentarios,
          };
        }),
      );

      return documentosConComentarios;
    },

    handleFileChange(event) {
      this.fileError = "";
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Tipo de archivo no permitido");
        return;
      }

      if (file.size > 1024 * 1024) {
        this.fileError = "El archivo no debe pesar más de 1MB.";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.fileInfo = {
          nombre: file.name,
          tipo: file.type,
          tamano: file.size,
          data: reader.result,
        };
        console.log(this.fileInfo);
      };
      reader.readAsDataURL(file);
    },

    deleteFile() {
      this.fileInfo = null;
      this.$refs.fileInput = null;
    },

    async abrirArchivo(docId, docType) {
      this.docs_await = true;
      const archivo = await fetchFileFachada(docId);
      if (!archivo || !archivo.url || !docType) {
        alert("Error al obtener el archivo");
        return;
      }
      this.docs_await = false;

      // Crea un blob con los datos base64
      const byteCharacters = atob(archivo.url.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: docType });

      // Abre el blob en una nueva ventana/pestaña
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    },

    tipoTangible(tipoMime) {
      const tipos = {
        "application/pdf": "PDF",
        "application/msword": "Word (.doc)",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "Word (.docx)",
        "application/vnd.ms-excel": "Excel (.xls)",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "Excel (.xlsx)",
        "image/jpeg": "Imagen JPEG",
        "image/png": "Imagen PNG",
      };
      return tipos[tipoMime] || "Archivo";
    },
    exit() {
      const resultado = confirm("¿Estás seguro de que quieres salir?");
      if (resultado) {
        this.clean(false);
        this.formShow = false;
      }
    },
    clean(type) {
      if (type) {
        if (
          !confirm(
            "¿Estás seguro de que quieres limpiar los campos del formulario?",
          )
        ) {
          return;
        }
      }

      this.documentAux = {};
      this.deleteFile();
    },
    cambiarFecha,
  },
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 1%;
}

.exit {
  background-color: gainsboro;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 5px;
  color: #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.exit:hover {
  background-color: #d5d5d5;
  transition: all 0.2s ease;
}

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
}
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
.content-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 200px;
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

#button-agregar {
  border-radius: 4px;
  background-color: #f5dfbb;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 15px 10px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

#button-agregar:hover {
  scale: 1.02;
  transition: all 0.2s ease;
  cursor: pointer;
}

.spinner-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
