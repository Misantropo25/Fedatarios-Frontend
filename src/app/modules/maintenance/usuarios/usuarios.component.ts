import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Usuario } from '../../../interfaces/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Rol } from '../../../interfaces/rol.model'; // Asegúrate de que la ruta sea correcta
import { RolService } from '../../../services/rol.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  modalRef?: BsModalRef;
  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  usuarioForm!: FormGroup;
  roles: Rol[] = [];
  changePassword: boolean = false;
  usuarioEditForm!: FormGroup;

  // Referencia al modal de error
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;
  errorModalRef!: BsModalRef;

  @ViewChild('templateCrearUsuario') templateCrearUsuario!: TemplateRef<any>;
  @ViewChild('templateEditarUsuarios')
  templateEditarUsuarios!: TemplateRef<any>;

  mostrarPasswordCrear = false;
  mostrarPasswordEditar = false;

  constructor(
    private rolService: RolService,
    private modalService: BsModalService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuariosYRoles();
    this.inicializarFormulario();
    this.inicializarEditFormulario();
  }

  cargarUsuariosYRoles(): void {
    forkJoin({
      usuarios: this.usuarioService.getUsuarios(),
      roles: this.rolService.getRoles(),
    }).subscribe(({ usuarios, roles }) => {
      this.changeDetector.detectChanges(); // Forzar la detección de cambios
      this.roles = roles;
      this.usuarios = usuarios.map((usuario) => ({
        ...usuario,
        rol: this.encontrarRolDeUsuario(usuario.idusuario, roles) || new Rol(), // Usa un rol predeterminado si no se encuentra uno
      }));
    });
  }

  encontrarRolDeUsuario(idUsuario: number, roles: Rol[]): Rol | undefined {
    for (const rol of roles) {
      if (rol.usuarios && rol.usuarios.some((u) => u.idusuario === idUsuario)) {
        return rol;
      }
    }
    return undefined;
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      apePaterno: ['', Validators.required],
      apeMaterno: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.pattern(/^\d{9}$/)],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required],
      fechaInicio: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ], // Ajusta la fecha actual como valor predeterminado
      foto: [''],
    });
  }

  inicializarEditFormulario(): void {
    this.usuarioEditForm = this.formBuilder.group({
      // Repite la estructura del formulario de creación, pero sin la parte de contraseña
      dni: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^\d{8}$/)],
      ],
      apePaterno: ['', Validators.required],
      apeMaterno: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.pattern(/^\d{9}$/)],
      rol: ['', Validators.required],
      fechaInicio: [{ value: '', disabled: true }, Validators.required],
      newPassword: [
        '',
        [
          Validators.pattern(/.*[!@#$%^&*(),.?":{}|<>].*/),
          Validators.minLength(6),
        ],
      ],
    });
  }

  ajustarFechaZonaHoraria(fechaString: string): string {
    const fecha = new Date(fechaString);
    const desplazamientoZonaHoraria = fecha.getTimezoneOffset() * 60000; // Desplazamiento en milisegundos
    const fechaLocal = new Date(fecha.getTime() - desplazamientoZonaHoraria);
    return fechaLocal.toISOString().split('T')[0];
  }

  // abrirModal(template: TemplateRef<any>, idUsuario?: number): void {
  //   if (idUsuario) {
  //     this.usuarioService.getUsuario(idUsuario).subscribe((usuarioData) => {
  //       this.rolService.getRoles().subscribe((rolesData) => {
  //         this.roles = rolesData;
  //         const rolUsuario = this.encontrarRolDeUsuario(idUsuario, rolesData);
  //         this.usuario = { ...usuarioData, rol: rolUsuario || new Rol() };
  //         this.llenarEditFormulario(this.usuario);
  //         this.modalRef = this.modalService.show(template);
  //       });
  //     });
  //   } else {
  //     this.usuarioForm.reset({
  //       fechaInicio: new Date().toISOString().split('T')[0],
  //       password: '',
  //     });
  //     this.usuario = new Usuario();
  //     this.modalRef = this.modalService.show(template);
  //   }
  // }

  abrirModal(template: TemplateRef<any>, idUsuario?: number): void {
    if (idUsuario) {
      this.usuarioService.getUsuario(idUsuario).subscribe((usuarioData) => {
        this.rolService.getRoles().subscribe((rolesData) => {
          this.roles = rolesData;
          const rolUsuario = this.encontrarRolDeUsuario(idUsuario, rolesData);
          this.usuario = {
            ...usuarioData,
            rol: rolUsuario || new Rol(),
            idusuario: idUsuario,
          };
          this.llenarEditFormulario(this.usuario);
          this.modalRef = this.modalService.show(template);
        });
      });
    } else {
      this.resetearUsuarioYFormulario();
      this.modalRef = this.modalService.show(template);
    }
  }
  resetearUsuarioYFormulario(): void {
    this.usuario = new Usuario();
    this.usuarioForm.reset({
      fechaInicio: new Date().toISOString().split('T')[0],
      password: '',
    });
  }

  cerrarModal(): void {
    this.modalRef?.hide();
    this.usuarioForm.reset({
      // Reiniciar el formulario y establecer valores predeterminados
      fechaInicio: new Date().toISOString().split('T')[0], // Fecha actual como valor predeterminado
      password: '', // Vacío
      newPassword: '', // Vacío
    });
    this.usuario = new Usuario(); // Reiniciar el objeto usuario
  }

  crearUsuario(): void {
    this.usuario = new Usuario();
    this.usuarioForm.reset({
      fechaInicio: new Date().toISOString().split('T')[0],
      password: '',
      newPassword: '',
    });
    this.abrirModal(this.templateCrearUsuario);
  }

  llenarFormulario(usuario: Usuario): void {
    const fechaInicioFormato = usuario.fechaInicio
      ? new Date(usuario.fechaInicio).toISOString().split('T')[0]
      : '';
    this.usuarioForm.patchValue({
      dni: usuario.dni,
      apePaterno: usuario.apePaterno,
      apeMaterno: usuario.apeMaterno,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      password: '', // No mostrar la contraseña cifrada
      rol: usuario.rol.idrol,
      fechaInicio: fechaInicioFormato,
    });
  }

  llenarEditFormulario(usuario: Usuario): void {
    // Asegúrate de que fechaInicio es una fecha
    const fechaInicio = usuario.fechaInicio
      ? new Date(usuario.fechaInicio)
      : new Date();
    const fechaInicioFormato = this.ajustarFechaZonaHoraria(
      fechaInicio.toISOString()
    );
    this.usuario = { ...usuario, idusuario: usuario.idusuario };
    this.usuarioEditForm.patchValue({
      dni: usuario.dni,
      apePaterno: usuario.apePaterno,
      apeMaterno: usuario.apeMaterno,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol.idrol,
      fechaInicio: fechaInicioFormato,
      descripcionRol: usuario.descripcionRol,
    });
  }

  // Cargar datos de RENIEC para registro
  cargarDatosReniec(): void {
    const dni = this.usuarioForm.get('dni')!.value;
    this.usuarioService.obtenerDatosReniec(dni).subscribe({
      next: (datos) => {
        this.usuarioForm.patchValue({
          apePaterno: datos.apPrimer,
          apeMaterno: datos.apSegundo,
          nombre: datos.prenombres,
          foto: datos.foto,
        });
      },
      error: (error) => {
        this.mostrarErrorModal();
      },
    });
  }

  // Método para mostrar el modal de error
  mostrarErrorModal(): void {
    this.errorModalRef = this.modalService.show(this.errorModal);

    // Ocultar el modal después de 2 segundos
    setTimeout(() => {
      this.ocultarErrorModal();
    }, 2000);
  }

  // Método para ocultar el modal de error
  ocultarErrorModal(): void {
    if (this.errorModalRef) {
      this.errorModalRef.hide();
    }
  }

  // Tu método existente que hace la llamada al servicio
  tuMetodoExistente(): void {
    // ... tu lógica existente aquí
    // en caso de error:
    this.mostrarErrorModal();
  }

  // On submit registros
  onSubmit(): void {
    let formValues: any;
    if (this.usuario && this.usuario.idusuario) {
      // Caso de edición de usuario
      formValues = this.usuarioEditForm.value;
      this.asignarValoresAUsuario(formValues);

      if (formValues.newPassword) {
        this.usuario.password = formValues.newPassword;
      }

      // Llama al servicio para actualizar
      this.usuarioService
        .updateUsuario(this.usuario.idusuario, this.usuario)
        .subscribe(() => {
          this.postOperacion();
        });
    } else {
      // Caso de creación de un nuevo usuario
      formValues = this.usuarioForm.value;
      this.asignarValoresAUsuario(formValues);
      // Llama al servicio para crear
      this.usuarioService.createUsuario(this.usuario).subscribe(() => {
        this.postOperacion();
      });
    }
  }

  private asignarValoresAUsuario(formValues: any): void {
    this.usuario.dni = formValues.dni;
    this.usuario.apePaterno = formValues.apePaterno;
    this.usuario.apeMaterno = formValues.apeMaterno;
    this.usuario.nombre = formValues.nombre;
    this.usuario.email = formValues.email;
    this.usuario.telefono = formValues.telefono;
    this.usuario.rol =
      this.roles.find((r) => r.idrol === formValues.rol) || new Rol();
    this.usuario.foto = formValues.foto;
    this.usuario.password = formValues.password;
    // No asignar la contraseña aquí ya que se maneja de manera especial
  }

  private postOperacion(): void {
    this.cargarUsuariosYRoles();
    this.modalRef?.hide();
  }

  eliminarUsuario(idusuario: number): void {
    this.usuarioService.deleteUsuario(idusuario).subscribe(() => {
      this.usuarios = this.usuarios.filter((u) => u.idusuario !== idusuario);
      this.cargarUsuariosYRoles();
    });
  }
}
