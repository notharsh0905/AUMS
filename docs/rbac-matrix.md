# RBAC Design Principles

1. SUPER_ADMIN = All Permissions

2. INSTITUTION_ADMIN = Institution-wide Operations

3. Academic Hierarchy

SUPER_ADMIN
└── INSTITUTION_ADMIN
    └── DIRECTOR
        └── DEAN
            └── HOD
                └── FACULTY
                    └── CLASS_COORDINATOR

4. Students and Parents are self-service roles.

5. AUDITOR is read-only.

6. Future modules extend permissions without changing role codes.
