# Serverless Framework AWS Python

## Deployment

Para deployar la lambda:

```
serverless deploy
```

Luego verá un mensaje similiar al siguiente:

```
Deploying "aws-python" to stage "dev" (us-east-1)

✔ Service deployed to stack aws-python-dev (90s)

functions:
  hello: aws-python-dev-hello (1.9 kB)
```

## Invocation

Después del deploy exitoso, puede invocar la función implementada utilizando el siguiente comando:

```
serverless invoke -f dev-adhesionEmpresa --path event.json --log
```

### Depuración con VSCode

El proyecto incluye una configuración de depuración predefinida en `.vscode/launch.json`. Esta configuración está especialmente diseñada para depurar aplicaciones Flask con entorno virtual. Para comenzar a depurar:

1. Abre el proyecto en VSCode.
2. Establece puntos de interrupción (breakpoints) en tu código.
3. Presiona F5 o selecciona "Run and Debug" en el panel lateral.
4. Selecciona la configuración "Debug Lambda ES Module".

#### Configuración de Depuración

La configuración en `launch.json` incluye:

```json
 {
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Lambda ES Module",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "--loader",
        "ts-node/esm",
        "--no-warnings"
      ],
      "program": "${workspaceFolder}/src/main.ts",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}",
      "envFile": "${workspaceFolder}/.env",
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "TS_NODE_PROJECT": "${workspaceFolder}/tsconfig.json"
      }
    },
  ]
```

## Input/output

El input esperado se encuentra en el archivo event.json

```json
{
  "body": {
    "nombre": "Empresa Test Lambda SA",
    "cuit": "20123456781", 
    "tipo": "PYME",
    "fecha_adhesion": "2022-01-01",
    "activa": true
  }
}
```

El oputput esperado es:
```
Response: {
  statusCode: 201,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: '{"message":"Empresa registrada exitosamente","data":{"id":"emp-056"}}'
}
```

## Integración con el sistema existente

Esta Lambda puede integrarse con la API principal de empresas como microservicio.

Opciones de integración:

API Gateway → Lambda → PostgreSQL (se podría utulizar también RDS).


#### Flujo de integración

###### Cliente / Frontend

El usuario o sistema externo envía un POST /empresa/adhesion con los datos de la nueva empresa.

###### API Gateway

Es el “puente” que recibe la solicitud HTTP y la traduce a un evento que se envía a la Lambda.

###### AWS Lambda

Procesa el evento recibido, valida los datos de la empresa y decide si son correctos. Si todo está bien, prepara el objeto empresa para persistirlo.

###### Persistencia en base de datos

PostgreSQL / Amazon RDS:

Se puede reutilizar la misma BD (PostgreSQL). Esto asegura que la información de adhesiones esté centralizada con las transferencias.
