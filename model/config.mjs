import { Sequelize, Op } from 'sequelize';

    const sequelize = new Sequelize(
    {
        host: 'localhost',
        port: 5433,
        //schemas: 'public',
        database: 'myBooks2',
        dialect: 'postgres',
        username: 'postgres',
        password: '13-01-59',
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true//βαζει ενα 'ς' στο τελος των μοντέλων σαν ονόματα πινακων
        }
    });
    /* //Σύνδεση στη βάση που θα δημιουργηθεί στο heroku 
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            logging: false,
            define: {
                timestamps: false,
                freezeTableName: true
            }
        }
    });
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    */

export default sequelize