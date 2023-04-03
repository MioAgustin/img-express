const mysql = require('mysql2/promise');

async function connectdb() {
    const connection = await mysql.createConnection({
        host: 'aws.connect.psdb.cloud',
        user: '6fso5g25magr3s0cokbt',
        password: 'pscale_pw_5HOsAJTI8TDsR2YcmuijZ7RvErkvw9Grf5c709xshgi',
        database: 'expressdb',
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    return connection;
}

module.exports = {connectdb}