const express= require('express')
var db = require('./database.js')
const bodyParser = require('body-parser');
const moment=require('moment-timezone')

app = express();
app.use(express.static( "public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.get('/',(req,res)=>{
	db.query('SELECT * FROM Student_Information',(sql,data)=>{
		// console.log(data[0].Name);
		let date=moment.tz('Asia/Kolkata').format('YYYY-MM-DD');
		res.render('homepage.ejs',{'data':data,'date':date});
	});
});

app.post('/add_student',(req,res)=>{
	let name=req.body.name;
	let roll_no=req.body.roll_no;
	let dept=req.body.dept;
	let qry="INSERT INTO Student_Information VALUES ("+roll_no+",'"+name+"','"+dept+"');";
	db.query(qry,(err,data)=>{
		if(err)
		{
			res.send('Error!');
		}
		else 
		{
			res.send('Student Added!');
		}
	});
});

app.post('/fill_entry',(req,res)=>{
	let temp=req.body.temp;
	let roll_no=req.body.roll_no;
	var date = moment.tz('Asia/Kolkata').format('YYYY-MM-DD');
	if(temp>=36 && temp<=38)
	{
		var qry = "INSERT INTO Reports VALUES("+roll_no+",'"+date+"','FIT')"
		db.query(qry,(err,data)=>{
			if(err){
				res.send('Attendance Cannot be Marked');
			}
			else 
			{
				res.send('Attendance Marked Successfully.');
			}
		});
	}
	else 
	{
		var qry = "INSERT INTO Reports VALUES("+roll_no+",'"+date+"','UNFIT')"
		db.query(qry,(err,data)=>{
			if(err){
				res.send('Attendance Cannot be Marked');
			}
			else 
			{
				res.send('Attendance Marked Successfully.');
			}
		});
	}
});

app.get('/status/:id',(req,res)=>{
	let roll_no=req.params.id;
	let qry="SELECT * FROM Reports WHERE Roll_no='"+roll_no+"'";
	db.query(qry,(err,data)=>{
		if(err || data.length==0)
		{
			res.send('Record not found!');
		}
		else 
		{
			const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
			var todaydate = moment.tz('Asia/Kolkata').format('YYYY-MM-DD');
			var month = moment.tz('Asia/Kolkata').format('MMMM');
			var startDate = moment(startOfMonth);
			var startDate1=moment(startDate).format("YYYY-MM-DD");
			var endDate = moment(todaydate);
			endDate.add(1, 'days');
			var result = [];
			

			if (endDate.isBefore(startDate)) {
				throw "End date must be greated than start date."
			}      

			while (startDate.isBefore(endDate)) {
				result.push(startDate.format("YYYY-MM-DD"));
				startDate.add(1, 'days');
			}
			
			
			let data_monthly={};
			let attended={};
			let data_complete={};
			let fit=0,unfit=0,absent=0;
			for(let i=0;i<data.length;i++)
			{
				data[i].Date=moment(data[i].Date).format("YYYY-MM-DD");
				if(moment(data[i].Date).isSameOrAfter(startDate1)){
				data_monthly[data[i].Date]=data[i].Status;
				attended[data[i].Date]='P';
				if(data[i].Status=='FIT')fit++;
				else unfit++;}
			}
			
			
			for(let i=0;i<result.length;i++)
			{
				if(attended[result[i]]=='P')
					data_complete[result[i]]=data_monthly[result[i]];
				else 
					{data_complete[result[i]]='ABSENT';absent++;}
			}
			// console.log(month);
			// res.send(data_complete);
			res.render('show_report.ejs',{'dates':result,'data':data_complete,'roll_no':data[0].Roll_no,'fit':fit,'unfit':unfit,'absent':absent,'month':month});
		}
	});
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});