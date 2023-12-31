import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Rol } from '../../../interfaces/rol.model';
import { RolService } from '../../../services/rol.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  rolCrearForm: FormGroup;
  rolEditarForm: FormGroup;
  modalErrorRef!: BsModalRef;


  modalCrearRef!: BsModalRef;
  modalEditarRef!: BsModalRef;

  @ViewChild('errorModal') errorModal!: TemplateRef<any>;
  @ViewChild('modalCrear') modalCrearTemplate: any;
  @ViewChild('modalEditar') modalEditarTemplate: any;

  constructor(
    private rolService: RolService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) {
    this.rolCrearForm = this.formBuilder.group({
      descripcion_rol: ['', Validators.required],
    });
    this.rolEditarForm = this.formBuilder.group({
      idrol: ['', Validators.required],
      descripcion_rol: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  abrirModalCrear() {
    this.modalCrearRef = this.modalService.show(this.modalCrearTemplate);
  }

  cerrarModalCrear() {
    if (this.modalCrearRef) {
      this.modalCrearRef.hide();
    }
  }

  abrirModalEditar(rol: Rol): void {
    this.rolEditarForm.patchValue(rol);
    this.modalEditarRef = this.modalService.show(this.modalEditarTemplate);
  }

  cerrarModalEditar() {
    if (this.modalEditarRef) {
      this.modalEditarRef.hide();
    }
  }

  crearRol(): void {
    if (this.rolCrearForm.valid) {
      this.rolService.createRol(this.rolCrearForm.value).subscribe(() => {
        this.cargarRoles();
        this.cerrarModalCrear(); // Cambiado a cerrarModalCrear
      });
    }
  }

  editarRol(): void {
    if (this.rolEditarForm.valid) {
      const rol = this.rolEditarForm.value;
      this.rolService.updateRol(rol.idrol, rol).subscribe(() => {
        this.cargarRoles();
        this.cerrarModalEditar(); // Cambiado a cerrarModalEditar
      });
    }
  }

  eliminarRol(id: number): void {
    this.rolService.deleteRol(id).subscribe({
      next: () => {
        this.cargarRoles();
      },
      error: (error) => {
        if (
          error.error ===
          'Este rol le pertenece a varios usuarios, borre los usuarios para eliminar el rol'
        ) {
          this.mostrarModalError();
        }
      },
    });
  }

  mostrarModalError(): void {
    this.modalErrorRef = this.modalService.show(this.errorModal);
  }
}
