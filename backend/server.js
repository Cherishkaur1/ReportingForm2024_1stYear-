const app = require('./app');
const { checkConnection } = require('./middleware/createDatabase');
const { createAdmission, getAdmission, updateAdmission, deleteAdmission, isAdmissionNumberUnique } = require('./middleware/databaseCRUD');



// Test the database connection and create table if not exists
(async () => {
    await checkConnection();
})();

app.post('/',createAdmission);
app.get('/:admission_number',getAdmission);
app.put('/:admission_number',updateAdmission);
app.delete('/:admission_number',deleteAdmission);
app.get('/check/:admission_number',isAdmissionNumberUnique)

const PORT = 1000;

app.listen(PORT,'192.168.124.197', () => {
    console.log(`Server is working on http://192.168.124.197:${PORT}`);
});
