import { Student, StudentFilters, StudentListResponse } from '../types';
import { DEMO_STUDENTS } from '../constants';

export const studentService = {
  getStudents: async (
    filters: StudentFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<StudentListResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    let filtered = [...DEMO_STUDENTS];

    // Search mapping (Name, Roll, Email)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    // Filter mapping
    if (filters.status) {
      filtered = filtered.filter((s) => s.status === filters.status);
    }
    if (filters.department) {
      filtered = filtered.filter((s) => s.department === filters.department);
    }
    if (filters.program) {
      filtered = filtered.filter((s) => s.program === filters.program);
    }

    const totalCount = filtered.length;
    const pageCount = Math.ceil(totalCount / pageSize);
    const startIdx = pageIndex * pageSize;
    const paginated = filtered.slice(startIdx, startIdx + pageSize);

    return {
      students: paginated,
      totalCount,
      pageCount,
      pageIndex,
      pageSize,
    };
  },

  getStudent: async (studentId: string): Promise<Student> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const found = DEMO_STUDENTS.find((s) => s.studentId === studentId);
    if (!found) throw new Error('Student not found');
    return found;
  },
};
