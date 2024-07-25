const app = require('./app');
const { checkConnection } = require('./middleware/createDatabase');
const { createAdmission, getAdmission, updateAdmission, deleteAdmission, isAdmissionNumberUnique } = require('./middleware/databaseCRUD');
const { readCSV } = require('./middleware/studentDataBase');



// Test the database connection and create table if not exists
(async () => {
    await checkConnection();
})();

app.post('/',createAdmission);
app.get('/:admission_number',getAdmission);
app.put('/:admission_number',updateAdmission);
app.delete('/:admission_number',deleteAdmission);
app.get('/check/:admission_number',isAdmissionNumberUnique)

app.post('/addData',async (req,res,next)=>{
    const data = await readCSV(req.body.data);
    res.send(data);
});

const PORT = 1000;

app.listen(PORT, () => {
    console.log(`Server is working on http://localhost:${PORT}`);
});
