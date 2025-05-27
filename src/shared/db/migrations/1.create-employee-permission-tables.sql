PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS permission (
    id                              TEXT PRIMARY KEY,
    name                            TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS employee (
    id                              INTEGER PRIMARY KEY AUTOINCREMENT,
    name                            TEXT NOT NULL,
    email                           TEXT NOT NULL UNIQUE,
    password                        TEXT NOT NULL,
    created_at                      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    token_expired_at                TEXT
);

CREATE TABLE IF NOT EXISTS employee_permission (
    employee_id                     INTEGER NOT NULL REFERENCES employee(id) ON UPDATE CASCADE ON DELETE CASCADE,
    permission_id                   TEXT NOT NULL REFERENCES permission(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (employee_id, permission_id)
);
