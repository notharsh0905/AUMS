import { api } from '@/services/api';
import { Student, StudentFilters, StudentListResponse, StudentStatus } from '../types';

interface RawStudent {
  student_profile_id: string;
  user_id: string;
  admission_date?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  nationality?: string;
  category?: string;
  religion?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  roll_number: string;
  program: string;
  department: string;
  semester: number;
  status: string;
}

export const studentService = {
  getStudents: async (
    filters: StudentFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<StudentListResponse> => {
    const res = await api.get<RawStudent[]>('/students', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        search: filters.search,
        status: filters.status?.toUpperCase(),
        department: filters.department,
        program: filters.program,
      },
    });

    const list = res.data || [];
    const meta = (res as unknown as Record<string, unknown>).meta as { total?: number } || {
      page: pageIndex + 1,
      limit: pageSize,
      total: list.length,
    };
    const totalCount = meta.total || list.length;

    const students: Student[] = list.map((item) => ({
      studentId: item.student_profile_id,
      rollNumber: item.roll_number,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      phone: item.phone,
      gender: (item.gender || 'MALE').toLowerCase(),
      dateOfBirth: item.date_of_birth ? item.date_of_birth.slice(0, 10) : '',
      department: item.department,
      program: item.program,
      semester: item.semester,
      admissionDate: item.admission_date ? item.admission_date.slice(0, 10) : '',
      status: (item.status || 'active').toLowerCase() as StudentStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return {
      students,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  getStudent: async (studentId: string): Promise<Student> => {
    const res = await api.get<RawStudent>(`/students/${studentId}`);
    const item = res.data || res;
    return {
      studentId: item.student_profile_id,
      rollNumber: item.roll_number,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      phone: item.phone,
      gender: (item.gender || 'MALE').toLowerCase(),
      dateOfBirth: item.date_of_birth ? item.date_of_birth.slice(0, 10) : '',
      department: item.department,
      program: item.program,
      semester: item.semester,
      admissionDate: item.admission_date ? item.admission_date.slice(0, 10) : '',
      status: (item.status || 'active').toLowerCase() as StudentStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  createStudent: async (
    student: Omit<Student, 'createdAt' | 'updatedAt'>
  ): Promise<Student> => {
    // 1. Create User first
    const username = `${student.firstName.toLowerCase()}_${student.lastName.toLowerCase()}_${Date.now().toString().slice(-4)}`;
    const userRes = await api.post<{ user_id: string }>('/users', {
      username,
      email: student.email,
      password: 'TemporaryPassword123!',
      phone_number: student.phone,
      first_name: student.firstName,
      last_name: student.lastName,
    });

    const user = userRes.data || userRes;
    const userId = user.user_id;

    // 2. Create Student Profile
    await api.post<unknown>('/students', {
      user_id: userId,
      admission_date: student.admissionDate,
      date_of_birth: student.dateOfBirth,
      gender: student.gender.toUpperCase(),
      blood_group: 'O+',
      nationality: 'Indian',
      category: 'General',
      religion: 'None',
      emergency_contact_name: 'Emergency Parent',
      emergency_contact_phone: student.phone,
    });

    // 3. Find newly created student_profile_id by listing student profiles
    const profilesRes = await api.get<RawStudent[]>('/students');
    const profiles = profilesRes.data || [];
    const profile = profiles.find((p) => p.user_id === userId);

    if (!profile) throw new Error('Failed to resolve student profile');
    const studentProfileId = profile.student_profile_id;

    // 4. Resolve programs list to match program name
    const programsRes = await api.get<{ program_name: string; program_id: string }[]>('/programs').catch(() => ({ data: [] }));
    const programList = programsRes.data || [];
    let program = programList.find((p) => p.program_name === student.program);
    if (!program && programList.length > 0) {
      program = programList[0];
    }

    // 5. Create student enrollment
    await api.post<unknown>('/student-enrollments', {
      student_profile_id: studentProfileId,
      program_id: program?.program_id || '00000000-0000-0000-0000-000000000000',
      enrollment_number: student.rollNumber,
      enrollment_date: student.admissionDate,
      status: student.status.toUpperCase(),
      remarks: 'Registered via AUMS CRUD frontend',
    });

    return {
      ...student,
      studentId: studentProfileId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateStudent: async (
    studentId: string,
    student: Partial<Omit<Student, 'createdAt' | 'updatedAt'>>
  ): Promise<Student> => {
    const rawStudent = await api.get<RawStudent>(`/students/${studentId}`).then((r) => r.data || r);

    await api.put(`/students/${studentId}`, {
      date_of_birth: student.dateOfBirth || rawStudent.date_of_birth,
      gender: (student.gender || rawStudent.gender || 'MALE').toUpperCase(),
      blood_group: rawStudent.blood_group || 'O+',
      nationality: rawStudent.nationality || 'Indian',
      category: rawStudent.category || 'General',
      religion: rawStudent.religion || 'None',
      emergency_contact_name: rawStudent.emergency_contact_name || 'Emergency Parent',
      emergency_contact_phone: student.phone || rawStudent.emergency_contact_phone || rawStudent.phone,
    });

    return {
      ...student,
      studentId,
      updatedAt: new Date().toISOString(),
    } as Student;
  },

  deleteStudent: async (studentId: string): Promise<string> => {
    await api.delete(`/students/${studentId}`);
    return studentId;
  },
};
