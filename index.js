module.exports = function lockReleasePlugin (schema, modelName) {
    if (!modelName) {
        throw new Error('modelName is required');
    }

    schema.add({
        locked: {
            type: Date,
            default: Date.now
        }
    });

    schema.methods.lock = function lock (duration, cb) {
        var now = new Date();
        this.model(modelName).findOneAndUpdate({
            _id: this._id,
            locked: {
                $lt: now
            }
        }, {
            locked: new Date(now.getTime() + duration)
        }, {
            new: true
        }, cb);
    };

    schema.methods.release = function release (cb) {
        this.model(modelName).findOneAndUpdate({
            _id: this._id,
        }, {
            locked: new Date()
        }, {
            new: true
        }, cb);
    };

    schema.methods.isLocked = function isLocked (cb) {
        return this.locked > new Date();
    };
}
