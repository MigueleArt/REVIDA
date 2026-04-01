/**
 * @jest-environment jsdom
 */

import { getUsuarios, getUsuario, crearUsuario } from '../src/services/api';

// Mock global fetch
beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('API Service — getUsuarios', () => {
    it('retorna la lista de usuarios cuando el servidor responde OK', async () => {
        const mockData = { success: true, data: [{ id: 1, nombre: 'Alan' }] };
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await getUsuarios();
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/usuarios');
    });

    it('lanza error descriptivo cuando el servidor devuelve error', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: 'Error interno del servidor' }),
        });

        await expect(getUsuarios()).rejects.toThrow('Error interno del servidor');
    });
});

describe('API Service — getUsuario', () => {
    it('obtiene un usuario por ID', async () => {
        const mockData = { success: true, data: { id: 2, nombre: 'Miguel' } };
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await getUsuario(2);
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/usuarios/2');
    });

    it('lanza error cuando el usuario no existe (404)', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 404,
            json: () => Promise.resolve({ message: 'El usuario con ID 99 no existe en la base de datos' }),
        });

        await expect(getUsuario(99)).rejects.toThrow('El usuario con ID 99 no existe');
    });
});

describe('API Service — crearUsuario', () => {
    it('crea un usuario con POST y retorna los datos', async () => {
        const mockData = { success: true, data: { id: 4, nombre: 'Sofia' } };
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await crearUsuario('Sofia');
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: 'Sofia' }),
        });
    });

    it('lanza error cuando falta el nombre (400)', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ message: "El campo 'nombre' es obligatorio para registrar un usuario" }),
        });

        await expect(crearUsuario('')).rejects.toThrow("El campo 'nombre' es obligatorio");
    });
});
