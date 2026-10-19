// Persistencia temporal: cada repositorio guarda sus registros en un array en memoria.
class MemoryRepository {
    #items = [];
    #nextId = 1;

    findAll() {
        return [...this.#items];
    }

    findById(id) {
        return this.#items.find((item) => item.id === id) ?? null;
    }

    findOne(predicate) {
        return this.#items.find(predicate) ?? null;
    }

    findMany(predicate) {
        return this.#items.filter(predicate);
    }

    save(entity) {
        entity.id = this.#nextId++;
        this.#items.push(entity);
        return entity;
    }

    update(id, changes) {
        const entity = this.findById(id);
        if (!entity) {
            return null;
        }
        return Object.assign(entity, changes);
    }

    delete(id) {
        const index = this.#items.findIndex((item) => item.id === id);
        if (index === -1) {
            return null;
        }
        const [removed] = this.#items.splice(index, 1);
        return removed;
    }

    clear() {
        this.#items = [];
        this.#nextId = 1;
    }
}

export default MemoryRepository;
