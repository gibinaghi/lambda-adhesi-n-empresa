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
serverless invoke -f dev-generate-metadata --path event.json --log
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