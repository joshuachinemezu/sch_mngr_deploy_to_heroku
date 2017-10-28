var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {

	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM students ORDER BY id ASC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'School Management App', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: 'School Management App', 
					data: rows
				})
			}
		})
	})
})

module.exports = app
