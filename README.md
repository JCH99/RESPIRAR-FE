![G1 banner](https://smlab.imd.ufrn.br/wp-content/uploads/2022/12/FIWARE.png)

Web: [Identity Manager
](http://46.17.108.45:3000/)

# Instrucciones para levantar el Proyecto la webapp

1. Clonar el repositorio
2. Crear un archivo .env.local con la siguiente variable de entorno.

```
NEXT_PUBLIC_BASE_URL=${API_URL}
```

3. La API_URL deberá remplazarse por la del servidor FIWARE previamente creado. Un minitutorial se encuentra en el siguiente README [README](https://github.com/FdValls/Respirar-mobile/blob/main/README.md)

4. Corroborar tener node > 16 instalado en el sistema y luego instalar las dependencias.

```bash
  npm install
```

5. Correr el proyecto. Se podrá acceder desde localhost:3000

```bash
  npm run dev
```

# FIWARE Keyrock [Identity Manager]

A continuación explicaremos brevemente la integracion con FIWARE a traves de **Keyrock** , un habilitador de identidades que nos permite autenticarnos en la api. Explicaremos tanto la funcionalidad, cómo tambien la creación de usuarios, organizaciones y asignaciones de roles.

**Integrantes**\
Fernando Valls\
Ezequiel Cherone\
Moises Natan Fuks\
Juan Manuel Campagna\
Joaquin Charovsky\
Elyelin Carrasquero

**Roles**

- Fernando Valls:

  Mobile - configuracion endPoints - arquitectura de vistas - crud organizaciones / roles - logout

- Ezequiel Cherone:

  Mobile - configuración nav lateral - login - crud usuarios / dockerizacion y montaje servidor

- Moises Natan Fuks

  Mobile - login - estilos - huella biométrica - crud user

- Juan Manuel Campagna

  Mobile - crud organizaciones / roles

- Joaquin Charovsky

  Front - login - endPoints - crud usuario - crud organizaciones

- Elyelin Carrasquero

  Mobile - styles - testing - documentación - manuales

**Funcionalidad**

Nuesta app comienza con la pantalla de login, el cual previamente deberá haberse creado un usuario en la pagina de keyrock y debe ser habilitado por un administrador.
Luego del login dependiendo de los permisos que tenga el usaurio verá las vistas permitidas (hay restricciones para la vista de algunos fragmentos dependiendo del rol que tenga el usuario, si es o no "admin").

Dashboard principal:

- Lista de organizaciones en la cual esta involucrado el usuario

Perfil NO administrador:

- Creación, edición y eliminación de organizaciones (siempre y cuando sea "owner" de esa organización).

Perfil administrador:

- Creación, edición y eliminación de organizaciones (siempre y cuando sea "owner" de esa organización).

- Creación, edición y eliminación de usuarios.

- Asignación de usuarios con su correspondiente rol a una organización (siempre y cuando sea "owner" de esa organización).

- Visualización de usuarios y rol correspondientes a la organización seleccionada.

# Consultas

fernandodanielvalls@gmail.com\
campagnajuanmanuel@gmail.com\
moshifuks2001@gmail.com\
chero2005@hotmail.com\
joaquincharovsky@gmail.com\
elyelin15@gmail.com
