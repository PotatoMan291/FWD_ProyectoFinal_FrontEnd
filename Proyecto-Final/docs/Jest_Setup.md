# Jest - configuración

El proyecto ya incluye Jest en `package.json`, pero si la carpeta `node_modules` fue creada antes de agregar Jest, hay que instalar la dependencia una vez.

Desde `Proyecto-Final` ejecutar:

```bash
npm install
```

Si Jest todavía no aparece en `node_modules`, ejecutar explícitamente:

```bash
npm install --save-dev jest@30.2.0
```

Después:

```bash
npm test
```

También se puede ejecutar un archivo concreto:

```bash
npm test -- src/utils/tourUtils.test.js
```

El script del proyecto utiliza `--experimental-vm-modules` porque el proyecto usa ES Modules (`"type": "module"`).
