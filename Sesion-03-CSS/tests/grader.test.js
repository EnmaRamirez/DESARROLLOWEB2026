import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function readFile(relativePath) {
  const fullPath = resolve(root, relativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, 'utf-8');
}

describe('Estructura del proyecto', () => {
  it('index.html debe existir', () => {
    assert.ok(existsSync(resolve(root, 'index.html')), 'index.html no encontrado');
  });

  it('styles.css debe existir', () => {
    assert.ok(existsSync(resolve(root, 'styles.css')), 'styles.css no encontrado');
  });

  it('index.html debe enlazar styles.css con <link>', () => {
    const html = readFile('index.html');
    assert.ok(html, 'index.html no se pudo leer');
    assert.ok(
      /<link[^>]+href=["']styles\.css["'][^>]*>/i.test(html),
      'No se encontró <link> hacia styles.css'
    );
  });

  it('index.html debe tener lang="es"', () => {
    const html = readFile('index.html');
    assert.ok(html, 'index.html no se pudo leer');
    assert.ok(
      /<html[^>]+lang=["']es["'][^>]*>/i.test(html),
      'El atributo lang="es" no está presente en <html>'
    );
  });
});

describe('Galería de productos — HTML', () => {
  const html = readFile('index.html');

  it('Debe contener al menos 6 artículos de producto', () => {
    assert.ok(html, 'index.html no se pudo leer');
    const matches = html.match(/<article[^>]*class=["'][^"']*producto[^"']*["']/gi);
    assert.ok(matches && matches.length >= 6,
      `Se encontraron ${matches ? matches.length : 0} artículos. Se requieren al menos 6.`);
  });

  it('Cada producto debe tener una imagen con atributo alt', () => {
    const imgMatches = html.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi);
    assert.ok(imgMatches && imgMatches.length >= 6,
      `Se encontraron ${imgMatches ? imgMatches.length : 0} imágenes con alt. Se requieren al menos 6.`);
  });

  it('Cada producto debe tener un botón con texto "Comprar"', () => {
    const btnMatches = html.match(/<button[^>]*>Comprar<\/button>/gi);
    assert.ok(btnMatches && btnMatches.length >= 6,
      `Se encontraron ${btnMatches ? btnMatches.length : 0} botones "Comprar". Se requieren al menos 6.`);
  });

  it('Cada producto debe tener un precio', () => {
    const precioMatches = html.match(/class=["'][^"']*precio[^"']*["']/gi);
    assert.ok(precioMatches && precioMatches.length >= 6,
      `Se encontraron ${precioMatches ? precioMatches.length : 0} elementos con clase "precio". Se requieren al menos 6.`);
  });

  it('Debe existir una sección con clase "galeria"', () => {
    assert.ok(
      /class=["'][^"']*galeria[^"']*["']/.test(html),
      'No se encontró la clase "galeria"'
    );
  });
});

describe('Galería de productos — CSS', () => {
  const css = readFile('styles.css');

  it('styles.css debe tener contenido', () => {
    assert.ok(css, 'styles.css no se pudo leer');
    assert.ok(css.trim().length > 50, 'styles.css parece vacío o muy corto');
  });

  it('Debe usar CSS Grid para la galería', () => {
    assert.ok(css, 'styles.css no se pudo leer');
    assert.ok(
      /display\s*:\s*grid/.test(css),
      'No se encontró display: grid en styles.css'
    );
  });

  it('Debe tener grid-template-columns para definir columnas', () => {
    assert.ok(css, 'styles.css no se pudo leer');
    assert.ok(
      /grid-template-columns/.test(css),
      'No se encontró grid-template-columns en styles.css'
    );
  });

  it('Debe tener al menos una @media query para diseño responsivo', () => {
    assert.ok(css, 'styles.css no se pudo leer');
    assert.ok(
      /@media/.test(css),
      'No se encontró @media query en styles.css'
    );
  });

  it('Debe estilizar el botón "Comprar" con :hover', () => {
    assert.ok(css, 'styles.css no se pudo leer');
    assert.ok(
      /:hover/.test(css),
      'No se encontró :hover en styles.css'
    );
  });

  it('Debe usar box-sizing: border-box', () => {
    assert.ok(css, 'styles.css no se pudo leer');
    assert.ok(
      /box-sizing\s*:\s*border-box/.test(css),
      'No se encontró box-sizing: border-box en styles.css'
    );
  });
});

describe('To-Do List', () => {
  const html = readFile('index.html');

  it('Debe existir una sección con clase "todo-list"', () => {
    assert.ok(html, 'index.html no se pudo leer');
    assert.ok(
      /class=["'][^"']*todo-list[^"']*["']/.test(html),
      'No se encontró la clase "todo-list"'
    );
  });

  it('Debe contener al menos 5 tareas con checkbox', () => {
    assert.ok(html, 'index.html no se pudo leer');
    const cbMatches = html.match(/<input[^>]*type=["']checkbox["'][^>]*>/gi);
    assert.ok(cbMatches && cbMatches.length >= 5,
      `Se encontraron ${cbMatches ? cbMatches.length : 0} checkboxes. Se requieren al menos 5.`);
  });

  it('Cada checkbox debe tener un label asociado con for', () => {
    assert.ok(html, 'index.html no se pudo leer');
    const forMatches = html.match(/<label[^>]*for=["'][^"']+["'][^>]*>/gi);
    assert.ok(forMatches && forMatches.length >= 5,
      `Se encontraron ${forMatches ? forMatches.length : 0} labels con for. Se requieren al menos 5.`);
  });
});

describe('Calidad de código', () => {
  const css = readFile('styles.css');
  const html = readFile('index.html');

  it('El HTML debe ser semántico (usar <article>, <section>, <main>)', () => {
    assert.ok(html, 'index.html no se pudo leer');
    assert.ok(/<article/.test(html), 'No se encontró <article>');
    assert.ok(/<section/.test(html), 'No se encontró <section>');
    assert.ok(/<main/.test(html), 'No se encontró <main>');
  });

  it('styles.css debe tener al menos 50 líneas de contenido', () => {
    assert.ok(css, 'styles.css no se pudo leer');
    const lines = css.split('\n').filter(l => l.trim().length > 0);
    assert.ok(lines.length >= 50,
      `styles.css tiene ${lines.length} líneas con contenido. Se requieren al menos 50.`);
  });

  it('No debe haber CSS inline en index.html', () => {
    assert.ok(html, 'index.html no se pudo leer');
    const inlineStyles = html.match(/style\s*=\s*["'][^"']+["']/gi);
    assert.ok(!inlineStyles || inlineStyles.length === 0,
      'Se encontró CSS inline. Todo el CSS debe estar en styles.css.');
  });
});
