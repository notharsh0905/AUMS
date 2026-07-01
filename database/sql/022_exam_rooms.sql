CREATE TABLE exam_rooms (
    exam_room_id UUID PRIMARY KEY,
    building VARCHAR(255) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    floor INTEGER NOT NULL,
    block VARCHAR(100),
    capacity INTEGER NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    has_projector BOOLEAN NOT NULL DEFAULT FALSE,
    has_ac BOOLEAN NOT NULL DEFAULT FALSE,
    wheelchair_accessible BOOLEAN NOT NULL DEFAULT FALSE,
    institution_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_exam_rooms_institution
        FOREIGN KEY (institution_id)
        REFERENCES institutions(institution_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_exam_room_number UNIQUE (building, room_number)
);
