/**
 * repositorio.test.js — Pruebas UNITARIAS del repositorio
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * Estas pruebas describen el comportamiento esperado de tus métodos.
 * No se conectan a Express ni a HTTP: prueban solo la capa de datos.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RepositorioAlumnos, datosSemilla } from '../src/repositorio.js';

describe('RepositorioAlumnos (unitario)', () => {
    it('listar() devuelve todos los alumnos iniciales', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        const alumnos = repo.listar();
        assert.equal(alumnos.length, datosSemilla.length);
        assert.equal(alumnos[0].nombre, 'Ana');
    });

    it('listar() devuelve una copia, no el arreglo interno', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        repo.listar().push({ id: 'x', nombre: 'X', apellido: 'Y', email: 'x@y', edad: 1 });
        assert.equal(repo.listar().length, datosSemilla.length);
    });

    it('obtener(id) devuelve el alumno correcto', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        assert.equal(repo.obtener('a-2').email, 'luis.perez@umg.edu.gt');
    });

    it('obtener(id) devuelve undefined si no existe', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        assert.equal(repo.obtener('no-existe'), undefined);
    });

    it('crear() genera un id y agrega el alumno', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        const nuevo = repo.crear({ nombre: 'Pedro', apellido: 'Ruiz', email: 'pedro@umg.edu.gt', edad: 19 });

        assert.equal(typeof nuevo.id, 'string');
        assert.ok(nuevo.id.length > 0, 'El id no debe estar vacío');
        assert.equal(repo.listar().length, datosSemilla.length + 1);
        assert.deepEqual(repo.obtener(nuevo.id), nuevo);
    });

    it('crear() no modifica el objeto que recibió', () => {
        const repo = new RepositorioAlumnos([]);
        const datos = { nombre: 'Sofía', apellido: 'Díaz', email: 'sofia@umg.edu.gt', edad: 20 };
        const nuevo = repo.crear(datos);
        assert.notEqual(nuevo, datos);
        assert.equal(datos.id, undefined);
    });

    it('actualizar() cambia solo los campos enviados', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        const actualizado = repo.actualizar('a-1', { edad: 33 });

        assert.equal(actualizado.edad, 33);
        assert.equal(actualizado.nombre, 'Ana', 'Los demás campos no deben perderse');
    });

    it('actualizar() devuelve undefined si el id no existe', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        assert.equal(repo.actualizar('no-existe', { edad: 20 }), undefined);
    });

    it('eliminar() quita el alumno y devuelve true', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        assert.equal(repo.eliminar('a-3'), true);
        assert.equal(repo.obtener('a-3'), undefined);
        assert.equal(repo.listar().length, datosSemilla.length - 1);
    });

    it('eliminar() devuelve false si el id no existe', () => {
        const repo = new RepositorioAlumnos(datosSemilla);
        assert.equal(repo.eliminar('no-existe'), false);
    });
});
