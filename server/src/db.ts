const { Pool } = require('pg');

export const pool = new Pool({
  connectionString: 'postgresql://u0_a247@localhost:5432/hoste_db',
});