//Arquivo de configuração do banco de dados 
import Sequelize from 'sequelize'; 
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', { 
    host: 'localhost', 
    dialect: 'postgres',
    port: 5432
}); 
    
export default sequelize;