const app = require('./app');
const { checkConnection } = require('./middleware/createDatabase');
const { createAdmission, getAdmission, updateAdmission, deleteAdmission, isAdmissionNumberUnique, getAdmissionData } = require('./middleware/databaseCRUD');
const { readCSV, insertOrUpdateData, fetchDataByAdmissionNumber } = require('./middleware/studentDataBase');



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
    const resp = await insertOrUpdateData(data);
    res.send(resp);
});

app.get('/checkData/:regNo',async (req,res,next)=>{
    const reg = req.params.regNo;
    const data = await fetchDataByAdmissionNumber(reg);
    res.send(data);
})
app.get('/getData/getAdmissionData',getAdmissionData);

const PORT = 1000;

app.listen(PORT, '192.168.124.197',() => {
    console.log(`Server is working on 192.168.124.197:${PORT}`);
});
