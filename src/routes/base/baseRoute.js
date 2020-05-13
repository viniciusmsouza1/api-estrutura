class BaseRoute {
    static methods() {
        return Object.getOwnPropertyNames(this.prototype)
            .filter(method => method !== 'constuctor' && !method.startsWith('_'))
    }
}

module.exports = BaseRoute