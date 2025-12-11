import { SupabaseDatabase } from "ponto-certo/database/supabase";
import { MemoryAuth } from "ponto-certo/auth/memory";
import { EmployeeDAO } from "ponto-certo/class/employee.dao";
import { WorkHourDAO } from "ponto-certo/class/workhour.dao";

export const db = new SupabaseDatabase(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export const employeeDao = new EmployeeDAO(db);
export const workHourDao = new WorkHourDAO(db);
export const auth = new MemoryAuth(employeeDao);
