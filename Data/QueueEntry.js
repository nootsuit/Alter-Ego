﻿class QueueEntry {
    constructor(timestamp, type, range, data) {
        this.timestamp = timestamp;
        this.type = type;
        this.range = range;
        this.data = data;
    }
}

module.exports = QueueEntry;
