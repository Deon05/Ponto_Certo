import { createClient } from "@supabase/supabase-js";
export class SupabaseDatabase {
  database;
  constructor(url, key) {
    this.database = createClient(url, key);
    return this;
  }
  async select(table, params = []) {
    const queryStart = this.database.from(table).select("*");
    const queryArray = [queryStart];
    params.forEach(([column, value], i) => {
      if (i === 0) {
        queryArray[i] = !value ? queryStart : queryStart.eq(column, value);
        return;
      }
      queryArray[i] = !value ? queryArray[i - 1] : queryArray[i - 1].eq(column, value);
    });
    const query = queryArray[queryArray.length - 1];
    const { data, error } = await query;
    if (error) return error;
    return data;
  }
  async insert(table, value) {
    const { data, error } = await this.database.from(table).insert(value).select().single();
    if (error) return error;
    return data;
  }
  async update(table, value, params = []) {
    const queryStart = this.database.from(table).update(value);
    const queryArray = [queryStart];
    params.forEach(([column, value], i) => {
      if (i === 0) {
        queryArray[i] = !value ? queryStart : queryStart.eq(column, value);
        return;
      }
      queryArray[i] = !value ? queryArray[i - 1] : queryArray[i - 1].eq(column, value);
    });
    const query = queryArray[queryArray.length - 1];
    const { data, error } = await query.select();
    if (error) return error;
    return data;
  }
  async delete(table, params = []) {
    const queryStart = this.database.from(table).delete();
    const queryArray = [queryStart];
    params.forEach(([column, value], i) => {
      if (i === 0) {
        queryArray[i] = !value ? queryStart : queryStart.eq(column, value);
        return;
      }
      queryArray[i] = !value ? queryArray[i - 1] : queryArray[i - 1].eq(column, value);
    });
    const query = queryArray[queryArray.length - 1];
    const { data, error } = await query.select();
    if (error) return error;
    return data;
  }
}
