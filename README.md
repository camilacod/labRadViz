# Visualización de Datos con Flask y D3.js

Este proyecto es una aplicación web para visualizar datos utilizando Flask como backend y D3.js para las visualizaciones en el frontend.

## Requisitos

- Python 3.11+
- Flask
- Pandas
- NumPy

## Instalación

1. Clone el repositorio:
   ```
   git clone https://github.com/camilacod/labRadViz.git
   cd labRadViz
   ```
2. Cree un entorno virtual y luego activelo:
   ```
   python -m venv venv && source venv/Scripts/activate
   ```

2. Instale las dependencias:
   ```
   pip install -r requirements.txt
   ```

## Ejecución

1. Inicie la aplicación:
   ```
   python app.py
   ```

2. Abra su navegador y visite:
   ```
   http://127.0.0.1:5000/
   ```

## Estructura del Proyecto

```
├── app.py                # Aplicación principal de Flask
├── requirements.txt      # Dependencias del proyecto
├── static/              
│   ├── css/              # Hojas de estilo
│   │   └── styles.css    
│   └── js/               # JavaScript para visualizaciones
│       └── visualizations.js
└── templates/            # Plantillas HTML
    └── index.html
```
