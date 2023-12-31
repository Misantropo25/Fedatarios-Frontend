import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoDocumento } from 'src/app/interfaces/tipo_documento.model';
import { TipoDocumentoService } from 'src/app/services/tipo_documento.service';

@Component({
  selector: 'app-tipo-documentos',
  templateUrl: './tipo-documentos.component.html',
  styleUrls: ['./tipo-documentos.component.css']
})
export class TipoDocumentosComponent implements OnInit {
  tipoDocumentos: TipoDocumento[] = [];
  tipoDocumentoSeleccionado: TipoDocumento | null = null;
  tipoDocumentoForm: FormGroup;

  @ViewChild('modalTipoDocumento') modalTipoDocumento:any;

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private formBuilder: FormBuilder
  ) {
    this.tipoDocumentoForm = this.formBuilder.group({
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarTipoDocumentos();
  }

  cargarTipoDocumentos(): void {
    this.tipoDocumentoService.getAllTipoDocumentos().subscribe(tipos => {
      this.tipoDocumentos = tipos;
    });
  }

  abrirModalCrear(): void {
    this.tipoDocumentoSeleccionado = new TipoDocumento();
    this.tipoDocumentoForm.reset();
    this.modalTipoDocumento.show();
  }

  abrirModalEditar(tipoDocumento: TipoDocumento): void {
    this.tipoDocumentoSeleccionado = { ...tipoDocumento };
    this.tipoDocumentoForm.patchValue(tipoDocumento);
    this.modalTipoDocumento.show();
  }

  guardarTipoDocumento(): void {
    if (this.tipoDocumentoForm.valid) {
      const tipoDocumento: TipoDocumento = { ...this.tipoDocumentoSeleccionado, ...this.tipoDocumentoForm.value };
      if (tipoDocumento.idtipo_documento) {
        // Actualizar
        this.tipoDocumentoService.updateTipoDocumento(tipoDocumento.idtipo_documento, tipoDocumento).subscribe(() => {
          this.cerrarModal();
          this.cargarTipoDocumentos();
        });
      } else {
        // Crear
        this.tipoDocumentoService.createTipoDocumento(tipoDocumento).subscribe(() => {
          this.cerrarModal();
          this.cargarTipoDocumentos();
        });
      }
    }
  }

  cerrarModal(): void {
    this.modalTipoDocumento.hide();
  }

  eliminarTipoDocumento(id: number): void {
    this.tipoDocumentoService.deleteTipoDocumento(id).subscribe(() => {
      this.cargarTipoDocumentos();
    });
  }
}