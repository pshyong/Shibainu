const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'forum',
  password: '123456',
  port: 5432,
})

const addPage = (request, response) => {
	if (!request.body.hasOwnProperty("title")) {
		console.error("Request body did not have title parameter")
		response.status(400).end()
	} else {
		pool.query("INSERT INTO mainpage(title, cat_ids) VALUES ($1, 0);", [request.body.title], 
				(error, results) => {
					if (error) {
						console.error(error)
						response.status(500).end()
					}else {
						response.status(200).end()
					}
				})
	}
}

const getPages = (request, response) => {
	pool.query("SELECT * FROM mainpage;",
		(error, results) => {
			if (error) {	
				console.error(error)
				response.status(500).end()
			}else {
				response.status(200).json(results.rows)
			}
	})
	
}


module.exports = {
	addPage,
	getPages
}