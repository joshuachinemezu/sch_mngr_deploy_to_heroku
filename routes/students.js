var express = require('express')
var app = express()

// SHOW LIST OF STUDENTS
app.get('/', function(req, res, next) {

    // render to views/index.ejs template file
	{title: 'School Management App'}

	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM students ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'Students List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: 'Students List', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'School Management App',
		name: '',
		email: '',
		phone_num: '',		
		age: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('email', 'email is required').notEmpty()             //Validate email
    req.assert('phone_num', 'A valid phone_num is required').notEmpty()  //Validate phone_num
    req.assert('age', 'A valid age is required').notEmpty()  //Validate age

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			phone_num: req.sanitize('phone_num').escape().trim(),
			age: req.sanitize('age').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO students SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New Student',
						name: user.name,
						email: user.email,
						phone_num: user.phone_num,					
						age: user.age					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New Student',
						name: '',
						email: '',
						phone_num: '',					
						age: ''					
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New Student',
            name: req.body.name,
            email: req.body.email,
            phone_num: req.body.phone_num,
            age: req.body.age
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM students WHERE id = ' + req.params.id, function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Student not found with id = ' + req.params.id)
				res.redirect('/students')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: 'Edit Student Info', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					email: rows[0].email,
					phone_num: rows[0].phone_num,					
					age: rows[0].age					
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('email', 'Email is required').notEmpty()             //Validate email
    req.assert('phone_num', 'A valid phone_num is required').notEmpty()  //Validate phone_num
    req.assert('age', 'A valid age is required').notEmpty()  //Validate age

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			phone_num: req.sanitize('phone_num').escape().trim(),
			age: req.sanitize('age').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE students SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit Student Info',
						id: req.params.id,
						name: req.body.name,
						email: req.body.email,
						phone_num: req.body.phone_num,
						age: req.body.age
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit Student Info',
						id: req.params.id,
						name: req.body.name,
						email: req.body.email,
						phone_num: req.body.phone_num,
						age: req.body.age
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit Student Info',            
			id: req.params.id, 
			name: req.body.name,
			email: req.body.email,
			phone_num: req.body.phone_num,
			age: req.body.age
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM students WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to students list pemail
				res.redirect('/users')
			} else {
				req.flash('success', 'Student deleted successfully! id = ' + req.params.id)
				// redirect to students list pemail
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
